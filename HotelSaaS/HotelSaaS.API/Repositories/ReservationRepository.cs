using HotelSaaS.API.Data;
using HotelSaaS.API.Entities;
using HotelSaaS.API.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace HotelSaaS.API.Repositories;

public class ReservationRepository : IReservationRepository
{
    private readonly ApplicationDbContext _context;

    public ReservationRepository(ApplicationDbContext context) => _context = context;

    public async Task<Reservation?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        await _context.Reservations
            .Include(r => r.Hotel)
            .Include(r => r.Room)
            .Include(r => r.Guest)
            .FirstOrDefaultAsync(r => r.Id == id && !r.IsDeleted, cancellationToken);

    public async Task<Reservation?> GetByCodeAsync(string code, CancellationToken cancellationToken = default) =>
        await _context.Reservations
            .Include(r => r.Hotel)
            .Include(r => r.Room)
            .Include(r => r.Guest)
            .FirstOrDefaultAsync(r => r.Code == code && !r.IsDeleted, cancellationToken);

    public IQueryable<Reservation> Query() =>
        _context.Reservations
            .Include(r => r.Hotel)
            .Include(r => r.Room)
            .Include(r => r.Guest)
            .Where(r => !r.IsDeleted);

    public async Task<Reservation> AddAsync(Reservation reservation, CancellationToken cancellationToken = default)
    {
        await _context.Reservations.AddAsync(reservation, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
        return reservation;
    }

    public async Task UpdateAsync(Reservation reservation, CancellationToken cancellationToken = default)
    {
        reservation.UpdatedAt = DateTime.UtcNow;
        _context.Reservations.Update(reservation);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<string> GenerateCodeAsync(CancellationToken cancellationToken = default)
    {
        string code;
        do
        {
            code = $"RSV-{DateTime.UtcNow:yyyyMMdd}-{Random.Shared.Next(1000, 9999)}";
        } while (await _context.Reservations.AnyAsync(r => r.Code == code, cancellationToken));
        return code;
    }
}
