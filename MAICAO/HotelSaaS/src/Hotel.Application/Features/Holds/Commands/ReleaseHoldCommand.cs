using Hotel.Application.Common.Interfaces;
using Hotel.Application.Features.Holds.Commands;
using Hotel.Application.Features.Holds.DTOs;
using Hotel.Domain.Enums;
using Hotel.Domain.Exceptions;
using MediatR;

namespace Hotel.Application.Features.Holds.Commands;

public record ReleaseHoldCommand(string HoldId) : IRequest<HoldDto>;

public class ReleaseHoldCommandHandler : IRequestHandler<ReleaseHoldCommand, HoldDto>
{
    private readonly IUnitOfWorkApp _uow;
    public ReleaseHoldCommandHandler(IUnitOfWorkApp uow) { _uow = uow; }

    public async Task<HoldDto> Handle(ReleaseHoldCommand req, CancellationToken ct)
    {
        var hold = await _uow.Holds.GetByIdAsync(req.HoldId, ct)
            ?? throw new EntityNotFoundException("Hold", req.HoldId);

        if (hold.Status != HoldStatus.Active)
            throw new InvalidOperationException($"Hold is not active (status: {hold.Status}).");

        hold.Status = HoldStatus.Released;
        hold.UpdatedAt = DateTime.UtcNow;
        _uow.Holds.Update(hold);

        var room = await _uow.Rooms.GetByIdAsync(hold.RoomId, ct);
        var roomNumber = room?.Number ?? "";

        await _uow.SaveChangesAsync(ct);

        return CreateHoldCommandHandler.MapToDto(hold, roomNumber);
    }
}