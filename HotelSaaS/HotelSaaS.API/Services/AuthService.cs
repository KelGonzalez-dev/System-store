using System.Security.Claims;
using AutoMapper;
using HotelSaaS.API.Common;
using HotelSaaS.API.Data;
using HotelSaaS.API.DTOs.Auth;
using HotelSaaS.API.Entities;
using HotelSaaS.API.Helpers;
using HotelSaaS.API.Interfaces.Repositories;
using HotelSaaS.API.Interfaces.Services;
using Microsoft.EntityFrameworkCore;

namespace HotelSaaS.API.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly ApplicationDbContext _context;
    private readonly JwtHelper _jwtHelper;
    private readonly IMapper _mapper;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        IUserRepository userRepository,
        ApplicationDbContext context,
        JwtHelper jwtHelper,
        IMapper mapper,
        IConfiguration configuration,
        ILogger<AuthService> logger)
    {
        _userRepository = userRepository;
        _context = context;
        _jwtHelper = jwtHelper;
        _mapper = mapper;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto, CancellationToken cancellationToken = default)
    {
        if (await _userRepository.EmailExistsAsync(dto.Email, cancellationToken: cancellationToken))
            throw ApiException.Conflict("Email is already registered.");

        var guestRole = await _context.Roles.FirstOrDefaultAsync(r => r.Name == RoleNames.Guest, cancellationToken)
            ?? throw ApiException.BadRequest("Guest role not configured.");

        var user = _mapper.Map<User>(dto);
        user.Email = dto.Email.ToLower();
        user.PasswordHash = PasswordHelper.Hash(dto.Password);
        user.EmailVerificationToken = Guid.NewGuid().ToString("N");
        user.EmailVerificationExpiry = DateTime.UtcNow.AddHours(24);

        await _userRepository.AddAsync(user, cancellationToken);
        _context.UserRoles.Add(new UserRole { UserId = user.Id, RoleId = guestRole.Id });
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("User registered: {Email}", user.Email);
        return await BuildAuthResponseAsync(user, cancellationToken);
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByEmailWithRolesAsync(dto.Email, cancellationToken)
            ?? throw ApiException.Unauthorized("Invalid email or password.");

        if (!user.IsActive)
            throw ApiException.Forbidden("Account is deactivated.");

        if (!PasswordHelper.Verify(dto.Password, user.PasswordHash))
            throw ApiException.Unauthorized("Invalid email or password.");

        return await BuildAuthResponseAsync(user, cancellationToken);
    }

    public async Task LogoutAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByIdAsync(userId, cancellationToken)
            ?? throw ApiException.NotFound("User not found.");

        user.RefreshToken = null;
        user.RefreshTokenExpiry = null;
        await _userRepository.UpdateAsync(user, cancellationToken);
    }

    public async Task<AuthResponseDto> RefreshTokenAsync(RefreshTokenDto dto, CancellationToken cancellationToken = default)
    {
        var principal = _jwtHelper.GetPrincipalFromExpiredToken(dto.AccessToken)
            ?? throw ApiException.Unauthorized("Invalid access token.");

        var userId = Guid.Parse(principal.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var user = await _userRepository.GetByIdWithRolesAsync(userId, cancellationToken)
            ?? throw ApiException.Unauthorized("User not found.");

        if (user.RefreshToken != dto.RefreshToken || user.RefreshTokenExpiry <= DateTime.UtcNow)
            throw ApiException.Unauthorized("Invalid or expired refresh token.");

        return await BuildAuthResponseAsync(user, cancellationToken);
    }

    public async Task ForgotPasswordAsync(ForgotPasswordDto dto, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByEmailAsync(dto.Email, cancellationToken);
        if (user == null) return;

        user.PasswordResetToken = Guid.NewGuid().ToString("N");
        user.PasswordResetExpiry = DateTime.UtcNow.AddHours(1);
        await _userRepository.UpdateAsync(user, cancellationToken);
        _logger.LogInformation("Password reset token generated for {Email}", user.Email);
    }

    public async Task ResetPasswordAsync(ResetPasswordDto dto, CancellationToken cancellationToken = default)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u =>
            u.PasswordResetToken == dto.Token &&
            u.PasswordResetExpiry > DateTime.UtcNow &&
            !u.IsDeleted, cancellationToken)
            ?? throw ApiException.BadRequest("Invalid or expired reset token.");

        user.PasswordHash = PasswordHelper.Hash(dto.NewPassword);
        user.PasswordResetToken = null;
        user.PasswordResetExpiry = null;
        await _userRepository.UpdateAsync(user, cancellationToken);
    }

    public async Task ChangePasswordAsync(Guid userId, ChangePasswordDto dto, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByIdAsync(userId, cancellationToken)
            ?? throw ApiException.NotFound("User not found.");

        if (!PasswordHelper.Verify(dto.CurrentPassword, user.PasswordHash))
            throw ApiException.BadRequest("Current password is incorrect.");

        user.PasswordHash = PasswordHelper.Hash(dto.NewPassword);
        await _userRepository.UpdateAsync(user, cancellationToken);
    }

    public async Task VerifyEmailAsync(VerifyEmailDto dto, CancellationToken cancellationToken = default)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u =>
            u.EmailVerificationToken == dto.Token &&
            u.EmailVerificationExpiry > DateTime.UtcNow &&
            !u.IsDeleted, cancellationToken)
            ?? throw ApiException.BadRequest("Invalid or expired verification token.");

        user.EmailVerified = true;
        user.EmailVerificationToken = null;
        user.EmailVerificationExpiry = null;
        await _userRepository.UpdateAsync(user, cancellationToken);
    }

    public async Task ResendVerificationAsync(ResendVerificationDto dto, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByEmailAsync(dto.Email, cancellationToken);
        if (user == null || user.EmailVerified) return;

        user.EmailVerificationToken = Guid.NewGuid().ToString("N");
        user.EmailVerificationExpiry = DateTime.UtcNow.AddHours(24);
        await _userRepository.UpdateAsync(user, cancellationToken);
    }

    private async Task<AuthResponseDto> BuildAuthResponseAsync(User user, CancellationToken cancellationToken)
    {
        var roles = user.UserRoles.Select(ur => ur.Role.Name).ToList();
        var permissions = user.UserRoles
            .SelectMany(ur => ur.Role.RolePermissions)
            .Select(rp => rp.Permission.Name)
            .Distinct()
            .ToList();

        var refreshToken = JwtHelper.GenerateRefreshToken();
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(int.Parse(_configuration["Jwt:RefreshTokenExpirationDays"]!));
        await _userRepository.UpdateAsync(user, cancellationToken);

        var accessToken = _jwtHelper.GenerateAccessToken(user, roles, permissions);
        var expiryMinutes = int.Parse(_configuration["Jwt:AccessTokenExpirationMinutes"]!);

        return new AuthResponseDto
        {
            UserId = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddMinutes(expiryMinutes),
            Roles = roles,
            Permissions = permissions
        };
    }
}
