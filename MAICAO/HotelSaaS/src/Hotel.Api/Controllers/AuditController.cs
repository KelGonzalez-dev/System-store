using Hotel.Application.Features.Audit.DTOs;
using Hotel.Application.Features.Audit.Queries;
using Hotel.Shared.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hotel.Api.Controllers;

/// <summary>Audit trail access</summary>
[Tags("Audit")]
[Authorize(Roles = "Admin,SuperAdmin")]
public class AuditController : BaseController
{
    /// <summary>Query audit logs with filters</summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<AuditLogDto>>), 200)]
    public async Task<IActionResult> GetLogs(
        [FromQuery] string? hotelId, [FromQuery] string? entityType,
        [FromQuery] string? entityId, [FromQuery] string? userId,
        [FromQuery] DateTime? from, [FromQuery] DateTime? to,
        [FromQuery] int page = 1, [FromQuery] int pageSize = 50,
        CancellationToken ct = default)
    {
        var result = await Mediator.Send(
            new GetAuditLogsQuery(hotelId, entityType, entityId, userId, from, to, page, pageSize), ct);
        return OkResult(result);
    }
}