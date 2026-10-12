using Hotel.Application.Common.Interfaces;
using Hotel.Application.Features.Reservations.DTOs;
using Hotel.Domain.Enums;
using Hotel.Domain.Exceptions;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Hotel.Application.Features.Reservations.Commands;

public record CancelReservationCommand(string Id, string Reason) : IRequest<ReservationDto>;

public class CancelReservationCommandHandler : IRequestHandler<CancelReservationCommand, ReservationDto>
{
    private readonly IUnitOfWorkApp _uow;
    private readonly ICurrentUserService _currentUser;
    private readonly ILogger<CancelReservationCommandHandler> _logger;

    public CancelReservationCommandHandler(IUnitOfWorkApp uow, ICurrentUserService currentUser,
        ILogger<CancelReservationCommandHandler> logger)
    { _uow = uow; _currentUser = currentUser; _logger = logger; }

    public async Task<ReservationDto> Handle(CancelReservationCommand req, CancellationToken ct)
    {
        var r = await _uow.Reservations.GetWithDetailsAsync(req.Id, ct)
            ?? throw new EntityNotFoundException("Reservation", req.Id);

        if (r.Status is ReservationStatus.Cancelled or ReservationStatus.CheckedOut)
            throw new InvalidReservationStatusException(r.Status.ToString(), "Cancelled");

        r.Status = ReservationStatus.Cancelled;
        r.CancellationReason = req.Reason;
        r.CancelledAt = DateTime.UtcNow;
        r.CancelledBy = _currentUser.UserId;

        _uow.Reservations.Update(r);
        await _uow.SaveChangesAsync(ct);

        _logger.LogInformation("Reservation {Id} cancelled by {User}", req.Id, _currentUser.UserId);

        return new ReservationDto(r.Id, r.HotelId, r.RoomId, r.Room.Number,
            r.GuestId, $"{r.Guest.FirstName} {r.Guest.LastName}", r.Guest.Email,
            r.ConfirmationNumber, r.CheckInDate, r.CheckOutDate,
            r.Adults, r.Children, r.Status.ToString(),
            r.BaseAmount, r.TaxAmount, r.TotalAmount, r.PaidAmount, r.Currency,
            r.Source, r.SpecialRequests, r.Notes,
            r.ActualCheckIn, r.ActualCheckOut, r.CreatedAt, r.UpdatedAt);
    }
}