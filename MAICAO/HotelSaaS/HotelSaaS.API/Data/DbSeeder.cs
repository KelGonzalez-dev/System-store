using HotelSaaS.API.Common;
using HotelSaaS.API.Entities;
using HotelSaaS.API.Helpers;
using Microsoft.EntityFrameworkCore;

namespace HotelSaaS.API.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context, ILogger logger)
    {
        await context.Database.MigrateAsync();

        if (await context.Roles.AnyAsync()) return;

        logger.LogInformation("Seeding database...");

        var permissions = new List<Permission>
        {
            new() { Name = "users.read", Module = "Users", Description = "View users" },
            new() { Name = "users.write", Module = "Users", Description = "Manage users" },
            new() { Name = "hotels.read", Module = "Hotels", Description = "View hotels" },
            new() { Name = "hotels.write", Module = "Hotels", Description = "Manage hotels" },
            new() { Name = "rooms.read", Module = "Rooms", Description = "View rooms" },
            new() { Name = "rooms.write", Module = "Rooms", Description = "Manage rooms" },
            new() { Name = "reservations.read", Module = "Reservations", Description = "View reservations" },
            new() { Name = "reservations.write", Module = "Reservations", Description = "Manage reservations" },
            new() { Name = "payments.read", Module = "Payments", Description = "View payments" },
            new() { Name = "payments.write", Module = "Payments", Description = "Manage payments" },
            new() { Name = "reports.read", Module = "Reports", Description = "View reports" },
            new() { Name = "settings.write", Module = "Settings", Description = "Manage settings" },
            new() { Name = "audit.read", Module = "Audit", Description = "View audit logs" }
        };
        await context.Permissions.AddRangeAsync(permissions);

        var roles = new Dictionary<string, Role>
        {
            [RoleNames.SuperAdmin] = new() { Name = RoleNames.SuperAdmin, Description = "Full system access" },
            [RoleNames.Admin] = new() { Name = RoleNames.Admin, Description = "Hotel administrator" },
            [RoleNames.Manager] = new() { Name = RoleNames.Manager, Description = "Hotel manager" },
            [RoleNames.Receptionist] = new() { Name = RoleNames.Receptionist, Description = "Front desk staff" },
            [RoleNames.Guest] = new() { Name = RoleNames.Guest, Description = "Hotel guest" }
        };
        await context.Roles.AddRangeAsync(roles.Values);
        await context.SaveChangesAsync();

        foreach (var permission in permissions)
        {
            context.RolePermissions.Add(new RolePermission { RoleId = roles[RoleNames.SuperAdmin].Id, PermissionId = permission.Id });
            if (permission.Module is "Hotels" or "Rooms" or "Reservations" or "Payments" or "Reports")
                context.RolePermissions.Add(new RolePermission { RoleId = roles[RoleNames.Admin].Id, PermissionId = permission.Id });
        }

        var managerPerms = permissions.Where(p => p.Module is "Rooms" or "Reservations" or "Payments" or "Reports").ToList();
        foreach (var p in managerPerms)
            context.RolePermissions.Add(new RolePermission { RoleId = roles[RoleNames.Manager].Id, PermissionId = p.Id });

        var receptionistPerms = permissions.Where(p => p.Module is "Reservations" or "Rooms").ToList();
        foreach (var p in receptionistPerms)
            context.RolePermissions.Add(new RolePermission { RoleId = roles[RoleNames.Receptionist].Id, PermissionId = p.Id });

        var superAdmin = new User
        {
            Email = "admin@hotelsaas.com",
            PasswordHash = PasswordHelper.Hash("Admin@123456"),
            FirstName = "Super",
            LastName = "Admin",
            IsActive = true,
            EmailVerified = true
        };
        await context.Users.AddAsync(superAdmin);
        await context.SaveChangesAsync();

        context.UserRoles.Add(new UserRole { UserId = superAdmin.Id, RoleId = roles[RoleNames.SuperAdmin].Id });

        var hotel = new Hotel
        {
            Name = "HotelSaaS Grand Resort",
            Description = "Premium beachfront hotel",
            Address = "Av. Principal 100",
            City = "Cancún",
            Country = "México",
            PostalCode = "77500",
            Phone = "+52-998-123-4567",
            Email = "info@grandresort.com",
            Amenities = System.Text.Json.JsonSerializer.Serialize(new[] { "Pool", "Spa", "WiFi", "Restaurant", "Gym" }),
            IsActive = true,
            CreatedBy = superAdmin.Id
        };
        await context.Hotels.AddAsync(hotel);
        await context.SaveChangesAsync();

        context.UserHotels.Add(new UserHotel { UserId = superAdmin.Id, HotelId = hotel.Id });

        var roomTypes = new[]
        {
            new RoomType { HotelId = hotel.Id, Name = "Standard", Capacity = 2, BasePrice = 150m, Description = "Comfortable standard room", CreatedBy = superAdmin.Id },
            new RoomType { HotelId = hotel.Id, Name = "Deluxe", Capacity = 3, BasePrice = 250m, Description = "Spacious deluxe room", CreatedBy = superAdmin.Id },
            new RoomType { HotelId = hotel.Id, Name = "Suite", Capacity = 4, BasePrice = 450m, Description = "Luxury suite", CreatedBy = superAdmin.Id }
        };
        await context.RoomTypes.AddRangeAsync(roomTypes);
        await context.SaveChangesAsync();

        var rooms = new List<Room>();
        for (var i = 1; i <= 10; i++)
        {
            rooms.Add(new Room
            {
                HotelId = hotel.Id,
                RoomTypeId = roomTypes[i % 3].Id,
                Number = $"10{i:D2}",
                Floor = i / 5 + 1,
                PricePerNight = roomTypes[i % 3].BasePrice,
                Status = RoomStatus.Available,
                CreatedBy = superAdmin.Id
            });
        }
        await context.Rooms.AddRangeAsync(rooms);

        var guest = new Guest
        {
            FirstName = "Juan",
            LastName = "Pérez",
            Email = "juan.perez@email.com",
            Phone = "+52-555-1234",
            DocumentType = "INE",
            DocumentNumber = "ABC123456",
            Nationality = "Mexicana",
            CreatedBy = superAdmin.Id
        };
        await context.Guests.AddAsync(guest);
        await context.SaveChangesAsync();

        var settings = new[]
        {
            new Setting { Key = "tax_rate", Value = "0.16", Description = "IVA rate", Category = "Billing" },
            new Setting { Key = "currency", Value = "MXN", Description = "Default currency", Category = "Billing" },
            new Setting { Key = "cancellation_hours", Value = "24", Description = "Free cancellation hours", Category = "Reservations", HotelId = hotel.Id }
        };
        await context.Settings.AddRangeAsync(settings);
        await context.SaveChangesAsync();

        logger.LogInformation("Database seeded successfully. SuperAdmin: admin@hotelsaas.com / Admin@123456");
    }
}
