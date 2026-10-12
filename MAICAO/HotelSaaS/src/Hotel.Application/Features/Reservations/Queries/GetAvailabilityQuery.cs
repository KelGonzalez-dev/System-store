using Hotel.Application.Common.Interfaces;
using Hotel.Application.Features.Reservations.DTOs;
using MediatR;

namespace Hotel.Application.Features.Reservations.Queries;

public record GetAvailabilityQuery(string HotelId, DateOnly CheckIn, DateOnly CheckOut, int Adults = 1, string? RoomTypeId = null) : IRequest<IEnumerable<AvailabilityResponse>>;

public class GetAvailabilityQueryHandler : IRequestHandler<GetAvailabilityQuery, IEnumerable<AvailabilityResponse>>
{
    private readonly IUnitOfWorkApp _uow;
    public GetAvailabilityQueryHandler(IUnitOfWorkApp uow) { _uow = uow; }

    public async Task<IEnumerable<AvailabilityResponse>> Handle(GetAvailabilityQuery req, CancellationToken ct)
    {
        var rooms = await _uow.Rooms.GetAvailableRoomsAsync(
            req.HotelId, req.CheckIn, req.CheckOut, req.Adults, req.RoomTypeId, ct);

        return rooms.Select(r => new AvailabilityResponse(
            r.Id, r.Number, r.RoomType?.Name ?? "", r.Floor,
            r.RoomType?.MaxOccupancy ?? 0, r.RoomType?.BasePrice ?? 0,
            r.RoomType?.Amenities ?? new List<string>()));
    }
}