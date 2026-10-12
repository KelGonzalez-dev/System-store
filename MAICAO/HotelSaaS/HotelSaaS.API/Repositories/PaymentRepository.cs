using HotelSaaS.API.Data;
using HotelSaaS.API.Entities;
using HotelSaaS.API.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace HotelSaaS.API.Repositories;

public class PaymentRepository : IPaymentRepository
{
    private readonly ApplicationDbContext _context;

    public PaymentRepository(ApplicationDbContext context) => _context = context;

    public async Task<Payment?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        await _context.Payments
            .Include(p => p.Reservation)
            .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted, cancellationToken);

    public IQueryable<Payment> Query() =>
        _context.Payments
            .Include(p => p.Reservation)
            .Where(p => !p.IsDeleted);

    public async Task<Payment> AddAsync(Payment payment, CancellationToken cancellationToken = default)
    {
        await _context.Payments.AddAsync(payment, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
        return payment;
    }

    public async Task UpdateAsync(Payment payment, CancellationToken cancellationToken = default)
    {
        payment.UpdatedAt = DateTime.UtcNow;
        _context.Payments.Update(payment);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
