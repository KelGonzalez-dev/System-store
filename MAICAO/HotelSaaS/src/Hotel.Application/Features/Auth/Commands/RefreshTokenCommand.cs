using Hotel.Application.Common.Interfaces;
using Hotel.Application.Features.Auth.DTOs;
using Hotel.Domain.Exceptions;
using MediatR;

namespace Hotel.Application.Features.Auth.Commands;

public record RefreshTokenCommand(string RefreshToken) : IRequest<LoginResponse>;

public class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, LoginResponse>
{
    private readonly IUnitOfWorkApp _uow;
    private readonly ITokenService _tokenService;

    public RefreshTokenCommandHandler(IUnitOfWorkApp uow, ITokenService tokenService)
    { _uow = uow; _tokenService = tokenService; }

    public async Task<LoginResponse> Handle(RefreshTokenCommand request, CancellationToken ct)
    {
        var user = await _uow.Users.GetByRefreshTokenAsync(request.RefreshToken, ct)
            ?? throw new UnauthorizedAccessException("Invalid refresh token.");

        if (user.RefreshTokenExpiry < DateTime.UtcNow)
            throw new UnauthorizedAccessException("Refresh token expired.");

        var (accessToken, expiresAt) = _tokenService.GenerateAccessToken(user);
        var newRefreshToken = _tokenService.GenerateRefreshToken();
        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(Hotel.Shared.Constants.AppConstants.Auth.RefreshTokenExpiryDays);

        _uow.Users.Update(user);
        await _uow.SaveChangesAsync(ct);

        return new LoginResponse(accessToken, newRefreshToken, expiresAt,
            new UserDto(user.Id, user.Email, user.FirstName, user.LastName, user.Role.ToString(), user.HotelId));
    }
}