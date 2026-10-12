using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Hotel.Infrastructure.Persistence.Configurations;

public class HotelConfig : IEntityTypeConfiguration<Hotel.Domain.Entities.Hotel>
{
    public void Configure(EntityTypeBuilder<Hotel.Domain.Entities.Hotel> b)
    {
        b.ToTable("hotels", "core");
        b.HasKey(x => x.Id);
        b.Property(x => x.Id).HasMaxLength(26);
        b.Property(x => x.TenantId).HasMaxLength(26).IsRequired();
        b.Property(x => x.Name).HasMaxLength(200).IsRequired();
        b.Property(x => x.Slug).HasMaxLength(100).IsRequired();
        b.Property(x => x.Currency).HasMaxLength(3).IsRequired();
        b.Property(x => x.Timezone).HasMaxLength(50).IsRequired();
        b.Property(x => x.Status).HasConversion<string>();
        b.Property(x => x.Settings).HasColumnType("jsonb")
            .HasConversion(v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(v, (System.Text.Json.JsonSerializerOptions?)null));
        b.HasIndex(x => x.Slug).IsUnique();
        b.HasIndex(x => x.TenantId);
        b.HasMany(x => x.Rooms).WithOne(r => r.Hotel).HasForeignKey(r => r.HotelId);
        b.HasMany(x => x.RoomTypes).WithOne(r => r.Hotel).HasForeignKey(r => r.HotelId);
    }
}