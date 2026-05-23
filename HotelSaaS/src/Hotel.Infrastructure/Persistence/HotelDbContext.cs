using Hotel.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace Hotel.Infrastructure.Persistence;

public class HotelDbContext : DbContext
{
    public HotelDbContext(DbContextOptions<HotelDbContext> options) : base(options) { }

    public DbSet<Hotel.Domain.Entities.Hotel> Hotels => Set<Hotel.Domain.Entities.Hotel>();
    public DbSet<RoomType> RoomTypes => Set<RoomType>();
    public DbSet<Room> Rooms => Set<Room>();
    public DbSet<Guest> Guests => Set<Guest>();
    public DbSet<Reservation> Reservations => Set<Reservation>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<PaymentRefund> PaymentRefunds => Set<PaymentRefund>();
    public DbSet<Hold> Holds => Set<Hold>();
    public DbSet<User> Users => Set<User>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfigurationsFromAssembly(typeof(HotelDbContext).Assembly);
    }
}