using Hotel.Application.Common.Interfaces;
using Hotel.Application.Features.Payments.DTOs;
using Hotel.Domain.Entities;
using Hotel.Domain.Enums;
using Hotel.Domain.Exceptions;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Hotel.Application.Features.Payments.Commands;

public record RefundPaymentCommand(string PaymentId, decimal Amount, string Reason) : IRequest<PaymentDto>;

public class RefundPaymentCommandHandler : IRequestHandler<RefundPaymentCommand, PaymentDto>
{
    private readonly IUnitOfWorkApp _uow;
    private readonly ICurrentUserService _currentUser;
    private readonly ILogger<RefundPaymentCommandHandler> _logger;

    public RefundPaymentCommandHandler(IUnitOfWorkApp uow, ICurrentUserService currentUser,
        ILogger<RefundPaymentCommandHandler> logger)
    { _uow = uow; _currentUser = currentUser; _logger = logger; }

    public async Task<PaymentDto> Handle(RefundPaymentCommand req, CancellationToken ct)
    {
        var payment = await _uow.Payments.GetByIdAsync(req.PaymentId, ct)
            ?? throw new EntityNotFoundException("Payment", req.PaymentId);

        if (payment.Status == PaymentStatus.Refunded)
            throw new InvalidOperationException("Payment already fully refunded.");

        var alreadyRefunded = payment.RefundedAmount ?? 0;
        var maxRefund = payment.Amount - alreadyRefunded;
        if (req.Amount > maxRefund)
            throw new InvalidOperationException($"Refund amount {req.Amount} exceeds maximum refundable {maxRefund}.");

        payment.RefundedAmount = alreadyRefunded + req.Amount;
        payment.Status = payment.RefundedAmount >= payment.Amount
            ? PaymentStatus.Refunded : PaymentStatus.PartiallyRefunded;
        payment.UpdatedAt = DateTime.UtcNow;

        var refund = new PaymentRefund
        {
            Id = Ulid.NewUlid().ToString(),
            PaymentId = payment.Id,
            Amount = req.Amount,
            Reason = req.Reason,
            ProcessedBy = _currentUser.UserId,
            CreatedAt = DateTime.UtcNow
        };

        await _uow.SaveChangesAsync(ct);
        _logger.LogInformation("Refund of {Amount} for payment {Id}", req.Amount, req.PaymentId);

        return new PaymentDto(payment.Id, payment.HotelId, payment.ReservationId,
            payment.IdempotencyKey, payment.Amount, payment.RefundedAmount,
            payment.Currency, payment.Method.ToString(), payment.Status.ToString(),
            payment.TransactionId, payment.Gateway, payment.Notes,
            payment.ProcessedBy, payment.ProcessedAt, payment.CreatedAt, payment.UpdatedAt);
    }
}