using Hotel.Application.Features.Auth.Commands;
using Hotel.Application.Features.Auth.DTOs;
using Hotel.Shared.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace Hotel.Api.Controllers;

/// <summary>Authentication endpoints</summary>
[Tags("Authentication")]
public class AuthController : BaseController
{
    /// <summary>Login with email and password</summary>
    /// <remarks>Returns JWT access token and refresh token</remarks>
    [HttpPost("login")]
    [AllowAnonymous]
    [EnableRateLimiting("auth")]
    [ProducesResponseType(typeof(ApiResponse<LoginResponse>), 200)]
    [ProducesResponseType(typeof(ApiResponse), 401)]
    [ProducesResponseType(typeof(ApiResponse), 400)]
    public async Task<IActionResult> Login([FromBody] LoginRequest req, CancellationToken ct)
    {
        var result = await Mediator.Send(new LoginCommand(req.Email, req.Password), ct);
        return OkResult(result, "Login successful.");
    }

    /// <summary>Refresh access token using refresh token</summary>
    [HttpPost("refresh-token")]
    [AllowAnonymous]
    [EnableRateLimiting("auth")]
    [ProducesResponseType(typeof(ApiResponse<LoginResponse>), 200)]
    [ProducesResponseType(typeof(ApiResponse), 401)]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest req, CancellationToken ct)
    {
        var result = await Mediator.Send(new RefreshTokenCommand(req.RefreshToken), ct);
        return OkResult(result, "Token refreshed.");
    }
}