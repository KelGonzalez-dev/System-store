using HotelSaaS.API.Common;

namespace HotelSaaS.API.Entities;

public class Payment : AuditEntity
{
    public Guid ReservationId { get; set; }
    public Reservation Reservation { get; set; } = null!;
    public decimal Amount { get; set; }
    public PaymentMethod Method { get; set; }
    public PaymentStatus Status { get; set; } = PaymentStatus.Pending;
    public string? TransactionId { get; set; }
    public string? StripePaymentId { get; set; }
    public string? Notes { get; set; }
    public DateTime? ProcessedAt { get; set; }
    public decimal? RefundAmount { get; set; }
    public DateTime? RefundedAt { get; set; }
    public string? RefundReason { get; set; }

    public ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();
}
