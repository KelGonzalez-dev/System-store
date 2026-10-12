using Hotel.Application.Common.Interfaces;
using Hotel.Application.Features.Reservations.DTOs;
using Hotel.Domain.Enums;
using MediatR;
using Hotel.Shared.Models;

namespace Hotel.Application.Features.Reservations.Queries;

public record GetReservationsQuery(
    string HotelId, ReservationStatus? Status, DateOnly? From, DateOnly? To,
    string? GuestId, int Page = 1, int PageSize = 20) : IRequest<PagedResult<ReservationDto>>;

public class GetReservationsQueryHandler : IRequestHandler<GetReservationsQuery, PagedResult<ReservationDto>>
{
    private readonly IUnitOfWorkApp _uow;
    public GetReservationsQueryHandler(IUnitOfWorkApp uow) { _uow = uow; }

    public async Task<PagedResult<ReservationDto>> Handle(GetReservationsQuery req, CancellationToken ct)
    {
        var (items, total) = await _uow.Reservations.GetPagedAsync(
            req.HotelId, req.Status, req.From, req.To, req.GuestId, req.Page, req.PageSize, ct);

        var dtos = items.Select(r => new ReservationDto(
            r.Id, r.HotelId, r.RoomId, r.Room?.Number ?? "",
            r.GuestId, r.Guest != null ? $"{r.Guest.FirstName} {r.Guest.LastName}" : "",
            r.Guest?.Email ?? "",
            r.ConfirmationNumber, r.CheckInDate, r.CheckOutDate,
            r.Adults, r.Children, r.Status.ToString(),
            r.BaseAmount, r.TaxAmount, r.TotalAmount, r.PaidAmount, r.Currency,
            r.Source, r.SpecialRequests, r.Notes,
            r.ActualCheckIn, r.ActualCheckOut, r.CreatedAt, r.UpdatedAt));

        return PagedResult<ReservationDto>.Create(dtos, total, req.Page, req.PageSize);
    }
}