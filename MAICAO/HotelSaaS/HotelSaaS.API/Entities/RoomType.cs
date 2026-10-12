namespace HotelSaaS.API.Entities;

public class RoomType : AuditEntity
{
    public Guid HotelId { get; set; }
    public Hotel Hotel { get; set; } = null!;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int Capacity { get; set; }
    public decimal BasePrice { get; set; }
    public string? Amenities { get; set; }
    public string? Images { get; set; }

    public ICollection<Room> Rooms { get; set; } = new List<Room>();
}
