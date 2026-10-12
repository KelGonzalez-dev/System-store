using Hotel.Application.Common.Interfaces;
using Hotel.Application.Features.Reservations.DTOs;
using Hotel.Domain.Exceptions;
using MediatR;

namespace Hotel.Application.Features.Reservations.Queries;

public record GetReservationByIdQuery(string Id) : IRequest<ReservationDto>;

public class GetReservationByIdQueryHandler : IRequestHandler<GetReservationByIdQuery, ReservationDto>
{
    private readonly IUnitOfWorkApp _uow;
    public GetReservationByIdQueryHandler(IUnitOfWorkApp uow) { _uow = uow; }

    public async Task<ReservationDto> Handle(GetReservationByIdQuery req, CancellationToken ct)
    {
        var r = await _uow.Reservations.GetWithDetailsAsync(req.Id, ct)
            ?? throw new EntityNotFoundException("Reservation", req.Id);

        return new ReservationDto(r.Id, r.HotelId, r.RoomId, r.Room.Number,
            r.GuestId, $"{r.Guest.FirstName} {r.Guest.LastName}", r.Guest.Email,
            r.ConfirmationNumber, r.CheckInDate, r.CheckOutDate,
            r.Adults, r.Children, r.Status.ToString(),
            r.BaseAmount, r.TaxAmount, r.TotalAmount, r.PaidAmount, r.Currency,
            r.Source, r.SpecialRequests, r.Notes,
            r.ActualCheckIn, r.ActualCheckOut, r.CreatedAt, r.UpdatedAt);
    }
}