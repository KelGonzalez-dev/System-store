using Hotel.Application.Common.Interfaces;
using Hotel.Application.Features.Guests.Commands;
using Hotel.Application.Features.Guests.DTOs;
using Hotel.Domain.Exceptions;
using MediatR;

namespace Hotel.Application.Features.Guests.Queries;

public record GetGuestByIdQuery(string Id) : IRequest<GuestDto>;

public class GetGuestByIdQueryHandler : IRequestHandler<GetGuestByIdQuery, GuestDto>
{
    private readonly IUnitOfWorkApp _uow;
    public GetGuestByIdQueryHandler(IUnitOfWorkApp uow) { _uow = uow; }

    public async Task<GuestDto> Handle(GetGuestByIdQuery req, CancellationToken ct)
    {
        var g = await _uow.Guests.GetByIdAsync(req.Id, ct)
            ?? throw new EntityNotFoundException("Guest", req.Id);
        return CreateGuestCommandHandler.MapToDto(g);
    }
}