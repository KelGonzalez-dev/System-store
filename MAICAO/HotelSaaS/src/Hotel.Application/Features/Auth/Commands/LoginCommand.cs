using Hotel.Application.Common.Interfaces;
using Hotel.Application.Features.Auth.DTOs;
using Hotel.Domain.Exceptions;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Hotel.Application.Features.Auth.Commands;

public record LoginCommand(string Email, string Password) : IRequest<LoginResponse>;

public class LoginCommandHandler : IRequestHandler<LoginCommand, LoginResponse>
{
    private readonly IUnitOfWorkApp _uow;
    private readonly ITokenService _tokenService;
    private readonly IPasswordService _passwordService;
    private readonly ILogger<LoginCommandHandler> _logger;

    public LoginCommandHandler(IUnitOfWorkApp uow, ITokenService tokenService,
        IPasswordService passwordService, ILogger<LoginCommandHandler> logger)
    {
        _uow = uow; _tokenService = tokenService;
        _passwordService = passwordService; _logger = logger;
    }

    public async Task<LoginResponse> Handle(LoginCommand request, CancellationToken ct)
    {
        var user = await _uow.Users.GetByEmailAsync(request.Email, ct)
            ?? throw new EntityNotFoundException("User", request.Email);

        if (user.Status == Hotel.Domain.Enums.UserStatus.Suspended)
            throw new UnauthorizedAccessException("Account is suspended.");

        if (user.LockedUntil.HasValue && user.LockedUntil > DateTime.UtcNow)
            throw new UnauthorizedAccessException($"Account locked until {user.LockedUntil:u}.");

        if (!_passwordService.Verify(request.Password, user.PasswordHash))
        {
            user.FailedLoginAttempts++;
            if (user.FailedLoginAttempts >= Hotel.Shared.Constants.AppConstants.Auth.MaxFailedLoginAttempts)
                user.LockedUntil = DateTime.UtcNow.AddMinutes(Hotel.Shared.Constants.AppConstants.Auth.LockoutMinutes);
            _uow.Users.Update(user);
            await _uow.SaveChangesAsync(ct);
            throw new UnauthorizedAccessException("Invalid credentials.");
        }

        user.FailedLoginAttempts = 0;
        user.LockedUntil = null;
        user.LastLoginAt = DateTime.UtcNow;

        var (accessToken, expiresAt) = _tokenService.GenerateAccessToken(user);
        var refreshToken = _tokenService.GenerateRefreshToken();
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(Hotel.Shared.Constants.AppConstants.Auth.RefreshTokenExpiryDays);

        _uow.Users.Update(user);
        await _uow.SaveChangesAsync(ct);

        _logger.LogInformation("User {Email} logged in successfully", user.Email);

        return new LoginResponse(
            accessToken, refreshToken, expiresAt,
            new UserDto(user.Id, user.Email, user.FirstName, user.LastName, user.Role.ToString(), user.HotelId));
    }
}