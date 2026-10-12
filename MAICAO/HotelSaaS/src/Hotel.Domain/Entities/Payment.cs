using Hotel.Domain.Enums;

namespace Hotel.Domain.Entities;

public class Payment
{
    public string Id { get; set; } = default!;
    public string HotelId { get; set; } = default!;
    public string ReservationId { get; set; } = default!;
    public string? GuestId { get; set; }
    public string IdempotencyKey { get; set; } = default!;
    public decimal Amount { get; set; }
    public decimal? RefundedAmount { get; set; }
    public string Currency { get; set; } = "USD";
    public PaymentMethod Method { get; set; }
    public PaymentStatus Status { get; set; } = PaymentStatus.Pending;
    public string? TransactionId { get; set; }
    public string? Gateway { get; set; }
    public string? GatewayResponse { get; set; }
    public string? Notes { get; set; }
    public string? ProcessedBy { get; set; }
    public DateTime? ProcessedAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Reservation Reservation { get; set; } = default!;
    public ICollection<PaymentRefund> Refunds { get; set; } = new List<PaymentRefund>();
}
