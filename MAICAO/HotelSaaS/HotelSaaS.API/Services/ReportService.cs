using ClosedXML.Excel;
using HotelSaaS.API.Common;
using HotelSaaS.API.Data;
using HotelSaaS.API.DTOs.Reports;
using HotelSaaS.API.Interfaces.Services;
using Microsoft.EntityFrameworkCore;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace HotelSaaS.API.Services;

public class ReportService : IReportService
{
    private readonly ApplicationDbContext _context;

    public ReportService(ApplicationDbContext context) => _context = context;

    public async Task<RevenueReportDto> GetRevenueReportAsync(ReportQueryDto query, CancellationToken cancellationToken = default)
    {
        var from = query.From ?? DateTime.UtcNow.AddMonths(-1);
        var to = query.To ?? DateTime.UtcNow;

        var paymentsQuery = _context.Payments
            .Where(p => !p.IsDeleted && p.ProcessedAt >= from && p.ProcessedAt <= to);

        if (query.HotelId.HasValue)
            paymentsQuery = paymentsQuery.Where(p => p.Reservation.HotelId == query.HotelId.Value);

        var payments = await paymentsQuery.ToListAsync(cancellationToken);

        var totalRevenue = payments.Where(p => p.Status == PaymentStatus.Completed).Sum(p => p.Amount);
        var totalRefunds = payments.Where(p => p.RefundAmount.HasValue).Sum(p => p.RefundAmount ?? 0);

        var dailyBreakdown = payments
            .Where(p => p.ProcessedAt.HasValue && p.Status == PaymentStatus.Completed)
            .GroupBy(p => p.ProcessedAt!.Value.Date)
            .Select(g => new DailyRevenueDto
            {
                Date = g.Key,
                Revenue = g.Sum(p => p.Amount),
                PaymentCount = g.Count()
            })
            .OrderBy(d => d.Date)
            .ToList();

        return new RevenueReportDto
        {
            From = from,
            To = to,
            TotalRevenue = totalRevenue,
            TotalRefunds = totalRefunds,
            NetRevenue = totalRevenue - totalRefunds,
            TotalPayments = payments.Count,
            DailyBreakdown = dailyBreakdown
        };
    }

    public async Task<OccupancyReportDto> GetOccupancyReportAsync(ReportQueryDto query, CancellationToken cancellationToken = default)
    {
        var from = query.From ?? DateTime.UtcNow.AddMonths(-1);
        var to = query.To ?? DateTime.UtcNow;

        var roomsQuery = _context.Rooms.Where(r => !r.IsDeleted);
        if (query.HotelId.HasValue)
            roomsQuery = roomsQuery.Where(r => r.HotelId == query.HotelId.Value);

        var totalRooms = await roomsQuery.CountAsync(cancellationToken);
        if (totalRooms == 0) totalRooms = 1;

        var reservations = await _context.Reservations
            .Where(r => !r.IsDeleted &&
                        r.Status != ReservationStatus.Cancelled &&
                        r.CheckIn <= to && r.CheckOut >= from)
            .Where(r => !query.HotelId.HasValue || r.HotelId == query.HotelId.Value)
            .ToListAsync(cancellationToken);

        var totalDays = (int)(to - from).TotalDays + 1;
        var occupiedRoomDays = reservations.Sum(r =>
        {
            var start = r.CheckIn < from ? from : r.CheckIn;
            var end = r.CheckOut > to ? to : r.CheckOut;
            return Math.Max(0, (end - start).Days);
        });

        var dailyBreakdown = new List<DailyOccupancyDto>();
        for (var date = from.Date; date <= to.Date; date = date.AddDays(1))
        {
            var occupied = reservations.Count(r => r.CheckIn.Date <= date && r.CheckOut.Date > date);
            dailyBreakdown.Add(new DailyOccupancyDto
            {
                Date = date,
                OccupiedRooms = occupied,
                OccupancyRate = Math.Round((double)occupied / totalRooms * 100, 2)
            });
        }

        return new OccupancyReportDto
        {
            From = from,
            To = to,
            HotelId = query.HotelId,
            TotalRooms = totalRooms,
            OccupancyRate = Math.Round((double)occupiedRoomDays / (totalRooms * totalDays) * 100, 2),
            TotalReservations = reservations.Count,
            DailyBreakdown = dailyBreakdown
        };
    }

    public async Task<DashboardStatsDto> GetDashboardStatsAsync(Guid? hotelId = null, CancellationToken cancellationToken = default)
    {
        var today = DateTime.UtcNow.Date;
        var monthStart = new DateTime(today.Year, today.Month, 1, 0, 0, 0, DateTimeKind.Utc);

        var hotelsQuery = _context.Hotels.Where(h => !h.IsDeleted);
        var roomsQuery = _context.Rooms.Where(r => !r.IsDeleted);
        var reservationsQuery = _context.Reservations.Where(r => !r.IsDeleted);

        if (hotelId.HasValue)
        {
            roomsQuery = roomsQuery.Where(r => r.HotelId == hotelId.Value);
            reservationsQuery = reservationsQuery.Where(r => r.HotelId == hotelId.Value);
        }

        var totalRooms = await roomsQuery.CountAsync(cancellationToken);
        if (totalRooms == 0) totalRooms = 1;

        var activeReservations = await reservationsQuery
            .CountAsync(r => r.Status == ReservationStatus.Confirmed || r.Status == ReservationStatus.CheckedIn, cancellationToken);

        var todayCheckIns = await reservationsQuery.CountAsync(r => r.CheckIn.Date == today, cancellationToken);
        var todayCheckOuts = await reservationsQuery.CountAsync(r => r.CheckOut.Date == today, cancellationToken);

        var monthlyRevenue = await _context.Payments
            .Where(p => !p.IsDeleted && p.Status == PaymentStatus.Completed && p.ProcessedAt >= monthStart)
            .Where(p => !hotelId.HasValue || p.Reservation.HotelId == hotelId.Value)
            .SumAsync(p => p.Amount, cancellationToken);

        var occupiedToday = await reservationsQuery
            .CountAsync(r => r.Status == ReservationStatus.CheckedIn, cancellationToken);

        var pendingPayments = await _context.Payments
            .CountAsync(p => !p.IsDeleted && p.Status == PaymentStatus.Pending, cancellationToken);

        return new DashboardStatsDto
        {
            TotalHotels = await hotelsQuery.CountAsync(cancellationToken),
            TotalRooms = totalRooms,
            ActiveReservations = activeReservations,
            TodayCheckIns = todayCheckIns,
            TodayCheckOuts = todayCheckOuts,
            MonthlyRevenue = monthlyRevenue,
            OccupancyRate = Math.Round((double)occupiedToday / totalRooms * 100, 2),
            PendingPayments = pendingPayments
        };
    }

    public async Task<byte[]> ExportRevenueExcelAsync(ReportQueryDto query, CancellationToken cancellationToken = default)
    {
        var report = await GetRevenueReportAsync(query, cancellationToken);

        using var workbook = new XLWorkbook();
        var ws = workbook.Worksheets.Add("Revenue");
        ws.Cell(1, 1).Value = "Date";
        ws.Cell(1, 2).Value = "Revenue";
        ws.Cell(1, 3).Value = "Payments";

        var row = 2;
        foreach (var day in report.DailyBreakdown)
        {
            ws.Cell(row, 1).Value = day.Date.ToString("yyyy-MM-dd");
            ws.Cell(row, 2).Value = day.Revenue;
            ws.Cell(row, 3).Value = day.PaymentCount;
            row++;
        }

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);
        return stream.ToArray();
    }

    public async Task<byte[]> ExportRevenuePdfAsync(ReportQueryDto query, CancellationToken cancellationToken = default)
    {
        var report = await GetRevenueReportAsync(query, cancellationToken);
        QuestPDF.Settings.License = LicenseType.Community;

        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Margin(30);
                page.Header().Text("HotelSaaS Revenue Report").FontSize(20).Bold();
                page.Content().Column(col =>
                {
                    col.Item().Text($"Period: {report.From:yyyy-MM-dd} to {report.To:yyyy-MM-dd}");
                    col.Item().Text($"Total Revenue: {report.TotalRevenue:C}");
                    col.Item().Text($"Net Revenue: {report.NetRevenue:C}");
                    col.Item().PaddingTop(10).Text("Daily Breakdown").Bold();
                    foreach (var day in report.DailyBreakdown)
                        col.Item().Text($"{day.Date:yyyy-MM-dd}: {day.Revenue:C} ({day.PaymentCount} payments)");
                });
            });
        });

        return document.GeneratePdf();
    }
}
