namespace Hotel.Application.Common.Interfaces;

public interface ICurrentUserService
{
    string? UserId { get; }
    string? Email { get; }
    string? Role { get; }
    string? HotelId { get; }
    string? CorrelationId { get; }
    bool IsAuthenticated { get; }
    bool IsSuperAdmin { get; }
    bool IsAdmin { get; }
}