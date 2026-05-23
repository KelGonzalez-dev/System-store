using Hotel.Application.Common.Interfaces;
using Hotel.Application.Features.Rooms.DTOs;
using Hotel.Domain.Exceptions;
using MediatR;

namespace Hotel.Application.Features.Rooms.Queries;

public record GetRoomByIdQuery(string Id) : IRequest<RoomDto>;

public class GetRoomByIdQueryHandler : IRequestHandler<GetRoomByIdQuery, RoomDto>
{
    private readonly IUnitOfWorkApp _uow;
    public GetRoomByIdQueryHandler(IUnitOfWorkApp uow) { _uow = uow; }

    public async Task<RoomDto> Handle(GetRoomByIdQuery req, CancellationToken ct)
    {
        var r = await _uow.Rooms.GetWithDetailsAsync(req.Id, ct)
            ?? throw new EntityNotFoundException("Room", req.Id);

        return new RoomDto(r.Id, r.HotelId, r.RoomTypeId, r.RoomType?.Name ?? "",
            r.Number, r.Floor, r.Status.ToString(), r.IsActive,
            r.Notes, r.MaintenanceReason, r.HousekeepingStatus,
            r.LastCleanedAt, r.CreatedAt, r.UpdatedAt);
    }
}