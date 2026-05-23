using HotelSaaS.API.DTOs.Auth;

namespace HotelSaaS.API.Interfaces.Services;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterDto dto, CancellationToken cancellationToken = default);
    Task<AuthResponseDto> LoginAsync(LoginDto dto, CancellationToken cancellationToken = default);
    Task LogoutAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<AuthResponseDto> RefreshTokenAsync(RefreshTokenDto dto, CancellationToken cancellationToken = default);
    Task ForgotPasswordAsync(ForgotPasswordDto dto, CancellationToken cancellationToken = default);
    Task ResetPasswordAsync(ResetPasswordDto dto, CancellationToken cancellationToken = default);
    Task ChangePasswordAsync(Guid userId, ChangePasswordDto dto, CancellationToken cancellationToken = default);
    Task VerifyEmailAsync(VerifyEmailDto dto, CancellationToken cancellationToken = default);
    Task ResendVerificationAsync(ResendVerificationDto dto, CancellationToken cancellationToken = default);
}
