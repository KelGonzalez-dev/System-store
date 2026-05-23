using Hotel.Domain.Enums;

namespace Hotel.Domain.Entities;

public class Guest
{
    public string Id { get; set; } = default!;
    public string HotelId { get; set; } = default!;
    public string FirstName { get; set; } = default!;
    public string LastName { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string? Phone { get; set; }
    public string? CountryCode { get; set; }
    public DocumentType DocumentType { get; set; }
    public string? DocumentNumber { get; set; }
    public DateOnly? DateOfBirth { get; set; }
    public string? Nationality { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? Notes { get; set; }
    public GuestStatus Status { get; set; } = GuestStatus.Active;
    public int TotalStays { get; set; }
    public decimal TotalSpent { get; set; }
    public string? LoyaltyLevel { get; set; }
    public bool MarketingOptIn { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
}
