using Hotel.Application.Common.Interfaces;
using Hotel.Domain.Interfaces;
using Hotel.Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Npgsql;

namespace Hotel.Infrastructure.Persistence;

public class UnitOfWork : IUnitOfWorkApp
{
    private readonly HotelDbContext _ctx;
    private IDbContextTransaction? _transaction;
    private bool _disposed;

    private IReservationRepository? _reservations;
    private IRoomRepository? _rooms;
    private IRoomTypeRepository? _roomTypes;
    private IGuestRepository? _guests;
    private IPaymentRepository? _payments;
    private IHoldRepository? _holds;
    private IUserRepository? _users;
    private IAuditRepository? _audits;
    private IHotelRepository? _hotels;

    public UnitOfWork(HotelDbContext ctx) { _ctx = ctx; }

    public IReservationRepository Reservations => _reservations ??= new ReservationRepository(_ctx);
    public IRoomRepository Rooms => _rooms ??= new RoomRepository(_ctx);
    public IRoomTypeRepository RoomTypes => _roomTypes ??= new RoomTypeRepository(_ctx);
    public IGuestRepository Guests => _guests ??= new GuestRepository(_ctx);
    public IPaymentRepository Payments => _payments ??= new PaymentRepository(_ctx);
    public IHoldRepository Holds => _holds ??= new HoldRepository(_ctx);
    public IUserRepository Users => _users ??= new UserRepository(_ctx);
    public IAuditRepository Audits => _audits ??= new AuditRepository(_ctx);
    public IHotelRepository Hotels => _hotels ??= new HotelRepository(_ctx);

    public async Task<int> SaveChangesAsync(CancellationToken ct = default)
        => await _ctx.SaveChangesAsync(ct);

    public async Task BeginTransactionAsync(CancellationToken ct = default)
        => _transaction = await _ctx.Database.BeginTransactionAsync(ct);

    public async Task CommitTransactionAsync(CancellationToken ct = default)
    {
        if (_transaction == null) throw new InvalidOperationException("No active transaction.");
        await _transaction.CommitAsync(ct);
        await _transaction.DisposeAsync();
        _transaction = null;
    }

    public async Task RollbackTransactionAsync(CancellationToken ct = default)
    {
        if (_transaction == null) return;
        await _transaction.RollbackAsync(ct);
        await _transaction.DisposeAsync();
        _transaction = null;
    }

    public async Task RebuildAvailabilityCacheAsync(string hotelId, CancellationToken ct = default)
    {
        await _ctx.Database.ExecuteSqlRawAsync(
            "SELECT cache.fn_rebuild_availability(@hotel_id)",
            new NpgsqlParameter("hotel_id", hotelId));
    }

    public async Task RefreshMaterializedViewsAsync(CancellationToken ct = default)
    {
        await _ctx.Database.ExecuteSqlRawAsync(
            "REFRESH MATERIALIZED VIEW CONCURRENTLY booking.mv_availability_calendar");
    }

    public void Dispose()
    {
        if (_disposed) return;
        _transaction?.Dispose();
        _ctx.Dispose();
        _disposed = true;
        GC.SuppressFinalize(this);
    }
}