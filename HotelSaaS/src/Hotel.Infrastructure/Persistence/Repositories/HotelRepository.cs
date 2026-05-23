using Hotel.Domain.Interfaces;
using Hotel.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Hotel.Infrastructure.Persistence.Repositories;

public class HotelRepository : BaseRepository<Hotel.Domain.Entities.Hotel>, IHotelRepository
{
    public HotelRepository(HotelDbContext ctx) : base(ctx) { }

    public async Task<Hotel.Domain.Entities.Hotel?> GetBySlugAsync(string slug, CancellationToken ct = default)
        => await _ctx.Hotels.FirstOrDefaultAsync(h => h.Slug == slug, ct);
}