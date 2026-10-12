namespace Hotel.Domain.Entities;

public class RoomType
{
    public string Id { get; set; } = default!;
    public string HotelId { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public int MaxOccupancy { get; set; }
    public int MaxAdults { get; set; }
    public int MaxChildren { get; set; }
    public decimal BasePrice { get; set; }
    public decimal? WeekendPrice { get; set; }
    public int SizeM2 { get; set; }
    public string BedConfiguration { get; set; } = default!;
    public List<string> Amenities { get; set; } = new();
    public List<string> Images { get; set; } = new();
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Hotel Hotel { get; set; } = default!;
    public ICollection<Room> Rooms { get; set; } = new List<Room>();
}
