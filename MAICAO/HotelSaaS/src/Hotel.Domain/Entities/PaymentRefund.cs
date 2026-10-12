namespace Hotel.Domain.Entities;

public class PaymentRefund
{
    public string Id { get; set; } = default!;
    public string PaymentId { get; set; } = default!;
    public decimal Amount { get; set; }
    public string Reason { get; set; } = default!;
    public string? ProcessedBy { get; set; }
    public DateTime CreatedAt { get; set; }
    public Payment Payment { get; set; } = default!;
}
