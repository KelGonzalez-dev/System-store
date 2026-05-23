using HotelSaaS.API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HotelSaaS.API.Data.Configurations;

public class HotelConfiguration : IEntityTypeConfiguration<Hotel>
{
    public void Configure(EntityTypeBuilder<Hotel> builder)
    {
        builder.ToTable("Hotels");
        builder.HasKey(h => h.Id);
        builder.Property(h => h.Name).IsRequired().HasMaxLength(200);
        builder.Property(h => h.Address).IsRequired().HasMaxLength(500);
        builder.Property(h => h.City).IsRequired().HasMaxLength(100);
        builder.Property(h => h.Country).IsRequired().HasMaxLength(100);
        builder.Property(h => h.Email).HasMaxLength(256);
        builder.Property(h => h.Phone).HasMaxLength(20);
        builder.HasIndex(h => h.Name);
        builder.HasIndex(h => new { h.City, h.Country });
        builder.HasQueryFilter(h => !h.IsDeleted);
    }
}
