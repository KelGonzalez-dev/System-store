using Hotel.Domain.Interfaces;

namespace Hotel.Application.Common.Interfaces;

public interface IUnitOfWorkApp : IUnitOfWork
{
    Task RebuildAvailabilityCacheAsync(string hotelId, CancellationToken ct = default);
    Task RefreshMaterializedViewsAsync(CancellationToken ct = default);
}