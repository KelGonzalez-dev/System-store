using HotelSaaS.API.Data;
using HotelSaaS.API.Entities;
using HotelSaaS.API.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace HotelSaaS.API.Repositories;

public class HotelRepository : IHotelRepository
{
    private readonly ApplicationDbContext _context;

    public HotelRepository(ApplicationDbContext context) => _context = context;

    public async Task<Hotel?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        await _context.Hotels.FirstOrDefaultAsync(h => h.Id == id && !h.IsDeleted, cancellationToken);

    public IQueryable<Hotel> Query() => _context.Hotels.Where(h => !h.IsDeleted);

    public async Task<Hotel> AddAsync(Hotel hotel, CancellationToken cancellationToken = default)
    {
        await _context.Hotels.AddAsync(hotel, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
        return hotel;
    }

    public async Task UpdateAsync(Hotel hotel, CancellationToken cancellationToken = default)
    {
        hotel.UpdatedAt = DateTime.UtcNow;
        _context.Hotels.Update(hotel);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task SoftDeleteAsync(Hotel hotel, Guid deletedBy, CancellationToken cancellationToken = default)
    {
        hotel.IsDeleted = true;
        hotel.DeletedAt = DateTime.UtcNow;
        hotel.DeletedBy = deletedBy;
        await UpdateAsync(hotel, cancellationToken);
    }
}
