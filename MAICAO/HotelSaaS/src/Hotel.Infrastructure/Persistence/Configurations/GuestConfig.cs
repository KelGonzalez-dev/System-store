using Hotel.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Hotel.Infrastructure.Persistence.Configurations;

public class GuestConfig : IEntityTypeConfiguration<Guest>
{
    public void Configure(EntityTypeBuilder<Guest> b)
    {
        b.ToTable("guests", "core");
        b.HasKey(x => x.Id);
        b.Property(x => x.Id).HasMaxLength(26);
        b.Property(x => x.HotelId).HasMaxLength(26).IsRequired();
        b.Property(x => x.FirstName).HasMaxLength(100).IsRequired();
        b.Property(x => x.LastName).HasMaxLength(100).IsRequired();
        b.Property(x => x.Email).HasMaxLength(255).IsRequired();
        b.Property(x => x.Phone).HasMaxLength(30);
        b.Property(x => x.DocumentType).HasConversion<string>();
        b.Property(x => x.DocumentNumber).HasMaxLength(50);
        b.Property(x => x.Status).HasConversion<string>();
        b.Property(x => x.TotalSpent).HasColumnType("decimal(12,2)");
        b.HasIndex(x => new { x.HotelId, x.Email });
        b.HasIndex(x => new { x.HotelId, x.DocumentNumber });
    }
}