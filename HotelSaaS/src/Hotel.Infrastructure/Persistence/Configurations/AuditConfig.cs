using Hotel.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Hotel.Infrastructure.Persistence.Configurations;

public class AuditConfig : IEntityTypeConfiguration<AuditLog>
{
    public void Configure(EntityTypeBuilder<AuditLog> b)
    {
        b.ToTable("audit_logs", "audit");
        b.HasKey(x => x.Id);
        b.Property(x => x.Id).HasMaxLength(26);
        b.Property(x => x.HotelId).HasMaxLength(26);
        b.Property(x => x.UserId).HasMaxLength(26);
        b.Property(x => x.UserEmail).HasMaxLength(255);
        b.Property(x => x.Action).HasMaxLength(100).IsRequired();
        b.Property(x => x.EntityType).HasMaxLength(100).IsRequired();
        b.Property(x => x.EntityId).HasMaxLength(26);
        b.Property(x => x.OldValues).HasColumnType("jsonb");
        b.Property(x => x.NewValues).HasColumnType("jsonb");
        b.Property(x => x.IpAddress).HasMaxLength(50);
        b.Property(x => x.CorrelationId).HasMaxLength(50);
        b.Property(x => x.TraceId).HasMaxLength(50);
        b.HasIndex(x => new { x.HotelId, x.CreatedAt });
        b.HasIndex(x => new { x.EntityType, x.EntityId });
    }
}