using Hotel.Domain.Enums;

namespace Hotel.Domain.Entities;

public class Hotel
{
    public string Id { get; set; } = default!;
    public string TenantId { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string Slug { get; set; } = default!;
    public string? Description { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Website { get; set; }
    public int StarRating { get; set; }
    public string? LogoUrl { get; set; }
    public string? CoverImageUrl { get; set; }
    public string Currency { get; set; } = "USD";
    public string Timezone { get; set; } = "UTC";
    public TimeOnly CheckInTime { get; set; } = new(14, 0);
    public TimeOnly CheckOutTime { get; set; } = new(12, 0);
    public HotelStatus Status { get; set; } = HotelStatus.Active;
    public Dictionary<string, object>? Settings { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public ICollection<Room> Rooms { get; set; } = new List<Room>();
    public ICollection<RoomType> RoomTypes { get; set; } = new List<RoomType>();
}
