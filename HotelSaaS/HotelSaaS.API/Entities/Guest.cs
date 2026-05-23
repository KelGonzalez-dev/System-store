namespace HotelSaaS.API.Entities;

public class Guest : AuditEntity
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? DocumentType { get; set; }
    public string? DocumentNumber { get; set; }
    public string? Nationality { get; set; }
    public string? Address { get; set; }
    public DateTime? DateOfBirth { get; set; }

    public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
}
