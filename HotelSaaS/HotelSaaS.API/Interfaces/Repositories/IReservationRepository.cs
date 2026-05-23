using HotelSaaS.API.Entities;

namespace HotelSaaS.API.Interfaces.Repositories;

public interface IReservationRepository
{
    Task<Reservation?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Reservation?> GetByCodeAsync(string code, CancellationToken cancellationToken = default);
    IQueryable<Reservation> Query();
    Task<Reservation> AddAsync(Reservation reservation, CancellationToken cancellationToken = default);
    Task UpdateAsync(Reservation reservation, CancellationToken cancellationToken = default);
    Task<string> GenerateCodeAsync(CancellationToken cancellationToken = default);
}
