using Hotel.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Hotel.Infrastructure.Persistence.Configurations;

public class PaymentConfig : IEntityTypeConfiguration<Payment>
{
    public void Configure(EntityTypeBuilder<Payment> b)
    {
        b.ToTable("payments", "finance");
        b.HasKey(x => x.Id);
        b.Property(x => x.Id).HasMaxLength(26);
        b.Property(x => x.HotelId).HasMaxLength(26).IsRequired();
        b.Property(x => x.ReservationId).HasMaxLength(26).IsRequired();
        b.Property(x => x.IdempotencyKey).HasMaxLength(100).IsRequired();
        b.Property(x => x.Amount).HasColumnType("decimal(10,2)");
        b.Property(x => x.RefundedAmount).HasColumnType("decimal(10,2)");
        b.Property(x => x.Currency).HasMaxLength(3);
        b.Property(x => x.Method).HasConversion<string>();
        b.Property(x => x.Status).HasConversion<string>();
        b.Property(x => x.TransactionId).HasMaxLength(100);
        b.Property(x => x.Gateway).HasMaxLength(50);
        b.HasIndex(x => x.IdempotencyKey).IsUnique();
        b.HasMany(x => x.Refunds).WithOne(r => r.Payment).HasForeignKey(r => r.PaymentId);
    }
}

public class PaymentRefundConfig : IEntityTypeConfiguration<PaymentRefund>
{
    public void Configure(EntityTypeBuilder<PaymentRefund> b)
    {
        b.ToTable("payment_refunds", "finance");
        b.HasKey(x => x.Id);
        b.Property(x => x.Id).HasMaxLength(26);
        b.Property(x => x.PaymentId).HasMaxLength(26).IsRequired();
        b.Property(x => x.Amount).HasColumnType("decimal(10,2)");
        b.Property(x => x.Reason).HasMaxLength(500).IsRequired();
    }
}