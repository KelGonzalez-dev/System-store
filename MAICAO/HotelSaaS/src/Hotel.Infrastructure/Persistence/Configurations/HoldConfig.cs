using Hotel.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Hotel.Infrastructure.Persistence.Configurations;

public class HoldConfig : IEntityTypeConfiguration<Hold>
{
    public void Configure(EntityTypeBuilder<Hold> b)
    {
        b.ToTable("holds", "booking");
        b.HasKey(x => x.Id);
        b.Property(x => x.Id).HasMaxLength(26);
        b.Property(x => x.HotelId).HasMaxLength(26).IsRequired();
        b.Property(x => x.RoomId).HasMaxLength(26).IsRequired();
        b.Property(x => x.Status).HasConversion<string>();
        b.HasIndex(x => new { x.RoomId, x.Status });
        b.HasOne(x => x.Room).WithMany().HasForeignKey(x => x.RoomId);
    }
}