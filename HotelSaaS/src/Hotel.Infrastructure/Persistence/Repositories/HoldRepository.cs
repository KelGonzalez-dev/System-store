using Hotel.Domain.Entities;
using Hotel.Domain.Enums;
using Hotel.Domain.Interfaces;
using Hotel.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Hotel.Infrastructure.Persistence.Repositories;

public class HoldRepository : BaseRepository<Hold>, IHoldRepository
{
    public HoldRepository(HotelDbContext ctx) : base(ctx) { }

    public async Task<(IEnumerable<Hold> Items, int Total)> GetPagedAsync(
        string hotelId, HoldStatus? status, int page, int pageSize, CancellationToken ct = default)
    {
        var q = _ctx.Holds.Include(h => h.Room).Where(h => h.HotelId == hotelId);
        if (status.HasValue) q = q.Where(h => h.Status == status.Value);
        var total = await q.CountAsync(ct);
        var items = await q.OrderByDescending(h => h.CreatedAt)
            .Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(ct);
        return (items, total);
    }

    public async Task<IEnumerable<Hold>> GetExpiredHoldsAsync(CancellationToken ct = default)
        => await _ctx.Holds.Where(h => h.Status == HoldStatus.Active && h.ExpiresAt < DateTime.UtcNow)
            .ToListAsync(ct);

    public async Task<bool> HasActiveHoldAsync(string roomId, DateOnly checkIn, DateOnly checkOut, CancellationToken ct = default)
        => await _ctx.Holds.AnyAsync(h =>
            h.RoomId == roomId && h.Status == HoldStatus.Active &&
            h.ExpiresAt > DateTime.UtcNow &&
            h.CheckInDate < checkOut && h.CheckOutDate > checkIn, ct);
}