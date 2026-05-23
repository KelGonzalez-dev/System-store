using HotelSaaS.API.Entities;

namespace HotelSaaS.API.Interfaces.Repositories;

public interface IRoomRepository
{
    Task<Room?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    IQueryable<Room> Query();
    Task<Room> AddAsync(Room room, CancellationToken cancellationToken = default);
    Task UpdateAsync(Room room, CancellationToken cancellationToken = default);
    Task SoftDeleteAsync(Room room, Guid deletedBy, CancellationToken cancellationToken = default);
    Task<bool> IsAvailableAsync(Guid roomId, DateTime checkIn, DateTime checkOut, Guid? excludeReservationId = null, CancellationToken cancellationToken = default);
}
