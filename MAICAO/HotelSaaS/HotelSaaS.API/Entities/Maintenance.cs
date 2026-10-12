using HotelSaaS.API.Common;

namespace HotelSaaS.API.Entities;

public class Maintenance : AuditEntity
{
    public Guid RoomId { get; set; }
    public Room Room { get; set; } = null!;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public MaintenanceStatus Status { get; set; } = MaintenanceStatus.Scheduled;
    public DateTime ScheduledDate { get; set; }
    public DateTime? CompletedDate { get; set; }
    public string? AssignedTo { get; set; }
    public decimal? Cost { get; set; }
}
