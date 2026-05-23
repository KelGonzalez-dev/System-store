using Hotel.Application.Features.Cache.Commands;
using Hotel.Application.Common.Interfaces;
using Hotel.Shared.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hotel.Api.Controllers;

/// <summary>Cache and materialized view management</summary>
[Tags("Cache")]
[Authorize(Roles = "Admin,SuperAdmin")]
public class CacheController : BaseController
{
    /// <summary>Rebuild availability cache for a hotel (calls cache.fn_rebuild_availability)</summary>
    [HttpPost("availability/rebuild")]
    [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
    public async Task<IActionResult> RebuildAvailability([FromQuery] string hotelId, CancellationToken ct)
    {
        var result = await Mediator.Send(new RebuildAvailabilityCommand(hotelId), ct);
        return OkResult(result, "Availability cache rebuilt.");
    }

    /// <summary>Refresh all materialized views</summary>
    [HttpPost("views/refresh")]
    [ProducesResponseType(typeof(ApiResponse), 200)]
    public async Task<IActionResult> RefreshViews([FromServices] IUnitOfWorkApp uow, CancellationToken ct)
    {
        await uow.RefreshMaterializedViewsAsync(ct);
        return OkResult(true, "Materialized views refreshed.");
    }
}