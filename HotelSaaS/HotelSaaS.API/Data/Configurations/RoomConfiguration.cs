using HotelSaaS.API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HotelSaaS.API.Data.Configurations;

public class RoomConfiguration : IEntityTypeConfiguration<Room>
{
    public void Configure(EntityTypeBuilder<Room> builder)
    {
        builder.ToTable("Rooms");
        builder.HasKey(r => r.Id);
        builder.Property(r => r.Number).IsRequired().HasMaxLength(20);
        builder.Property(r => r.PricePerNight).HasPrecision(18, 2);
        builder.HasIndex(r => new { r.HotelId, r.Number }).IsUnique().HasFilter("\"IsDeleted\" = false");
        builder.HasIndex(r => r.Status);
        builder.HasQueryFilter(r => !r.IsDeleted);

        builder.HasOne(r => r.Hotel)
            .WithMany(h => h.Rooms)
            .HasForeignKey(r => r.HotelId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(r => r.RoomType)
            .WithMany(rt => rt.Rooms)
            .HasForeignKey(r => r.RoomTypeId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class RoomTypeConfiguration : IEntityTypeConfiguration<RoomType>
{
    public void Configure(EntityTypeBuilder<RoomType> builder)
    {
        builder.ToTable("RoomTypes");
        builder.HasKey(rt => rt.Id);
        builder.Property(rt => rt.Name).IsRequired().HasMaxLength(100);
        builder.Property(rt => rt.BasePrice).HasPrecision(18, 2);
        builder.HasQueryFilter(rt => !rt.IsDeleted);

        builder.HasOne(rt => rt.Hotel)
            .WithMany(h => h.RoomTypes)
            .HasForeignKey(rt => rt.HotelId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
