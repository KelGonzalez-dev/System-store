using Hotel.Application.Common.Interfaces;
using Hotel.Application.Features.Rooms.DTOs;
using Hotel.Domain.Enums;
using Hotel.Domain.Exceptions;
using MediatR;

namespace Hotel.Application.Features.Rooms.Commands;

public record UpdateRoomCommand(string Id, string? Number, int? Floor, RoomStatus? Status,
    string? Notes, string? MaintenanceReason, string? HousekeepingStatus) : IRequest<RoomDto>;

public class UpdateRoomCommandHandler : IRequestHandler<UpdateRoomCommand, RoomDto>
{
    private readonly IUnitOfWorkApp _uow;
    public UpdateRoomCommandHandler(IUnitOfWorkApp uow) { _uow = uow; }

    public async Task<RoomDto> Handle(UpdateRoomCommand req, CancellationToken ct)
    {
        var room = await _uow.Rooms.GetWithDetailsAsync(req.Id, ct)
            ?? throw new EntityNotFoundException("Room", req.Id);

        if (req.Number != null) room.Number = req.Number;
        if (req.Floor.HasValue) room.Floor = req.Floor.Value;
        if (req.Status.HasValue) room.Status = req.Status.Value;
        if (req.Notes != null) room.Notes = req.Notes;
        if (req.MaintenanceReason != null) room.MaintenanceReason = req.MaintenanceReason;
        if (req.HousekeepingStatus != null) room.HousekeepingStatus = req.HousekeepingStatus;
        room.UpdatedAt = DateTime.UtcNow;

        _uow.Rooms.Update(room);
        await _uow.SaveChangesAsync(ct);

        return new RoomDto(room.Id, room.HotelId, room.RoomTypeId, room.RoomType?.Name ?? "",
            room.Number, room.Floor, room.Status.ToString(), room.IsActive,
            room.Notes, room.MaintenanceReason, room.HousekeepingStatus,
            room.LastCleanedAt, room.CreatedAt, room.UpdatedAt);
    }
}