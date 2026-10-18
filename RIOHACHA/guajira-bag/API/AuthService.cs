using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using GuajiraBags.Api.Data;
using GuajiraBags.Api.Models;
using GuajiraBags.Api.Models.DTOs;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace GuajiraBags.Api.Services;

public class AuthService(AppDbContext db, IConfiguration config)
{
    // ── Registro ─────────────────────────────────────────────
    public async Task<(bool Ok, string Error, AuthResponse? Response)> RegisterAsync(RegisterRequest req)
    {
        if (await db.Usuarios.AnyAsync(u => u.Username == req.Username))
            return (false, "El nombre de usuario ya existe", null);

        if (await db.Usuarios.AnyAsync(u => u.Email == req.Email))
            return (false, "El correo ya está registrado", null);

        var usuario = new Usuario
        {
            Username     = req.Username,
            Email        = req.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password, workFactor: 12),
            Rol          = "admin"
        };

        db.Usuarios.Add(usuario);
        await db.SaveChangesAsync();

        var token = GenerarToken(usuario);
        return (true, string.Empty, token);
    }

    // ── Login ────────────────────────────────────────────────
    public async Task<(bool Ok, string Error, AuthResponse? Response)> LoginAsync(LoginRequest req)
    {
        var usuario = await db.Usuarios
            .FirstOrDefaultAsync(u => u.Username == req.Username && u.Activo);

        if (usuario is null || !BCrypt.Net.BCrypt.Verify(req.Password, usuario.PasswordHash))
            return (false, "Credenciales incorrectas", null);

        var token = GenerarToken(usuario);
        return (true, string.Empty, token);
    }

    // ── Generar JWT ──────────────────────────────────────────
    private AuthResponse GenerarToken(Usuario usuario)
    {
        var key      = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!));
        var creds    = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var minutes  = int.Parse(config["Jwt:ExpiresInMinutes"] ?? "1440");
        var expira   = DateTime.UtcNow.AddMinutes(minutes);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub,   usuario.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, usuario.Email),
            new Claim("username",                    usuario.Username),
            new Claim(ClaimTypes.Role,               usuario.Rol),
            new Claim(JwtRegisteredClaimNames.Jti,   Guid.NewGuid().ToString())
        };

        var jwt = new JwtSecurityToken(
            issuer:             config["Jwt:Issuer"],
            audience:           config["Jwt:Audience"],
            claims:             claims,
            expires:            expira,
            signingCredentials: creds
        );

        return new AuthResponse(
            Token:    new JwtSecurityTokenHandler().WriteToken(jwt),
            Username: usuario.Username,
            Email:    usuario.Email,
            Rol:      usuario.Rol,
            Expira:   expira
        );
    }
}