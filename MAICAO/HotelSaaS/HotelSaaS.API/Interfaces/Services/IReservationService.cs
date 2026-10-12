using HotelSaaS.API.Common;
using HotelSaaS.API.DTOs.Reservations;

namespace HotelSaaS.API.Interfaces.Services;

public interface IReservationService
{
    Task<PagedResponse<ReservationDto>> GetAllAsync(ReservationFilterDto filter, CancellationToken cancellationToken = default);
    Task<ReservationDto> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<ReservationDto> CreateAsync(CreateReservationDto dto, Guid? userId, Guid createdBy, CancellationToken cancellationToken = default);
    Task<ReservationDto> ConfirmAsync(Guid id, Guid updatedBy, CancellationToken cancellationToken = default);
    Task<ReservationDto> CancelAsync(Guid id, CancelReservationDto dto, Guid updatedBy, CancellationToken cancellationToken = default);
    Task<ReservationDto> CheckInAsync(Guid id, Guid updatedBy, CancellationToken cancellationToken = default);
    Task<ReservationDto> CheckOutAsync(Guid id, Guid updatedBy, CancellationToken cancellationToken = default);
}
