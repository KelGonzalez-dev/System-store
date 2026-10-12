namespace Hotel.Domain.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IReservationRepository Reservations { get; }
    IRoomRepository Rooms { get; }
    IRoomTypeRepository RoomTypes { get; }
    IGuestRepository Guests { get; }
    IPaymentRepository Payments { get; }
    IHoldRepository Holds { get; }
    IUserRepository Users { get; }
    IAuditRepository Audits { get; }
    IHotelRepository Hotels { get; }
    Task<int> SaveChangesAsync(CancellationToken ct = default);
    Task BeginTransactionAsync(CancellationToken ct = default);
    Task CommitTransactionAsync(CancellationToken ct = default);
    Task RollbackTransactionAsync(CancellationToken ct = default);
}
