namespace Hotel.Application.Features.Auth.DTOs;

public record LoginRequest(string Email, string Password);

public record RefreshTokenRequest(string RefreshToken);

public record LoginResponse(
    string AccessToken,
    string RefreshToken,
    DateTime ExpiresAt,
    UserDto User);

public record UserDto(
    string Id,
    string Email,
    string FirstName,
    string LastName,
    string Role,
    string? HotelId);
