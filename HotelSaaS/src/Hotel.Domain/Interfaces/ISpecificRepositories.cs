using Hotel.Domain.Entities;
using Hotel.Domain.Enums;

namespace Hotel.Domain.Interfaces;

public interface IReservationRepository : IRepository<Reservation>
{
    Task<Reservation?> GetWithDetailsAsync(string id, CancellationToken ct = default);
    Task<(IEnumerable<Reservation> Items, int Total)> GetPagedAsync(
        string hotelId, ReservationStatus? status, DateOnly? from, DateOnly? to,
        string? guestId, int page, int pageSize, CancellationToken ct = default);
    Task<IEnumerable<Reservation>> GetGuestHistoryAsync(string guestId, CancellationToken ct = default);
    Task<string> CreateViaFunctionAsync(CreateReservationParams p, CancellationToken ct = default);
}

public record CreateReservationParams(
    string HotelId, string RoomId, string GuestId, string? UserId,
    DateOnly CheckInDate, DateOnly CheckOutDate, int Adults, int Children,
    decimal BaseAmount, decimal TaxAmount, decimal TotalAmount, string Currency,
    string? Source, string? SpecialRequests, string? Notes);

public interface IRoomRepository : IRepository<Room>
{
    Task<Room?> GetWithDetailsAsync(string id, CancellationToken ct = default);
    Task<(IEnumerable<Room> Items, int Total)> GetPagedAsync(
        string hotelId, RoomStatus? status, string? roomTypeId,
        int page, int pageSize, CancellationToken ct = default);
    Task<IEnumerable<Room>> GetAvailableRoomsAsync(
        string hotelId, DateOnly checkIn, DateOnly checkOut,
        int? adults, string? roomTypeId, CancellationToken ct = default);
}

public interface IRoomTypeRepository : IRepository<RoomType>
{
    Task<(IEnumerable<RoomType> Items, int Total)> GetPagedAsync(
        string hotelId, int page, int pageSize, CancellationToken ct = default);
}

public interface IGuestRepository : IRepository<Guest>
{
    Task<Guest?> GetWithReservationsAsync(string id, CancellationToken ct = default);
    Task<(IEnumerable<Guest> Items, int Total)> SearchAsync(
        string hotelId, string? query, string? documentNumber,
        string? email, int page, int pageSize, CancellationToken ct = default);
    Task<Guest?> GetByEmailAsync(string hotelId, string email, CancellationToken ct = default);
    Task<Guest?> GetByDocumentAsync(string hotelId, string documentNumber, CancellationToken ct = default);
}

public interface IPaymentRepository : IRepository<Payment>
{
    Task<Payment?> GetByIdempotencyKeyAsync(string key, CancellationToken ct = default);
    Task<(IEnumerable<Payment> Items, int Total)> GetByReservationAsync(
        string reservationId, int page, int pageSize, CancellationToken ct = default);
    Task<(IEnumerable<Payment> Items, int Total)> GetPagedAsync(
        string hotelId, PaymentStatus? status, DateTime? from, DateTime? to,
        int page, int pageSize, CancellationToken ct = default);
}

public interface IHoldRepository : IRepository<Hold>
{
    Task<(IEnumerable<Hold> Items, int Total)> GetPagedAsync(
        string hotelId, HoldStatus? status, int page, int pageSize, CancellationToken ct = default);
    Task<IEnumerable<Hold>> GetExpiredHoldsAsync(CancellationToken ct = default);
    Task<bool> HasActiveHoldAsync(string roomId, DateOnly checkIn, DateOnly checkOut, CancellationToken ct = default);
}

public interface IUserRepository : IRepository<User>
{
    Task<User?> GetByEmailAsync(string email, CancellationToken ct = default);
    Task<User?> GetByRefreshTokenAsync(string refreshToken, CancellationToken ct = default);
}

public interface IAuditRepository : IRepository<AuditLog>
{
    Task<(IEnumerable<AuditLog> Items, int Total)> GetPagedAsync(
        string? hotelId, string? entityType, string? entityId, string? userId,
        DateTime? from, DateTime? to, int page, int pageSize, CancellationToken ct = default);
}

public interface IHotelRepository : IRepository<Hotel.Domain.Entities.Hotel>
{
    Task<Hotel.Domain.Entities.Hotel?> GetBySlugAsync(string slug, CancellationToken ct = default);
}
