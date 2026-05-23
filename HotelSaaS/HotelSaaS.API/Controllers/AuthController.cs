using HotelSaaS.API.DTOs.Auth;
using HotelSaaS.API.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelSaaS.API.Controllers;

public class AuthController : BaseApiController
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService) => _authService = authService;

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto, CancellationToken cancellationToken)
    {
        var result = await _authService.RegisterAsync(dto, cancellationToken);
        return CreatedResponse(result, "Registration successful");
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginDto dto, CancellationToken cancellationToken)
    {
        var result = await _authService.LoginAsync(dto, cancellationToken);
        return OkResponse(result, "Login successful");
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout(CancellationToken cancellationToken)
    {
        await _authService.LogoutAsync(CurrentUserId, cancellationToken);
        return OkResponse("Logged out successfully");
    }

    [HttpPost("refresh-token")]
    [AllowAnonymous]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenDto dto, CancellationToken cancellationToken)
    {
        var result = await _authService.RefreshTokenAsync(dto, cancellationToken);
        return OkResponse(result, "Token refreshed");
    }

    [HttpPost("forgot-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto, CancellationToken cancellationToken)
    {
        await _authService.ForgotPasswordAsync(dto, cancellationToken);
        return OkResponse("If the email exists, a reset link has been sent");
    }

    [HttpPost("reset-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto, CancellationToken cancellationToken)
    {
        await _authService.ResetPasswordAsync(dto, cancellationToken);
        return OkResponse("Password reset successfully");
    }

    [HttpPost("change-password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto, CancellationToken cancellationToken)
    {
        await _authService.ChangePasswordAsync(CurrentUserId, dto, cancellationToken);
        return OkResponse("Password changed successfully");
    }

    [HttpPost("verify-email")]
    [AllowAnonymous]
    public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailDto dto, CancellationToken cancellationToken)
    {
        await _authService.VerifyEmailAsync(dto, cancellationToken);
        return OkResponse("Email verified successfully");
    }

    [HttpPost("resend-verification")]
    [AllowAnonymous]
    public async Task<IActionResult> ResendVerification([FromBody] ResendVerificationDto dto, CancellationToken cancellationToken)
    {
        await _authService.ResendVerificationAsync(dto, cancellationToken);
        return OkResponse("Verification email sent if applicable");
    }
}
