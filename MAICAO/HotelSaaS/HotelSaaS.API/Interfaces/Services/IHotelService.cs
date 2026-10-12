using HotelSaaS.API.Common;
using HotelSaaS.API.DTOs.Hotels;

namespace HotelSaaS.API.Interfaces.Services;

public interface IHotelService
{
    Task<PagedResponse<HotelDto>> GetAllAsync(HotelFilterDto filter, CancellationToken cancellationToken = default);
    Task<HotelDto> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<HotelDto> CreateAsync(CreateHotelDto dto, Guid createdBy, CancellationToken cancellationToken = default);
    Task<HotelDto> UpdateAsync(Guid id, UpdateHotelDto dto, Guid updatedBy, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, Guid deletedBy, CancellationToken cancellationToken = default);
    Task<List<string>> AddImagesAsync(Guid id, List<IFormFile> files, CancellationToken cancellationToken = default);
}
