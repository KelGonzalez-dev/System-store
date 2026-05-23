using Hotel.Domain.Enums;

namespace Hotel.Domain.Entities;

public class Hold
{
    public string Id { get; set; } = default!;
    public string HotelId { get; set; } = default!;
    public string RoomId { get; set; } = default!;
    public string? GuestId { get; set; }
    public string? UserId { get; set; }
    public DateOnly CheckInDate { get; set; }
    public DateOnly CheckOutDate { get; set; }
    public HoldStatus Status { get; set; } = HoldStatus.Active;
    public DateTime ExpiresAt { get; set; }
    public string? Notes { get; set; }
    public string? ReservationId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Room Room { get; set; } = default!;
}
