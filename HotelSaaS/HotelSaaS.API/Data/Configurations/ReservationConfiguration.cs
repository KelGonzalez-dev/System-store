using HotelSaaS.API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HotelSaaS.API.Data.Configurations;

public class ReservationConfiguration : IEntityTypeConfiguration<Reservation>
{
    public void Configure(EntityTypeBuilder<Reservation> builder)
    {
        builder.ToTable("Reservations");
        builder.HasKey(r => r.Id);
        builder.Property(r => r.Code).IsRequired().HasMaxLength(30);
        builder.Property(r => r.TotalAmount).HasPrecision(18, 2);
        builder.HasIndex(r => r.Code).IsUnique();
        builder.HasIndex(r => new { r.HotelId, r.CheckIn, r.CheckOut });
        builder.HasIndex(r => r.Status);
        builder.HasQueryFilter(r => !r.IsDeleted);

        builder.HasOne(r => r.Hotel)
            .WithMany(h => h.Reservations)
            .HasForeignKey(r => r.HotelId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(r => r.Room)
            .WithMany(ro => ro.Reservations)
            .HasForeignKey(r => r.RoomId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(r => r.Guest)
            .WithMany(g => g.Reservations)
            .HasForeignKey(r => r.GuestId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(r => r.User)
            .WithMany(u => u.Reservations)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}

public class GuestConfiguration : IEntityTypeConfiguration<Guest>
{
    public void Configure(EntityTypeBuilder<Guest> builder)
    {
        builder.ToTable("Guests");
        builder.HasKey(g => g.Id);
        builder.Property(g => g.Email).IsRequired().HasMaxLength(256);
        builder.Property(g => g.FirstName).IsRequired().HasMaxLength(100);
        builder.Property(g => g.LastName).IsRequired().HasMaxLength(100);
        builder.HasIndex(g => g.Email);
        builder.HasQueryFilter(g => !g.IsDeleted);
    }
}
