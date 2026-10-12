using Hotel.Domain.Entities;
using Hotel.Domain.Enums;
using Hotel.Domain.Interfaces;
using Hotel.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Hotel.Infrastructure.Persistence.Repositories;

public class PaymentRepository : BaseRepository<Payment>, IPaymentRepository
{
    public PaymentRepository(HotelDbContext ctx) : base(ctx) { }

    public async Task<Payment?> GetByIdempotencyKeyAsync(string key, CancellationToken ct = default)
        => await _ctx.Payments.FirstOrDefaultAsync(p => p.IdempotencyKey == key, ct);

    public async Task<(IEnumerable<Payment> Items, int Total)> GetByReservationAsync(
        string reservationId, int page, int pageSize, CancellationToken ct = default)
    {
        var q = _ctx.Payments.Where(p => p.ReservationId == reservationId);
        var total = await q.CountAsync(ct);
        var items = await q.OrderByDescending(p => p.CreatedAt)
            .Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(ct);
        return (items, total);
    }

    public async Task<(IEnumerable<Payment> Items, int Total)> GetPagedAsync(
        string hotelId, PaymentStatus? status, DateTime? from, DateTime? to,
        int page, int pageSize, CancellationToken ct = default)
    {
        var q = _ctx.Payments.Where(p => p.HotelId == hotelId);
        if (status.HasValue) q = q.Where(p => p.Status == status.Value);
        if (from.HasValue) q = q.Where(p => p.CreatedAt >= from.Value);
        if (to.HasValue) q = q.Where(p => p.CreatedAt <= to.Value);
        var total = await q.CountAsync(ct);
        var items = await q.OrderByDescending(p => p.CreatedAt)
            .Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(ct);
        return (items, total);
    }
}