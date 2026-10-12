using Hotel.Domain.Enums;
namespace Hotel.Application.Features.Payments.DTOs;
public record CreatePaymentRequest(string ReservationId, string HotelId, decimal Amount, string Currency, PaymentMethod Method, string? TransactionId, string? Gateway, string? Notes);
public record RefundPaymentRequest(decimal Amount, string Reason);
public record PaymentDto(string Id, string HotelId, string ReservationId, string IdempotencyKey, decimal Amount, decimal? RefundedAmount, string Currency, string Method, string Status, string? TransactionId, string? Gateway, string? Notes, string? ProcessedBy, DateTime? ProcessedAt, DateTime CreatedAt, DateTime UpdatedAt);