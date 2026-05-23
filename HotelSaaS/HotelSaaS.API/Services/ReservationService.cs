using AutoMapper;
using AutoMapper.QueryableExtensions;
using HotelSaaS.API.Common;
using HotelSaaS.API.Data;
using HotelSaaS.API.DTOs.Reservations;
using HotelSaaS.API.Entities;
using HotelSaaS.API.Helpers;
using HotelSaaS.API.Interfaces.Repositories;
using HotelSaaS.API.Interfaces.Services;
using Microsoft.EntityFrameworkCore;

namespace HotelSaaS.API.Services;

public class ReservationService : IReservationService
{
    private readonly IReservationRepository _reservationRepository;
    private readonly IRoomRepository _roomRepository;
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public ReservationService(
        IReservationRepository reservationRepository,
        IRoomRepository roomRepository,
        ApplicationDbContext context,
        IMapper mapper)
    {
        _reservationRepository = reservationRepository;
        _roomRepository = roomRepository;
        _context = context;
        _mapper = mapper;
    }

    public async Task<PagedResponse<ReservationDto>> GetAllAsync(ReservationFilterDto filter, CancellationToken cancellationToken = default)
    {
        var query = _reservationRepository.Query();

        if (filter.HotelId.HasValue)
            query = query.Where(r => r.HotelId == filter.HotelId.Value);

        if (filter.GuestId.HasValue)
            query = query.Where(r => r.GuestId == filter.GuestId.Value);

        if (filter.Status.HasValue)
            query = query.Where(r => r.Status == filter.Status.Value);

        if (filter.FromDate.HasValue)
            query = query.Where(r => r.CheckIn >= filter.FromDate.Value);

        if (filter.ToDate.HasValue)
            query = query.Where(r => r.CheckOut <= filter.ToDate.Value);

        if (!string.IsNullOrWhiteSpace(filter.Search))
            query = query.Where(r => r.Code.Contains(filter.Search));

        query = string.IsNullOrWhiteSpace(filter.SortBy)
            ? query.OrderByDescending(r => r.CreatedAt)
            : PaginationHelper.ApplySorting(query, filter.SortBy, filter.SortDescending);

        var projected = query.ProjectTo<ReservationDto>(_mapper.ConfigurationProvider);
        return await PaginationHelper.ToPagedAsync(projected, filter.Page, filter.PageSize, cancellationToken);
    }

    public async Task<ReservationDto> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var reservation = await _reservationRepository.GetByIdAsync(id, cancellationToken)
            ?? throw ApiException.NotFound("Reservation not found.");
        return _mapper.Map<ReservationDto>(reservation);
    }

    public async Task<ReservationDto> CreateAsync(CreateReservationDto dto, Guid? userId, Guid createdBy, CancellationToken cancellationToken = default)
    {
        if (!await _roomRepository.IsAvailableAsync(dto.RoomId, dto.CheckIn, dto.CheckOut, cancellationToken: cancellationToken))
            throw ApiException.Conflict("Room is not available for the selected dates.");

        var room = await _roomRepository.GetByIdAsync(dto.RoomId, cancellationToken)
            ?? throw ApiException.NotFound("Room not found.");

        var nights = (dto.CheckOut - dto.CheckIn).Days;
        if (nights < 1) nights = 1;

        var reservation = new Reservation
        {
            Code = await _reservationRepository.GenerateCodeAsync(cancellationToken),
            HotelId = dto.HotelId,
            RoomId = dto.RoomId,
            GuestId = dto.GuestId,
            UserId = userId,
            CheckIn = dto.CheckIn,
            CheckOut = dto.CheckOut,
            Adults = dto.Adults,
            Children = dto.Children,
            Notes = dto.Notes,
            TotalAmount = room.PricePerNight * nights,
            Status = ReservationStatus.Pending,
            CreatedBy = createdBy
        };

        await _reservationRepository.AddAsync(reservation, cancellationToken);
        return await GetByIdAsync(reservation.Id, cancellationToken);
    }

    public async Task<ReservationDto> ConfirmAsync(Guid id, Guid updatedBy, CancellationToken cancellationToken = default)
    {
        var reservation = await GetReservationOrThrow(id, cancellationToken);
        if (reservation.Status != ReservationStatus.Pending)
            throw ApiException.BadRequest("Only pending reservations can be confirmed.");

        reservation.Status = ReservationStatus.Confirmed;
        reservation.ConfirmedAt = DateTime.UtcNow;
        reservation.UpdatedBy = updatedBy;
        await _reservationRepository.UpdateAsync(reservation, cancellationToken);
        return await GetByIdAsync(id, cancellationToken);
    }

    public async Task<ReservationDto> CancelAsync(Guid id, CancelReservationDto dto, Guid updatedBy, CancellationToken cancellationToken = default)
    {
        var reservation = await GetReservationOrThrow(id, cancellationToken);
        if (reservation.Status is ReservationStatus.CheckedOut or ReservationStatus.Cancelled)
            throw ApiException.BadRequest("Reservation cannot be cancelled.");

        reservation.Status = ReservationStatus.Cancelled;
        reservation.CancelledAt = DateTime.UtcNow;
        reservation.CancellationReason = dto.Reason;
        reservation.UpdatedBy = updatedBy;
        await _reservationRepository.UpdateAsync(reservation, cancellationToken);
        return await GetByIdAsync(id, cancellationToken);
    }

    public async Task<ReservationDto> CheckInAsync(Guid id, Guid updatedBy, CancellationToken cancellationToken = default)
    {
        var reservation = await GetReservationOrThrow(id, cancellationToken);
        if (reservation.Status != ReservationStatus.Confirmed)
            throw ApiException.BadRequest("Only confirmed reservations can check in.");

        reservation.Status = ReservationStatus.CheckedIn;
        reservation.CheckedInAt = DateTime.UtcNow;
        reservation.UpdatedBy = updatedBy;

        var room = await _roomRepository.GetByIdAsync(reservation.RoomId, cancellationToken);
        if (room != null)
        {
            room.Status = RoomStatus.Occupied;
            await _roomRepository.UpdateAsync(room, cancellationToken);
        }

        await _reservationRepository.UpdateAsync(reservation, cancellationToken);
        return await GetByIdAsync(id, cancellationToken);
    }

    public async Task<ReservationDto> CheckOutAsync(Guid id, Guid updatedBy, CancellationToken cancellationToken = default)
    {
        var reservation = await GetReservationOrThrow(id, cancellationToken);
        if (reservation.Status != ReservationStatus.CheckedIn)
            throw ApiException.BadRequest("Only checked-in reservations can check out.");

        reservation.Status = ReservationStatus.CheckedOut;
        reservation.CheckedOutAt = DateTime.UtcNow;
        reservation.UpdatedBy = updatedBy;

        var room = await _roomRepository.GetByIdAsync(reservation.RoomId, cancellationToken);
        if (room != null)
        {
            room.Status = RoomStatus.Cleaning;
            await _roomRepository.UpdateAsync(room, cancellationToken);
        }

        await _reservationRepository.UpdateAsync(reservation, cancellationToken);
        return await GetByIdAsync(id, cancellationToken);
    }

    private async Task<Reservation> GetReservationOrThrow(Guid id, CancellationToken cancellationToken) =>
        await _reservationRepository.GetByIdAsync(id, cancellationToken)
        ?? throw ApiException.NotFound("Reservation not found.");
}
