using Hotel.Application.Common.Interfaces;
using Hotel.Application.Features.Audit.DTOs;
using Hotel.Shared.Models;
using MediatR;

namespace Hotel.Application.Features.Audit.Queries;

public record GetAuditLogsQuery(string? HotelId, string? EntityType, string? EntityId,
    string? UserId, DateTime? From, DateTime? To, int Page = 1, int PageSize = 20) : IRequest<PagedResult<AuditLogDto>>;

public class GetAuditLogsQueryHandler : IRequestHandler<GetAuditLogsQuery, PagedResult<AuditLogDto>>
{
    private readonly IUnitOfWorkApp _uow;
    public GetAuditLogsQueryHandler(IUnitOfWorkApp uow) { _uow = uow; }

    public async Task<PagedResult<AuditLogDto>> Handle(GetAuditLogsQuery req, CancellationToken ct)
    {
        var (items, total) = await _uow.Audits.GetPagedAsync(
            req.HotelId, req.EntityType, req.EntityId, req.UserId,
            req.From, req.To, req.Page, req.PageSize, ct);

        var dtos = items.Select(a => new AuditLogDto(
            a.Id, a.HotelId, a.UserId, a.UserEmail, a.Action, a.EntityType, a.EntityId,
            a.OldValues, a.NewValues, a.IpAddress, a.CorrelationId, a.TraceId,
            a.Success, a.ErrorMessage, a.CreatedAt));

        return PagedResult<AuditLogDto>.Create(dtos, total, req.Page, req.PageSize);
    }
}