using Hotel.Application.Common.Interfaces;
using Hotel.Application.Features.Reservations.DTOs;
using Hotel.Domain.Exceptions;
using Hotel.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Hotel.Application.Features.Reservations.Commands;

public record CreateReservationCommand(
    string HotelId, string RoomId, string GuestId, string? UserId,
    DateOnly CheckInDate, DateOnly CheckOutDate, int Adults, int Children,
    decimal BaseAmount, decimal TaxAmount, decimal TotalAmount, string Currency,
    string? Source, string? SpecialRequests, string? Notes) : IRequest<ReservationDto>;

public class CreateReservationCommandHandler : IRequestHandler<CreateReservationCommand, ReservationDto>
{
    private readonly IUnitOfWorkApp _uow;
    private readonly ICurrentUserService _currentUser;
    private readonly ILogger<CreateReservationCommandHandler> _logger;

    public CreateReservationCommandHandler(IUnitOfWorkApp uow, ICurrentUserService currentUser,
        ILogger<CreateReservationCommandHandler> logger)
    { _uow = uow; _currentUser = currentUser; _logger = logger; }

    public async Task<ReservationDto> Handle(CreateReservationCommand req, CancellationToken ct)
    {
        // All business logic handled by PostgreSQL function - NO duplicate logic in C#
        var reservationId = await _uow.Reservations.CreateViaFunctionAsync(
            new CreateReservationParams(
                req.HotelId, req.RoomId, req.GuestId, req.UserId ?? _currentUser.UserId,
                req.CheckInDate, req.CheckOutDate, req.Adults, req.Children,
                req.BaseAmount, req.TaxAmount, req.TotalAmount, req.Currency,
                req.Source, req.SpecialRequests, req.Notes), ct);

        var reservation = await _uow.Reservations.GetWithDetailsAsync(reservationId, ct)
            ?? throw new EntityNotFoundException("Reservation", reservationId);

        _logger.LogInformation("Reservation {Id} created for room {Room}", reservationId, req.RoomId);

        return MapToDto(reservation);
    }

    private static ReservationDto MapToDto(Hotel.Domain.Entities.Reservation r) => new(
        r.Id, r.HotelId, r.RoomId, r.Room.Number,
        r.GuestId, $"{r.Guest.FirstName} {r.Guest.LastName}", r.Guest.Email,
        r.ConfirmationNumber, r.CheckInDate, r.CheckOutDate,
        r.Adults, r.Children, r.Status.ToString(),
        r.BaseAmount, r.TaxAmount, r.TotalAmount, r.PaidAmount, r.Currency,
        r.Source, r.SpecialRequests, r.Notes,
        r.ActualCheckIn, r.ActualCheckOut, r.CreatedAt, r.UpdatedAt);
}