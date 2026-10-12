using Hotel.Application.Common.Interfaces;
using Hotel.Application.Features.Reservations.DTOs;
using Hotel.Domain.Enums;
using Hotel.Domain.Exceptions;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Hotel.Application.Features.Reservations.Commands;

public record CheckInCommand(string Id, string? Notes) : IRequest<ReservationDto>;

public class CheckInCommandHandler : IRequestHandler<CheckInCommand, ReservationDto>
{
    private readonly IUnitOfWorkApp _uow;
    private readonly ICurrentUserService _currentUser;
    private readonly ILogger<CheckInCommandHandler> _logger;

    public CheckInCommandHandler(IUnitOfWorkApp uow, ICurrentUserService currentUser,
        ILogger<CheckInCommandHandler> logger)
    { _uow = uow; _currentUser = currentUser; _logger = logger; }

    public async Task<ReservationDto> Handle(CheckInCommand req, CancellationToken ct)
    {
        var r = await _uow.Reservations.GetWithDetailsAsync(req.Id, ct)
            ?? throw new EntityNotFoundException("Reservation", req.Id);

        if (r.Status != ReservationStatus.Confirmed)
            throw new InvalidReservationStatusException(r.Status.ToString(), "CheckedIn");

        r.Status = ReservationStatus.CheckedIn;
        r.ActualCheckIn = DateTime.UtcNow;
        if (req.Notes != null) r.Notes = req.Notes;
        r.Room.Status = RoomStatus.Occupied;

        _uow.Reservations.Update(r);
        _uow.Rooms.Update(r.Room);
        await _uow.SaveChangesAsync(ct);

        _logger.LogInformation("Check-in for reservation {Id}", req.Id);

        return new ReservationDto(r.Id, r.HotelId, r.RoomId, r.Room.Number,
            r.GuestId, $"{r.Guest.FirstName} {r.Guest.LastName}", r.Guest.Email,
            r.ConfirmationNumber, r.CheckInDate, r.CheckOutDate,
            r.Adults, r.Children, r.Status.ToString(),
            r.BaseAmount, r.TaxAmount, r.TotalAmount, r.PaidAmount, r.Currency,
            r.Source, r.SpecialRequests, r.Notes,
            r.ActualCheckIn, r.ActualCheckOut, r.CreatedAt, r.UpdatedAt);
    }
}