using Hotel.Domain.Entities;
using Hotel.Domain.Interfaces;
using Hotel.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Hotel.Infrastructure.Persistence.Repositories;

public class AuditRepository : BaseRepository<AuditLog>, IAuditRepository
{
    public AuditRepository(HotelDbContext ctx) : base(ctx) { }

    public async Task<(IEnumerable<AuditLog> Items, int Total)> GetPagedAsync(
        string? hotelId, string? entityType, string? entityId, string? userId,
        DateTime? from, DateTime? to, int page, int pageSize, CancellationToken ct = default)
    {
        var q = _ctx.AuditLogs.AsQueryable();
        if (hotelId != null) q = q.Where(a => a.HotelId == hotelId);
        if (entityType != null) q = q.Where(a => a.EntityType == entityType);
        if (entityId != null) q = q.Where(a => a.EntityId == entityId);
        if (userId != null) q = q.Where(a => a.UserId == userId);
        if (from.HasValue) q = q.Where(a => a.CreatedAt >= from.Value);
        if (to.HasValue) q = q.Where(a => a.CreatedAt <= to.Value);
        var total = await q.CountAsync(ct);
        var items = await q.OrderByDescending(a => a.CreatedAt)
            .Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(ct);
        return (items, total);
    }
}