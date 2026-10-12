using HotelSaaS.API.Common;
using HotelSaaS.API.DTOs.Users;

namespace HotelSaaS.API.Interfaces.Services;

public interface IUserService
{
    Task<PagedResponse<UserDto>> GetAllAsync(UserFilterDto filter, CancellationToken cancellationToken = default);
    Task<UserDto> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<UserDto> CreateAsync(CreateUserDto dto, Guid createdBy, CancellationToken cancellationToken = default);
    Task<UserDto> UpdateAsync(Guid id, UpdateUserDto dto, Guid updatedBy, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, Guid deletedBy, CancellationToken cancellationToken = default);
    Task ActivateAsync(Guid id, CancellationToken cancellationToken = default);
    Task DeactivateAsync(Guid id, CancellationToken cancellationToken = default);
    Task<UserProfileDto> GetProfileAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<UserProfileDto> UpdateProfileAsync(Guid userId, UpdateProfileDto dto, CancellationToken cancellationToken = default);
    Task<string> UpdateAvatarAsync(Guid userId, IFormFile file, CancellationToken cancellationToken = default);
}
