using HotelSaaS.API.Common;
using HotelSaaS.API.Data;
using HotelSaaS.API.Entities;
using HotelSaaS.API.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace HotelSaaS.API.Repositories;

public class RoomRepository : IRoomRepository
{
    private readonly ApplicationDbContext _context;

    public RoomRepository(ApplicationDbContext context) => _context = context;

    public async Task<Room?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        await _context.Rooms
            .Include(r => r.Hotel)
            .Include(r => r.RoomType)
            .FirstOrDefaultAsync(r => r.Id == id && !r.IsDeleted, cancellationToken);

    public IQueryable<Room> Query() =>
        _context.Rooms
            .Include(r => r.Hotel)
            .Include(r => r.RoomType)
            .Where(r => !r.IsDeleted);

    public async Task<Room> AddAsync(Room room, CancellationToken cancellationToken = default)
    {
        await _context.Rooms.AddAsync(room, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
        return room;
    }

    public async Task UpdateAsync(Room room, CancellationToken cancellationToken = default)
    {
        room.UpdatedAt = DateTime.UtcNow;
        _context.Rooms.Update(room);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task SoftDeleteAsync(Room room, Guid deletedBy, CancellationToken cancellationToken = default)
    {
        room.IsDeleted = true;
        room.DeletedAt = DateTime.UtcNow;
        room.DeletedBy = deletedBy;
        await UpdateAsync(room, cancellationToken);
    }

    public async Task<bool> IsAvailableAsync(Guid roomId, DateTime checkIn, DateTime checkOut, Guid? excludeReservationId = null, CancellationToken cancellationToken = default)
    {
        var hasConflict = await _context.Reservations.AnyAsync(r =>
            r.RoomId == roomId &&
            !r.IsDeleted &&
            r.Status != ReservationStatus.Cancelled &&
            (excludeReservationId == null || r.Id != excludeReservationId) &&
            r.CheckIn < checkOut && r.CheckOut > checkIn, cancellationToken);

        return !hasConflict;
    }
}
