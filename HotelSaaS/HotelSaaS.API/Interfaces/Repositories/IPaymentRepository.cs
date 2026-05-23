using HotelSaaS.API.Entities;

namespace HotelSaaS.API.Interfaces.Repositories;

public interface IPaymentRepository
{
    Task<Payment?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    IQueryable<Payment> Query();
    Task<Payment> AddAsync(Payment payment, CancellationToken cancellationToken = default);
    Task UpdateAsync(Payment payment, CancellationToken cancellationToken = default);
}
