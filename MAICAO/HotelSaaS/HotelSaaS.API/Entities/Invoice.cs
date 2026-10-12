using HotelSaaS.API.Common;

namespace HotelSaaS.API.Entities;

public class Invoice : AuditEntity
{
    public string Number { get; set; } = string.Empty;
    public Guid ReservationId { get; set; }
    public Reservation Reservation { get; set; } = null!;
    public Guid? PaymentId { get; set; }
    public Payment? Payment { get; set; }
    public decimal Subtotal { get; set; }
    public decimal Tax { get; set; }
    public decimal Total { get; set; }
    public InvoiceStatus Status { get; set; } = InvoiceStatus.Draft;
    public string? PdfUrl { get; set; }
    public DateTime? IssuedAt { get; set; }
    public DateTime? DueDate { get; set; }
}
