using Hotel.Application.Common.Interfaces;
using Hotel.Application.Features.Rooms.DTOs;
using Hotel.Domain.Enums;
using Hotel.Shared.Models;
using MediatR;

namespace Hotel.Application.Features.Rooms.Queries;

public record GetRoomsQuery(string HotelId, RoomStatus? Status, string? RoomTypeId, int Page = 1, int PageSize = 20) : IRequest<PagedResult<RoomDto>>;

public class GetRoomsQueryHandler : IRequestHandler<GetRoomsQuery, PagedResult<RoomDto>>
{
    private readonly IUnitOfWorkApp _uow;
    public GetRoomsQueryHandler(IUnitOfWorkApp uow) { _uow = uow; }

    public async Task<PagedResult<RoomDto>> Handle(GetRoomsQuery req, CancellationToken ct)
    {
        var (items, total) = await _uow.Rooms.GetPagedAsync(
            req.HotelId, req.Status, req.RoomTypeId, req.Page, req.PageSize, ct);

        var dtos = items.Select(r => new RoomDto(r.Id, r.HotelId, r.RoomTypeId,
            r.RoomType?.Name ?? "", r.Number, r.Floor, r.Status.ToString(), r.IsActive,
            r.Notes, r.MaintenanceReason, r.HousekeepingStatus,
            r.LastCleanedAt, r.CreatedAt, r.UpdatedAt));

        return PagedResult<RoomDto>.Create(dtos, total, req.Page, req.PageSize);
    }
}