using Hotel.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Hotel.Infrastructure.Persistence.Configurations;

public class RoomConfig : IEntityTypeConfiguration<Room>
{
    public void Configure(EntityTypeBuilder<Room> b)
    {
        b.ToTable("rooms", "core");
        b.HasKey(x => x.Id);
        b.Property(x => x.Id).HasMaxLength(26);
        b.Property(x => x.HotelId).HasMaxLength(26).IsRequired();
        b.Property(x => x.RoomTypeId).HasMaxLength(26).IsRequired();
        b.Property(x => x.Number).HasMaxLength(20).IsRequired();
        b.Property(x => x.Status).HasConversion<string>();
        b.Property(x => x.HousekeepingStatus).HasMaxLength(50);
        b.Property(x => x.Version).IsConcurrencyToken();
        b.HasIndex(x => new { x.HotelId, x.Number }).IsUnique();
        b.HasOne(x => x.RoomType).WithMany(rt => rt.Rooms).HasForeignKey(x => x.RoomTypeId);
        b.HasMany(x => x.Reservations).WithOne(r => r.Room).HasForeignKey(r => r.RoomId);
    }
}

public class RoomTypeConfig : IEntityTypeConfiguration<RoomType>
{
    public void Configure(EntityTypeBuilder<RoomType> b)
    {
        b.ToTable("room_types", "core");
        b.HasKey(x => x.Id);
        b.Property(x => x.Id).HasMaxLength(26);
        b.Property(x => x.HotelId).HasMaxLength(26).IsRequired();
        b.Property(x => x.Name).HasMaxLength(100).IsRequired();
        b.Property(x => x.BedConfiguration).HasMaxLength(100).IsRequired();
        b.Property(x => x.BasePrice).HasColumnType("decimal(10,2)");
        b.Property(x => x.WeekendPrice).HasColumnType("decimal(10,2)");
        b.Property(x => x.Amenities).HasColumnType("jsonb")
            .HasConversion(v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<List<string>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new());
        b.Property(x => x.Images).HasColumnType("jsonb")
            .HasConversion(v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<List<string>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new());
    }
}