using Hotel.Application.Common.Interfaces;
using Hotel.Application.Features.Guests.Commands;
using Hotel.Application.Features.Guests.DTOs;
using Hotel.Shared.Models;
using MediatR;

namespace Hotel.Application.Features.Guests.Queries;

public record SearchGuestsQuery(string HotelId, string? Query, string? DocumentNumber, string? Email, int Page = 1, int PageSize = 20) : IRequest<PagedResult<GuestDto>>;

public class SearchGuestsQueryHandler : IRequestHandler<SearchGuestsQuery, PagedResult<GuestDto>>
{
    private readonly IUnitOfWorkApp _uow;
    public SearchGuestsQueryHandler(IUnitOfWorkApp uow) { _uow = uow; }

    public async Task<PagedResult<GuestDto>> Handle(SearchGuestsQuery req, CancellationToken ct)
    {
        var (items, total) = await _uow.Guests.SearchAsync(
            req.HotelId, req.Query, req.DocumentNumber, req.Email, req.Page, req.PageSize, ct);

        return PagedResult<GuestDto>.Create(
            items.Select(CreateGuestCommandHandler.MapToDto), total, req.Page, req.PageSize);
    }
}