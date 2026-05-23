using HotelSaaS.API.DTOs.Reports;

namespace HotelSaaS.API.Interfaces.Services;

public interface IReportService
{
    Task<RevenueReportDto> GetRevenueReportAsync(ReportQueryDto query, CancellationToken cancellationToken = default);
    Task<OccupancyReportDto> GetOccupancyReportAsync(ReportQueryDto query, CancellationToken cancellationToken = default);
    Task<DashboardStatsDto> GetDashboardStatsAsync(Guid? hotelId = null, CancellationToken cancellationToken = default);
    Task<byte[]> ExportRevenueExcelAsync(ReportQueryDto query, CancellationToken cancellationToken = default);
    Task<byte[]> ExportRevenuePdfAsync(ReportQueryDto query, CancellationToken cancellationToken = default);
}
