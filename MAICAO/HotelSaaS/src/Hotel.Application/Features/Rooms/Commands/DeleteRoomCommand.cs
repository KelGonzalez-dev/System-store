using Hotel.Application.Common.Interfaces;
using Hotel.Domain.Exceptions;
using MediatR;

namespace Hotel.Application.Features.Rooms.Commands;

public record DeleteRoomCommand(string Id) : IRequest<bool>;

public class DeleteRoomCommandHandler : IRequestHandler<DeleteRoomCommand, bool>
{
    private readonly IUnitOfWorkApp _uow;
    public DeleteRoomCommandHandler(IUnitOfWorkApp uow) { _uow = uow; }

    public async Task<bool> Handle(DeleteRoomCommand req, CancellationToken ct)
    {
        var room = await _uow.Rooms.GetByIdAsync(req.Id, ct)
            ?? throw new EntityNotFoundException("Room", req.Id);

        room.IsActive = false;
        room.UpdatedAt = DateTime.UtcNow;
        _uow.Rooms.Update(room);
        await _uow.SaveChangesAsync(ct);
        return true;
    }
}