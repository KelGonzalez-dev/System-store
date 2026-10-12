using Hotel.Domain.Enums;

namespace Hotel.Domain.Entities;

public class Reservation
{
    public string Id { get; set; } = default!;
    public string HotelId { get; set; } = default!;
    public string RoomId { get; set; } = default!;
    public string GuestId { get; set; } = default!;
    public string? UserId { get; set; }
    public string ConfirmationNumber { get; set; } = default!;
    public DateOnly CheckInDate { get; set; }
    public DateOnly CheckOutDate { get; set; }
    public int Adults { get; set; }
    public int Children { get; set; }
    public ReservationStatus Status { get; set; } = ReservationStatus.Confirmed;
    public decimal BaseAmount { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal PaidAmount { get; set; }
    public string Currency { get; set; } = "USD";
    public string? Source { get; set; }
    public string? ChannelCode { get; set; }
    public string? SpecialRequests { get; set; }
    public string? Notes { get; set; }
    public DateTime? ActualCheckIn { get; set; }
    public DateTime? ActualCheckOut { get; set; }
    public string? CancellationReason { get; set; }
    public DateTime? CancelledAt { get; set; }
    public string? CancelledBy { get; set; }
    public long Version { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Room Room { get; set; } = default!;
    public Guest Guest { get; set; } = default!;
    public ICollection<Payment> Payments { get; set; } = new List<Payment>();
}
