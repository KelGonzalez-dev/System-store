namespace HotelSaaS.API.Entities;

public class Review : AuditEntity
{
    public Guid HotelId { get; set; }
    public Hotel Hotel { get; set; } = null!;
    public Guid GuestId { get; set; }
    public Guest Guest { get; set; } = null!;
    public int Rating { get; set; }
    public string? Comment { get; set; }
    public bool IsPublished { get; set; } = true;
}
