using Hotel.Domain.Entities;
using Hotel.Domain.Interfaces;
using Hotel.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Hotel.Infrastructure.Persistence.Repositories;

public class GuestRepository : BaseRepository<Guest>, IGuestRepository
{
    public GuestRepository(HotelDbContext ctx) : base(ctx) { }

    public async Task<Guest?> GetWithReservationsAsync(string id, CancellationToken ct = default)
        => await _ctx.Guests.Include(g => g.Reservations).ThenInclude(r => r.Room)
            .FirstOrDefaultAsync(g => g.Id == id, ct);

    public async Task<(IEnumerable<Guest> Items, int Total)> SearchAsync(
        string hotelId, string? query, string? documentNumber, string? email,
        int page, int pageSize, CancellationToken ct = default)
    {
        var q = _ctx.Guests.Where(g => g.HotelId == hotelId);

        if (!string.IsNullOrWhiteSpace(query))
        {
            var lower = query.ToLower();
            q = q.Where(g => g.FirstName.ToLower().Contains(lower) ||
                              g.LastName.ToLower().Contains(lower) ||
                              g.Email.ToLower().Contains(lower) ||
                              (g.Phone != null && g.Phone.Contains(lower)));
        }

        if (!string.IsNullOrWhiteSpace(documentNumber))
            q = q.Where(g => g.DocumentNumber == documentNumber);

        if (!string.IsNullOrWhiteSpace(email))
            q = q.Where(g => g.Email.ToLower() == email.ToLower());

        var total = await q.CountAsync(ct);
        var items = await q.OrderBy(g => g.LastName).ThenBy(g => g.FirstName)
            .Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(ct);

        return (items, total);
    }

    public async Task<Guest?> GetByEmailAsync(string hotelId, string email, CancellationToken ct = default)
        => await _ctx.Guests.FirstOrDefaultAsync(g => g.HotelId == hotelId && g.Email.ToLower() == email.ToLower(), ct);

    public async Task<Guest?> GetByDocumentAsync(string hotelId, string documentNumber, CancellationToken ct = default)
        => await _ctx.Guests.FirstOrDefaultAsync(g => g.HotelId == hotelId && g.DocumentNumber == documentNumber, ct);
}