using Hotel.Domain.Entities;
using Hotel.Domain.Enums;
using Hotel.Domain.Interfaces;
using Hotel.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace Hotel.Infrastructure.Persistence.Repositories;

public class ReservationRepository : BaseRepository<Reservation>, IReservationRepository
{
    public ReservationRepository(HotelDbContext ctx) : base(ctx) { }

    public async Task<Reservation?> GetWithDetailsAsync(string id, CancellationToken ct = default)
        => await _ctx.Reservations
            .Include(r => r.Room).ThenInclude(room => room.RoomType)
            .Include(r => r.Guest)
            .Include(r => r.Payments)
            .FirstOrDefaultAsync(r => r.Id == id, ct);

    public async Task<(IEnumerable<Reservation> Items, int Total)> GetPagedAsync(
        string hotelId, ReservationStatus? status, DateOnly? from, DateOnly? to,
        string? guestId, int page, int pageSize, CancellationToken ct = default)
    {
        var query = _ctx.Reservations
            .Include(r => r.Room)
            .Include(r => r.Guest)
            .Where(r => r.HotelId == hotelId);

        if (status.HasValue) query = query.Where(r => r.Status == status.Value);
        if (from.HasValue) query = query.Where(r => r.CheckInDate >= from.Value);
        if (to.HasValue) query = query.Where(r => r.CheckOutDate <= to.Value);
        if (guestId != null) query = query.Where(r => r.GuestId == guestId);

        var total = await query.CountAsync(ct);
        var items = await query.OrderByDescending(r => r.CreatedAt)
            .Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(ct);

        return (items, total);
    }

    public async Task<IEnumerable<Reservation>> GetGuestHistoryAsync(string guestId, CancellationToken ct = default)
        => await _ctx.Reservations
            .Include(r => r.Room).ThenInclude(room => room.RoomType)
            .Where(r => r.GuestId == guestId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync(ct);

    public async Task<string> CreateViaFunctionAsync(CreateReservationParams p, CancellationToken ct = default)
    {
        // Call PostgreSQL function - all business logic stays in DB
        var sql = @"SELECT booking.fn_create_reservation(
            @p_hotel_id, @p_room_id, @p_guest_id, @p_user_id,
            @p_check_in_date, @p_check_out_date, @p_adults, @p_children,
            @p_base_amount, @p_tax_amount, @p_total_amount, @p_currency,
            @p_source, @p_special_requests, @p_notes)";

        var result = await _ctx.Database.SqlQueryRaw<string>(sql,
            new NpgsqlParameter("p_hotel_id", p.HotelId),
            new NpgsqlParameter("p_room_id", p.RoomId),
            new NpgsqlParameter("p_guest_id", p.GuestId),
            new NpgsqlParameter("p_user_id", (object?)p.UserId ?? DBNull.Value),
            new NpgsqlParameter("p_check_in_date", p.CheckInDate),
            new NpgsqlParameter("p_check_out_date", p.CheckOutDate),
            new NpgsqlParameter("p_adults", p.Adults),
            new NpgsqlParameter("p_children", p.Children),
            new NpgsqlParameter("p_base_amount", p.BaseAmount),
            new NpgsqlParameter("p_tax_amount", p.TaxAmount),
            new NpgsqlParameter("p_total_amount", p.TotalAmount),
            new NpgsqlParameter("p_currency", p.Currency),
            new NpgsqlParameter("p_source", (object?)p.Source ?? DBNull.Value),
            new NpgsqlParameter("p_special_requests", (object?)p.SpecialRequests ?? DBNull.Value),
            new NpgsqlParameter("p_notes", (object?)p.Notes ?? DBNull.Value)
        ).FirstOrDefaultAsync(ct);

        return result ?? throw new InvalidOperationException("booking.fn_create_reservation returned no result.");
    }
}