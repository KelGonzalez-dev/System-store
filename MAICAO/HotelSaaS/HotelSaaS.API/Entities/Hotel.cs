namespace HotelSaaS.API.Entities;

public class Hotel : AuditEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string? PostalCode { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Images { get; set; }
    public string? Amenities { get; set; }
    public TimeSpan CheckInTime { get; set; } = new(14, 0, 0);
    public TimeSpan CheckOutTime { get; set; } = new(11, 0, 0);
    public bool IsActive { get; set; } = true;

    public ICollection<Room> Rooms { get; set; } = new List<Room>();
    public ICollection<RoomType> RoomTypes { get; set; } = new List<RoomType>();
    public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
    public ICollection<Staff> Staff { get; set; } = new List<Staff>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
    public ICollection<UserHotel> UserHotels { get; set; } = new List<UserHotel>();
    public ICollection<Setting> Settings { get; set; } = new List<Setting>();
}
