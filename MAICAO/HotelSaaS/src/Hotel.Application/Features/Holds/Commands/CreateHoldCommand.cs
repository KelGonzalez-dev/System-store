using Hotel.Application.Common.Interfaces;
using Hotel.Application.Features.Holds.DTOs;
using Hotel.Domain.Entities;
using Hotel.Domain.Enums;
using Hotel.Domain.Exceptions;
using MediatR;

namespace Hotel.Application.Features.Holds.Commands;

public record CreateHoldCommand(string HotelId, string RoomId, string? GuestId,
    DateOnly CheckInDate, DateOnly CheckOutDate, int ExpiryMinutes, string? Notes) : IRequest<HoldDto>;

public class CreateHoldCommandHandler : IRequestHandler<CreateHoldCommand, HoldDto>
{
    private readonly IUnitOfWorkApp _uow;
    private readonly ICurrentUserService _currentUser;
    public CreateHoldCommandHandler(IUnitOfWorkApp uow, ICurrentUserService currentUser)
    { _uow = uow; _currentUser = currentUser; }

    public async Task<HoldDto> Handle(CreateHoldCommand req, CancellationToken ct)
    {
        var room = await _uow.Rooms.GetWithDetailsAsync(req.RoomId, ct)
            ?? throw new EntityNotFoundException("Room", req.RoomId);

        if (room.Status != RoomStatus.Available)
            throw new RoomNotAvailableException(req.RoomId, req.CheckInDate, req.CheckOutDate);

        var hasHold = await _uow.Holds.HasActiveHoldAsync(req.RoomId, req.CheckInDate, req.CheckOutDate, ct);
        if (hasHold)
            throw new RoomNotAvailableException(req.RoomId, req.CheckInDate, req.CheckOutDate);

        var expiresAt = DateTime.UtcNow.AddMinutes(req.ExpiryMinutes);

        var hold = new Hold
        {
            Id = Ulid.NewUlid().ToString(),
            HotelId = req.HotelId,
            RoomId = req.RoomId,
            GuestId = req.GuestId,
            UserId = _currentUser.UserId,
            CheckInDate = req.CheckInDate,
            CheckOutDate = req.CheckOutDate,
            Status = HoldStatus.Active,
            ExpiresAt = expiresAt,
            Notes = req.Notes,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _uow.Holds.AddAsync(hold, ct);
        await _uow.SaveChangesAsync(ct);

        return MapToDto(hold, room.Number);
    }

    public static HoldDto MapToDto(Hold h, string roomNumber) => new(
        h.Id, h.HotelId, h.RoomId, roomNumber, h.GuestId, h.UserId,
        h.CheckInDate, h.CheckOutDate, h.Status.ToString(),
        h.ExpiresAt, h.ExpiresAt < DateTime.UtcNow, h.Notes, h.ReservationId, h.CreatedAt);
}