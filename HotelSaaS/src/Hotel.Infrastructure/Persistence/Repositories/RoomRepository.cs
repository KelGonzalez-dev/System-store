using Hotel.Domain.Entities;
using Hotel.Domain.Enums;
using Hotel.Domain.Interfaces;
using Hotel.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace Hotel.Infrastructure.Persistence.Repositories;

public class RoomRepository : BaseRepository<Room>, IRoomRepository
{
    public RoomRepository(HotelDbContext ctx) : base(ctx) { }

    public async Task<Room?> GetWithDetailsAsync(string id, CancellationToken ct = default)
        => await _ctx.Rooms.Include(r => r.RoomType).FirstOrDefaultAsync(r => r.Id == id, ct);

    public async Task<(IEnumerable<Room> Items, int Total)> GetPagedAsync(
        string hotelId, RoomStatus? status, string? roomTypeId, int page, int pageSize, CancellationToken ct = default)
    {
        var query = _ctx.Rooms.Include(r => r.RoomType)
            .Where(r => r.HotelId == hotelId && r.IsActive);

        if (status.HasValue) query = query.Where(r => r.Status == status.Value);
        if (roomTypeId != null) query = query.Where(r => r.RoomTypeId == roomTypeId);

        var total = await query.CountAsync(ct);
        var items = await query.OrderBy(r => r.Number).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(ct);
        return (items, total);
    }

    public async Task<IEnumerable<Room>> GetAvailableRoomsAsync(
        string hotelId, DateOnly checkIn, DateOnly checkOut, int? adults, string? roomTypeId, CancellationToken ct = default)
    {
        // Use PostgreSQL function for availability check
        var sql = @"
            SELECT r.* FROM core.rooms r
            INNER JOIN core.room_types rt ON rt.id = r.room_type_id
            WHERE r.hotel_id = @hotel_id
              AND r.is_active = true
              AND r.status = 'Available'
              AND (@room_type_id IS NULL OR r.room_type_id = @room_type_id::text)
              AND (@adults IS NULL OR rt.max_occupancy >= @adults)
              AND booking.fn_is_room_available(r.id, @check_in, @check_out) = true
            ORDER BY r.number";

        return await _ctx.Rooms
            .FromSqlRaw(sql,
                new NpgsqlParameter("hotel_id", hotelId),
                new NpgsqlParameter("room_type_id", (object?)roomTypeId ?? DBNull.Value),
                new NpgsqlParameter("adults", (object?)adults ?? DBNull.Value),
                new NpgsqlParameter("check_in", checkIn),
                new NpgsqlParameter("check_out", checkOut))
            .Include(r => r.RoomType)
            .ToListAsync(ct);
    }
}

public class RoomTypeRepository : BaseRepository<RoomType>, IRoomTypeRepository
{
    public RoomTypeRepository(HotelDbContext ctx) : base(ctx) { }

    public async Task<(IEnumerable<RoomType> Items, int Total)> GetPagedAsync(
        string hotelId, int page, int pageSize, CancellationToken ct = default)
    {
        var query = _ctx.RoomTypes.Where(rt => rt.HotelId == hotelId && rt.IsActive);
        var total = await query.CountAsync(ct);
        var items = await query.OrderBy(rt => rt.Name).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(ct);
        return (items, total);
    }
}