using Hotel.Application.Common.Interfaces;
using Hotel.Application.Features.Holds.DTOs;
using Hotel.Application.Features.Reservations.Commands;
using Hotel.Domain.Enums;
using Hotel.Domain.Exceptions;
using MediatR;
using Hotel.Application.Features.Reservations.Commands;

namespace Hotel.Application.Features.Holds.Commands;

public record ConvertHoldCommand(string HoldId, string GuestId, int Adults, int Children,
    decimal BaseAmount, decimal TaxAmount, decimal TotalAmount,
    string Currency, string? Source, string? SpecialRequests) : IRequest<HoldDto>;

public class ConvertHoldCommandHandler : IRequestHandler<ConvertHoldCommand, HoldDto>
{
    private readonly IUnitOfWorkApp _uow;
    private readonly ICurrentUserService _currentUser;
    private readonly IMediator _mediator;

    public ConvertHoldCommandHandler(IUnitOfWorkApp uow, ICurrentUserService currentUser, IMediator mediator)
    { _uow = uow; _currentUser = currentUser; _mediator = mediator; }

    public async Task<HoldDto> Handle(ConvertHoldCommand req, CancellationToken ct)
    {
        var hold = await _uow.Holds.GetByIdAsync(req.HoldId, ct)
            ?? throw new EntityNotFoundException("Hold", req.HoldId);

        if (hold.Status == HoldStatus.Expired || hold.ExpiresAt < DateTime.UtcNow)
            throw new HoldExpiredException(req.HoldId);

        if (hold.Status != HoldStatus.Active)
            throw new InvalidOperationException("Hold is not active.");

        var reservation = await _mediator.Send(new CreateReservationCommand(
            hold.HotelId, hold.RoomId, req.GuestId, _currentUser.UserId,
            hold.CheckInDate, hold.CheckOutDate, req.Adults, req.Children,
            req.BaseAmount, req.TaxAmount, req.TotalAmount, req.Currency,
            req.Source, req.SpecialRequests, null), ct);

        hold.Status = HoldStatus.Converted;
        hold.ReservationId = reservation.Id;
        hold.UpdatedAt = DateTime.UtcNow;
        _uow.Holds.Update(hold);
        await _uow.SaveChangesAsync(ct);

        var room = await _uow.Rooms.GetByIdAsync(hold.RoomId, ct);
        return CreateHoldCommandHandler.MapToDto(hold, room?.Number ?? "");
    }
}