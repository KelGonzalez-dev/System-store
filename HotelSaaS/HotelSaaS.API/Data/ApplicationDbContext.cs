using HotelSaaS.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace HotelSaaS.API.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<Permission> Permissions => Set<Permission>();
    public DbSet<UserRole> UserRoles => Set<UserRole>();
    public DbSet<RolePermission> RolePermissions => Set<RolePermission>();
    public DbSet<UserHotel> UserHotels => Set<UserHotel>();
    public DbSet<Hotel> Hotels => Set<Hotel>();
    public DbSet<Room> Rooms => Set<Room>();
    public DbSet<RoomType> RoomTypes => Set<RoomType>();
    public DbSet<Reservation> Reservations => Set<Reservation>();
    public DbSet<Guest> Guests => Set<Guest>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<Invoice> Invoices => Set<Invoice>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<Staff> Staff => Set<Staff>();
    public DbSet<Maintenance> Maintenances => Set<Maintenance>();
    public DbSet<Setting> Settings => Set<Setting>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);

        modelBuilder.Entity<Staff>(entity =>
        {
            entity.ToTable("Staff");
            entity.HasKey(s => s.Id);
            entity.Property(s => s.Position).IsRequired().HasMaxLength(100);
            entity.Property(s => s.Salary).HasPrecision(18, 2);
            entity.HasQueryFilter(s => !s.IsDeleted);
            entity.HasOne(s => s.Hotel).WithMany(h => h.Staff).HasForeignKey(s => s.HotelId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(s => s.User).WithMany(u => u.StaffMembers).HasForeignKey(s => s.UserId).OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Maintenance>(entity =>
        {
            entity.ToTable("Maintenances");
            entity.HasKey(m => m.Id);
            entity.Property(m => m.Title).IsRequired().HasMaxLength(200);
            entity.Property(m => m.Cost).HasPrecision(18, 2);
            entity.HasQueryFilter(m => !m.IsDeleted);
            entity.HasOne(m => m.Room).WithMany(r => r.Maintenances).HasForeignKey(m => m.RoomId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Review>(entity =>
        {
            entity.ToTable("Reviews");
            entity.HasKey(r => r.Id);
            entity.HasQueryFilter(r => !r.IsDeleted);
            entity.HasOne(r => r.Hotel).WithMany(h => h.Reviews).HasForeignKey(r => r.HotelId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(r => r.Guest).WithMany(g => g.Reviews).HasForeignKey(r => r.GuestId).OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Notification>(entity =>
        {
            entity.ToTable("Notifications");
            entity.HasKey(n => n.Id);
            entity.HasOne(n => n.User).WithMany(u => u.Notifications).HasForeignKey(n => n.UserId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Setting>(entity =>
        {
            entity.ToTable("Settings");
            entity.HasKey(s => s.Id);
            entity.Property(s => s.Key).IsRequired().HasMaxLength(100);
            entity.HasIndex(s => new { s.Key, s.HotelId }).IsUnique();
        });

        modelBuilder.Entity<AuditLog>(entity =>
        {
            entity.ToTable("AuditLogs");
            entity.HasKey(a => a.Id);
            entity.HasIndex(a => a.CreatedAt);
            entity.HasIndex(a => new { a.EntityName, a.EntityId });
        });
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            if (entry.State == EntityState.Modified)
                entry.Entity.UpdatedAt = DateTime.UtcNow;
        }
        return base.SaveChangesAsync(cancellationToken);
    }
}
