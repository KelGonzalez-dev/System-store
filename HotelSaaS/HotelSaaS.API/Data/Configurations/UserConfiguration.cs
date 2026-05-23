using HotelSaaS.API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HotelSaaS.API.Data.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("Users");
        builder.HasKey(u => u.Id);
        builder.Property(u => u.Email).IsRequired().HasMaxLength(256);
        builder.Property(u => u.PasswordHash).IsRequired().HasMaxLength(256);
        builder.Property(u => u.FirstName).IsRequired().HasMaxLength(100);
        builder.Property(u => u.LastName).IsRequired().HasMaxLength(100);
        builder.Property(u => u.Phone).HasMaxLength(20);
        builder.Property(u => u.AvatarUrl).HasMaxLength(500);
        builder.HasIndex(u => u.Email).IsUnique().HasFilter("\"IsDeleted\" = false");
        builder.HasQueryFilter(u => !u.IsDeleted);

        builder.HasMany(u => u.UserRoles)
            .WithOne(ur => ur.User)
            .HasForeignKey(ur => ur.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class UserRoleConfiguration : IEntityTypeConfiguration<UserRole>
{
    public void Configure(EntityTypeBuilder<UserRole> builder)
    {
        builder.ToTable("UserRoles");
        builder.HasKey(ur => new { ur.UserId, ur.RoleId });
    }
}

public class UserHotelConfiguration : IEntityTypeConfiguration<UserHotel>
{
    public void Configure(EntityTypeBuilder<UserHotel> builder)
    {
        builder.ToTable("UserHotels");
        builder.HasKey(uh => new { uh.UserId, uh.HotelId });
    }
}
