using HotelSaaS.API.Common;

namespace HotelSaaS.API.Entities;

public class Room : AuditEntity
{
    public Guid HotelId { get; set; }
    public Hotel Hotel { get; set; } = null!;
    public Guid RoomTypeId { get; set; }
    public RoomType RoomType { get; set; } = null!;
    public string Number { get; set; } = string.Empty;
    public int Floor { get; set; }
    public RoomStatus Status { get; set; } = RoomStatus.Available;
    public decimal PricePerNight { get; set; }
    public string? Description { get; set; }
    public string? Images { get; set; }
    public bool IsActive { get; set; } = true;

    public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
    public ICollection<Maintenance> Maintenances { get; set; } = new List<Maintenance>();
}
