using HotelSaaS.API.Entities;

namespace HotelSaaS.API.Interfaces.Repositories;

public interface IHotelRepository
{
    Task<Hotel?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    IQueryable<Hotel> Query();
    Task<Hotel> AddAsync(Hotel hotel, CancellationToken cancellationToken = default);
    Task UpdateAsync(Hotel hotel, CancellationToken cancellationToken = default);
    Task SoftDeleteAsync(Hotel hotel, Guid deletedBy, CancellationToken cancellationToken = default);
}
