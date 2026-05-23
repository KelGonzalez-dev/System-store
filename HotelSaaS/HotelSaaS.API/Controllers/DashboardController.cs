using HotelSaaS.API.Common;
using HotelSaaS.API.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelSaaS.API.Controllers;

[Authorize(Policy = PolicyNames.StaffOnly)]
public class DashboardController : BaseApiController
{
    private readonly IReportService _reportService;

    public DashboardController(IReportService reportService) => _reportService = reportService;

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats([FromQuery] Guid? hotelId, CancellationToken cancellationToken) =>
        OkResponse(await _reportService.GetDashboardStatsAsync(hotelId, cancellationToken));
}
