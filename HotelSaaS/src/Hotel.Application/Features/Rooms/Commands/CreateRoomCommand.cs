using Hotel.Application.Common.Interfaces;
using Hotel.Application.Features.Rooms.DTOs;
using Hotel.Domain.Entities;
using Hotel.Domain.Enums;
using Hotel.Domain.Exceptions;
using MediatR;

namespace Hotel.Application.Features.Rooms.Commands;

public record CreateRoomCommand(string HotelId, string RoomTypeId, string Number, int Floor, string? Notes) : IRequest<RoomDto>;

public class CreateRoomCommandHandler : IRequestHandler<CreateRoomCommand, RoomDto>
{
    private readonly IUnitOfWorkApp _uow;
    public CreateRoomCommandHandler(IUnitOfWorkApp uow) { _uow = uow; }

    public async Task<RoomDto> Handle(CreateRoomCommand req, CancellationToken ct)
    {
        var roomType = await _uow.RoomTypes.GetByIdAsync(req.RoomTypeId, ct)
            ?? throw new EntityNotFoundException("RoomType", req.RoomTypeId);

        var room = new Room
        {
            Id = Ulid.NewUlid().ToString(),
            HotelId = req.HotelId,
            RoomTypeId = req.RoomTypeId,
            Number = req.Number,
            Floor = req.Floor,
            Status = RoomStatus.Available,
            IsActive = true,
            Notes = req.Notes,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _uow.Rooms.AddAsync(room, ct);
        await _uow.SaveChangesAsync(ct);

        return new RoomDto(room.Id, room.HotelId, room.RoomTypeId, roomType.Name,
            room.Number, room.Floor, room.Status.ToString(), room.IsActive,
            room.Notes, room.MaintenanceReason, room.HousekeepingStatus,
            room.LastCleanedAt, room.CreatedAt, room.UpdatedAt);
    }
}