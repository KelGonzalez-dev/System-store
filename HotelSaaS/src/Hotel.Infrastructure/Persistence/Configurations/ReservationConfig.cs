using Hotel.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Hotel.Infrastructure.Persistence.Configurations;

public class ReservationConfig : IEntityTypeConfiguration<Reservation>
{
    public void Configure(EntityTypeBuilder<Reservation> b)
    {
        b.ToTable("reservations", "booking");
        b.HasKey(x => x.Id);
        b.Property(x => x.Id).HasMaxLength(26);
        b.Property(x => x.HotelId).HasMaxLength(26).IsRequired();
        b.Property(x => x.RoomId).HasMaxLength(26).IsRequired();
        b.Property(x => x.GuestId).HasMaxLength(26).IsRequired();
        b.Property(x => x.ConfirmationNumber).HasMaxLength(20).IsRequired();
        b.Property(x => x.Status).HasConversion<string>();
        b.Property(x => x.BaseAmount).HasColumnType("decimal(10,2)");
        b.Property(x => x.TaxAmount).HasColumnType("decimal(10,2)");
        b.Property(x => x.TotalAmount).HasColumnType("decimal(10,2)");
        b.Property(x => x.PaidAmount).HasColumnType("decimal(10,2)");
        b.Property(x => x.Currency).HasMaxLength(3);
        b.Property(x => x.Source).HasMaxLength(50);
        b.Property(x => x.Version).IsConcurrencyToken();
        b.HasIndex(x => x.ConfirmationNumber).IsUnique();
        b.HasIndex(x => new { x.HotelId, x.CheckInDate, x.CheckOutDate });
        b.HasOne(x => x.Room).WithMany(r => r.Reservations).HasForeignKey(x => x.RoomId);
        b.HasOne(x => x.Guest).WithMany(g => g.Reservations).HasForeignKey(x => x.GuestId);
        b.HasMany(x => x.Payments).WithOne(p => p.Reservation).HasForeignKey(p => p.ReservationId);
    }
}