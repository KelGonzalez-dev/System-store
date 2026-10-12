namespace HotelSaaS.API.Entities;

public class Staff : AuditEntity
{
    public Guid HotelId { get; set; }
    public Hotel Hotel { get; set; } = null!;
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public string Position { get; set; } = string.Empty;
    public string? Department { get; set; }
    public DateTime HireDate { get; set; }
    public bool IsActive { get; set; } = true;
    public decimal? Salary { get; set; }
}
