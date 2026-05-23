using HotelSaaS.API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HotelSaaS.API.Data.Configurations;

public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
{
    public void Configure(EntityTypeBuilder<Payment> builder)
    {
        builder.ToTable("Payments");
        builder.HasKey(p => p.Id);
        builder.Property(p => p.Amount).HasPrecision(18, 2);
        builder.Property(p => p.RefundAmount).HasPrecision(18, 2);
        builder.Property(p => p.TransactionId).HasMaxLength(100);
        builder.Property(p => p.StripePaymentId).HasMaxLength(100);
        builder.HasIndex(p => p.Status);
        builder.HasIndex(p => p.TransactionId);
        builder.HasQueryFilter(p => !p.IsDeleted);

        builder.HasOne(p => p.Reservation)
            .WithMany(r => r.Payments)
            .HasForeignKey(p => p.ReservationId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class InvoiceConfiguration : IEntityTypeConfiguration<Invoice>
{
    public void Configure(EntityTypeBuilder<Invoice> builder)
    {
        builder.ToTable("Invoices");
        builder.HasKey(i => i.Id);
        builder.Property(i => i.Number).IsRequired().HasMaxLength(50);
        builder.Property(i => i.Subtotal).HasPrecision(18, 2);
        builder.Property(i => i.Tax).HasPrecision(18, 2);
        builder.Property(i => i.Total).HasPrecision(18, 2);
        builder.HasIndex(i => i.Number).IsUnique();
        builder.HasQueryFilter(i => !i.IsDeleted);
    }
}

public class RoleConfiguration : IEntityTypeConfiguration<Role>
{
    public void Configure(EntityTypeBuilder<Role> builder)
    {
        builder.ToTable("Roles");
        builder.HasKey(r => r.Id);
        builder.Property(r => r.Name).IsRequired().HasMaxLength(50);
        builder.HasIndex(r => r.Name).IsUnique();
        builder.HasQueryFilter(r => !r.IsDeleted);
    }
}

public class PermissionConfiguration : IEntityTypeConfiguration<Permission>
{
    public void Configure(EntityTypeBuilder<Permission> builder)
    {
        builder.ToTable("Permissions");
        builder.HasKey(p => p.Id);
        builder.Property(p => p.Name).IsRequired().HasMaxLength(100);
        builder.Property(p => p.Module).IsRequired().HasMaxLength(50);
        builder.HasIndex(p => p.Name).IsUnique();
        builder.HasQueryFilter(p => !p.IsDeleted);
    }
}

public class RolePermissionConfiguration : IEntityTypeConfiguration<RolePermission>
{
    public void Configure(EntityTypeBuilder<RolePermission> builder)
    {
        builder.ToTable("RolePermissions");
        builder.HasKey(rp => new { rp.RoleId, rp.PermissionId });
    }
}
