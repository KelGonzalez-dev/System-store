using HotelSaaS.API.Common;
using HotelSaaS.API.DTOs.Rooms;

namespace HotelSaaS.API.Interfaces.Services;

public interface IRoomService
{
    Task<PagedResponse<RoomDto>> GetAllAsync(RoomFilterDto filter, CancellationToken cancellationToken = default);
    Task<RoomDto> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<RoomDto> CreateAsync(CreateRoomDto dto, Guid createdBy, CancellationToken cancellationToken = default);
    Task<RoomDto> UpdateAsync(Guid id, UpdateRoomDto dto, Guid updatedBy, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, Guid deletedBy, CancellationToken cancellationToken = default);
    Task<List<RoomAvailabilityDto>> GetAvailabilityAsync(AvailabilityQueryDto query, CancellationToken cancellationToken = default);
    Task<List<string>> AddImagesAsync(Guid id, List<IFormFile> files, CancellationToken cancellationToken = default);
}
