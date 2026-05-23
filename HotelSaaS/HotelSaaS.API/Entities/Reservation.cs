using HotelSaaS.API.Common;

namespace HotelSaaS.API.Entities;

public class Reservation : AuditEntity
{
    public string Code { get; set; } = string.Empty;
    public Guid HotelId { get; set; }
    public Hotel Hotel { get; set; } = null!;
    public Guid RoomId { get; set; }
    public Room Room { get; set; } = null!;
    public Guid GuestId { get; set; }
    public Guest Guest { get; set; } = null!;
    public Guid? UserId { get; set; }
    public User? User { get; set; }
    public DateTime CheckIn { get; set; }
    public DateTime CheckOut { get; set; }
    public ReservationStatus Status { get; set; } = ReservationStatus.Pending;
    public decimal TotalAmount { get; set; }
    public int Adults { get; set; } = 1;
    public int Children { get; set; }
    public string? Notes { get; set; }
    public DateTime? ConfirmedAt { get; set; }
    public DateTime? CheckedInAt { get; set; }
    public DateTime? CheckedOutAt { get; set; }
    public DateTime? CancelledAt { get; set; }
    public string? CancellationReason { get; set; }

    public ICollection<Payment> Payments { get; set; } = new List<Payment>();
    public ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();
}
