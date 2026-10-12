namespace HotelSaaS.API.DTOs.Reports;

public class RevenueReportDto
{
    public DateTime From { get; set; }
    public DateTime To { get; set; }
    public decimal TotalRevenue { get; set; }
    public decimal TotalRefunds { get; set; }
    public decimal NetRevenue { get; set; }
    public int TotalPayments { get; set; }
    public List<DailyRevenueDto> DailyBreakdown { get; set; } = new();
}

public class DailyRevenueDto
{
    public DateTime Date { get; set; }
    public decimal Revenue { get; set; }
    public int PaymentCount { get; set; }
}

public class OccupancyReportDto
{
    public DateTime From { get; set; }
    public DateTime To { get; set; }
    public Guid? HotelId { get; set; }
    public int TotalRooms { get; set; }
    public double OccupancyRate { get; set; }
    public int TotalReservations { get; set; }
    public List<DailyOccupancyDto> DailyBreakdown { get; set; } = new();
}

public class DailyOccupancyDto
{
    public DateTime Date { get; set; }
    public int OccupiedRooms { get; set; }
    public double OccupancyRate { get; set; }
}

public class DashboardStatsDto
{
    public int TotalHotels { get; set; }
    public int TotalRooms { get; set; }
    public int ActiveReservations { get; set; }
    public int TodayCheckIns { get; set; }
    public int TodayCheckOuts { get; set; }
    public decimal MonthlyRevenue { get; set; }
    public double OccupancyRate { get; set; }
    public int PendingPayments { get; set; }
}

public class ReportQueryDto
{
    public DateTime? From { get; set; }
    public DateTime? To { get; set; }
    public Guid? HotelId { get; set; }
}
