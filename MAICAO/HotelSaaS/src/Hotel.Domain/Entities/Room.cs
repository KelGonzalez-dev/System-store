using Hotel.Domain.Enums;

namespace Hotel.Domain.Entities;

public class Room
{
    public string Id { get; set; } = default!;
    public string HotelId { get; set; } = default!;
    public string RoomTypeId { get; set; } = default!;
    public string Number { get; set; } = default!;
    public int Floor { get; set; }
    public RoomStatus Status { get; set; } = RoomStatus.Available;
    public bool IsActive { get; set; } = true;
    public string? Notes { get; set; }
    public string? MaintenanceReason { get; set; }
    public string? HousekeepingStatus { get; set; }
    public string? LastCleanedBy { get; set; }
    public DateTime? LastCleanedAt { get; set; }
    public long Version { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Hotel Hotel { get; set; } = default!;
    public RoomType RoomType { get; set; } = default!;
    public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
}
