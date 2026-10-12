using HotelSaaS.API.Common;
using HotelSaaS.API.DTOs.Reports;
using HotelSaaS.API.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelSaaS.API.Controllers;

[Authorize(Policy = PolicyNames.ManagerOrAbove)]
public class ReportsController : BaseApiController
{
    private readonly IReportService _reportService;

    public ReportsController(IReportService reportService) => _reportService = reportService;

    [HttpGet("revenue")]
    public async Task<IActionResult> GetRevenue([FromQuery] ReportQueryDto query, CancellationToken cancellationToken) =>
        OkResponse(await _reportService.GetRevenueReportAsync(query, cancellationToken));

    [HttpGet("occupancy")]
    public async Task<IActionResult> GetOccupancy([FromQuery] ReportQueryDto query, CancellationToken cancellationToken) =>
        OkResponse(await _reportService.GetOccupancyReportAsync(query, cancellationToken));

    [HttpGet("revenue/excel")]
    public async Task<IActionResult> ExportRevenueExcel([FromQuery] ReportQueryDto query, CancellationToken cancellationToken)
    {
        var bytes = await _reportService.ExportRevenueExcelAsync(query, cancellationToken);
        return File(bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "revenue-report.xlsx");
    }

    [HttpGet("revenue/pdf")]
    public async Task<IActionResult> ExportRevenuePdf([FromQuery] ReportQueryDto query, CancellationToken cancellationToken)
    {
        var bytes = await _reportService.ExportRevenuePdfAsync(query, cancellationToken);
        return File(bytes, "application/pdf", "revenue-report.pdf");
    }
}
