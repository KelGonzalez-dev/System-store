using Hotel.Application.Common.Interfaces;
using Hotel.Application.Features.Payments.DTOs;
using Hotel.Domain.Entities;
using Hotel.Domain.Enums;
using Hotel.Domain.Exceptions;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Hotel.Application.Features.Payments.Commands;

public record CreatePaymentCommand(string ReservationId, string HotelId, decimal Amount,
    string Currency, PaymentMethod Method, string IdempotencyKey,
    string? TransactionId, string? Gateway, string? Notes) : IRequest<PaymentDto>;

public class CreatePaymentCommandHandler : IRequestHandler<CreatePaymentCommand, PaymentDto>
{
    private readonly IUnitOfWorkApp _uow;
    private readonly ICurrentUserService _currentUser;
    private readonly ILogger<CreatePaymentCommandHandler> _logger;

    public CreatePaymentCommandHandler(IUnitOfWorkApp uow, ICurrentUserService currentUser,
        ILogger<CreatePaymentCommandHandler> logger)
    { _uow = uow; _currentUser = currentUser; _logger = logger; }

    public async Task<PaymentDto> Handle(CreatePaymentCommand req, CancellationToken ct)
    {
        // Idempotency check
        var existing = await _uow.Payments.GetByIdempotencyKeyAsync(req.IdempotencyKey, ct);
        if (existing != null)
        {
            _logger.LogWarning("Duplicate payment attempt with key {Key}", req.IdempotencyKey);
            return MapToDto(existing);
        }

        var reservation = await _uow.Reservations.GetByIdAsync(req.ReservationId, ct)
            ?? throw new EntityNotFoundException("Reservation", req.ReservationId);

        var payment = new Payment
        {
            Id = Ulid.NewUlid().ToString(),
            HotelId = req.HotelId,
            ReservationId = req.ReservationId,
            GuestId = reservation.GuestId,
            IdempotencyKey = req.IdempotencyKey,
            Amount = req.Amount,
            Currency = req.Currency,
            Method = req.Method,
            Status = PaymentStatus.Completed,
            TransactionId = req.TransactionId,
            Gateway = req.Gateway,
            Notes = req.Notes,
            ProcessedBy = _currentUser.UserId,
            ProcessedAt = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        reservation.PaidAmount += req.Amount;
        await _uow.Payments.AddAsync(payment, ct);
        _uow.Reservations.Update(reservation);
        await _uow.SaveChangesAsync(ct);

        _logger.LogInformation("Payment {Id} of {Amount} recorded for reservation {ResId}",
            payment.Id, payment.Amount, req.ReservationId);

        return MapToDto(payment);
    }

    private static PaymentDto MapToDto(Payment p) => new(
        p.Id, p.HotelId, p.ReservationId, p.IdempotencyKey, p.Amount, p.RefundedAmount,
        p.Currency, p.Method.ToString(), p.Status.ToString(), p.TransactionId,
        p.Gateway, p.Notes, p.ProcessedBy, p.ProcessedAt, p.CreatedAt, p.UpdatedAt);
}