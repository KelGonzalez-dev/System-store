using HotelSaaS.API.Common;

namespace HotelSaaS.API.DTOs.Payments;

public class PaymentDto
{
    public Guid Id { get; set; }
    public Guid ReservationId { get; set; }
    public string ReservationCode { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Method { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? TransactionId { get; set; }
    public string? StripePaymentId { get; set; }
    public DateTime? ProcessedAt { get; set; }
    public decimal? RefundAmount { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreatePaymentDto
{
    public Guid ReservationId { get; set; }
    public decimal Amount { get; set; }
    public PaymentMethod Method { get; set; }
    public string? Notes { get; set; }
}

public class StripePaymentDto
{
    public Guid ReservationId { get; set; }
    public decimal Amount { get; set; }
    public string CardToken { get; set; } = string.Empty;
}

public class RefundPaymentDto
{
    public decimal? Amount { get; set; }
    public string? Reason { get; set; }
}

public class InvoiceDto
{
    public Guid Id { get; set; }
    public string Number { get; set; } = string.Empty;
    public Guid ReservationId { get; set; }
    public decimal Subtotal { get; set; }
    public decimal Tax { get; set; }
    public decimal Total { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? PdfUrl { get; set; }
    public DateTime? IssuedAt { get; set; }
}

public class CreateInvoiceDto
{
    public Guid ReservationId { get; set; }
    public Guid? PaymentId { get; set; }
    public decimal TaxRate { get; set; } = 0.16m;
}

public class PaymentFilterDto : DTOs.Common.PaginationQuery
{
    public Guid? ReservationId { get; set; }
    public PaymentStatus? Status { get; set; }
    public PaymentMethod? Method { get; set; }
}
