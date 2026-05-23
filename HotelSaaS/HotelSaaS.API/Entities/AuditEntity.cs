namespace HotelSaaS.API.Entities;

public abstract class AuditEntity : BaseEntity
{
    public Guid? CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }
    public Guid? DeletedBy { get; set; }
    public DateTime? DeletedAt { get; set; }
}
