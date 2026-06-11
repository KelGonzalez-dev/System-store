using GuajiraBags.Api.Models.DTOs;
using GuajiraBags.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace GuajiraBags.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(AuthService auth) : ControllerBase
{
    /// <summary>Registrar un nuevo usuario admin</summary>
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest req)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var (ok, error, response) = await auth.RegisterAsync(req);
        if (!ok) return BadRequest(new { error });

        return Ok(response);
    }

    /// <summary>Iniciar sesión y obtener JWT</summary>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var (ok, error, response) = await auth.LoginAsync(req);
        if (!ok) return Unauthorized(new { error });

        return Ok(response);
    }
}