using Hotel.Domain.Entities;

namespace Hotel.Application.Common.Interfaces;

public interface ITokenService
{
    (string AccessToken, DateTime ExpiresAt) GenerateAccessToken(User user);
    string GenerateRefreshToken();
    string? GetUserIdFromToken(string token);
}