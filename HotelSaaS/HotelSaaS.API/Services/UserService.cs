using AutoMapper;
using AutoMapper.QueryableExtensions;
using HotelSaaS.API.Common;
using HotelSaaS.API.Data;
using HotelSaaS.API.DTOs.Users;
using HotelSaaS.API.Entities;
using HotelSaaS.API.Helpers;
using HotelSaaS.API.Interfaces.Repositories;
using HotelSaaS.API.Interfaces.Services;
using Microsoft.EntityFrameworkCore;

namespace HotelSaaS.API.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IUploadService _uploadService;

    public UserService(IUserRepository userRepository, ApplicationDbContext context, IMapper mapper, IUploadService uploadService)
    {
        _userRepository = userRepository;
        _context = context;
        _mapper = mapper;
        _uploadService = uploadService;
    }

    public async Task<PagedResponse<UserDto>> GetAllAsync(UserFilterDto filter, CancellationToken cancellationToken = default)
    {
        var query = _userRepository.Query();

        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            var search = filter.Search.ToLower();
            query = query.Where(u =>
                u.Email.Contains(search) ||
                u.FirstName.ToLower().Contains(search) ||
                u.LastName.ToLower().Contains(search));
        }

        if (filter.IsActive.HasValue)
            query = query.Where(u => u.IsActive == filter.IsActive.Value);

        if (filter.EmailVerified.HasValue)
            query = query.Where(u => u.EmailVerified == filter.EmailVerified.Value);

        if (filter.RoleId.HasValue)
            query = query.Where(u => u.UserRoles.Any(ur => ur.RoleId == filter.RoleId.Value));

        if (!string.IsNullOrWhiteSpace(filter.SortBy))
            query = PaginationHelper.ApplySorting(query, filter.SortBy, filter.SortDescending);
        else
            query = query.OrderByDescending(u => u.CreatedAt);

        var projected = query.ProjectTo<UserDto>(_mapper.ConfigurationProvider);
        var paged = await PaginationHelper.ToPagedAsync(projected, filter.Page, filter.PageSize, cancellationToken);
        return paged;
    }

    public async Task<UserDto> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByIdWithRolesAsync(id, cancellationToken)
            ?? throw ApiException.NotFound("User not found.");
        return _mapper.Map<UserDto>(user);
    }

    public async Task<UserDto> CreateAsync(CreateUserDto dto, Guid createdBy, CancellationToken cancellationToken = default)
    {
        if (await _userRepository.EmailExistsAsync(dto.Email, cancellationToken: cancellationToken))
            throw ApiException.Conflict("Email already exists.");

        var user = _mapper.Map<User>(dto);
        user.Email = dto.Email.ToLower();
        user.PasswordHash = PasswordHelper.Hash(dto.Password);
        user.CreatedBy = createdBy;
        user.EmailVerified = true;

        await _userRepository.AddAsync(user, cancellationToken);

        foreach (var roleId in dto.RoleIds)
            _context.UserRoles.Add(new UserRole { UserId = user.Id, RoleId = roleId });

        await _context.SaveChangesAsync(cancellationToken);
        return await GetByIdAsync(user.Id, cancellationToken);
    }

    public async Task<UserDto> UpdateAsync(Guid id, UpdateUserDto dto, Guid updatedBy, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByIdWithRolesAsync(id, cancellationToken)
            ?? throw ApiException.NotFound("User not found.");

        user.FirstName = dto.FirstName;
        user.LastName = dto.LastName;
        user.Phone = dto.Phone;
        user.UpdatedBy = updatedBy;

        if (dto.RoleIds != null)
        {
            var existing = await _context.UserRoles.Where(ur => ur.UserId == id).ToListAsync(cancellationToken);
            _context.UserRoles.RemoveRange(existing);
            foreach (var roleId in dto.RoleIds)
                _context.UserRoles.Add(new UserRole { UserId = id, RoleId = roleId });
        }

        await _userRepository.UpdateAsync(user, cancellationToken);
        return await GetByIdAsync(id, cancellationToken);
    }

    public async Task DeleteAsync(Guid id, Guid deletedBy, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByIdAsync(id, cancellationToken)
            ?? throw ApiException.NotFound("User not found.");
        await _userRepository.SoftDeleteAsync(user, deletedBy, cancellationToken);
    }

    public async Task ActivateAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByIdAsync(id, cancellationToken)
            ?? throw ApiException.NotFound("User not found.");
        user.IsActive = true;
        await _userRepository.UpdateAsync(user, cancellationToken);
    }

    public async Task DeactivateAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByIdAsync(id, cancellationToken)
            ?? throw ApiException.NotFound("User not found.");
        user.IsActive = false;
        await _userRepository.UpdateAsync(user, cancellationToken);
    }

    public async Task<UserProfileDto> GetProfileAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByIdWithRolesAsync(userId, cancellationToken)
            ?? throw ApiException.NotFound("User not found.");
        return _mapper.Map<UserProfileDto>(user);
    }

    public async Task<UserProfileDto> UpdateProfileAsync(Guid userId, UpdateProfileDto dto, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByIdAsync(userId, cancellationToken)
            ?? throw ApiException.NotFound("User not found.");

        user.FirstName = dto.FirstName;
        user.LastName = dto.LastName;
        user.Phone = dto.Phone;
        await _userRepository.UpdateAsync(user, cancellationToken);
        return await GetProfileAsync(userId, cancellationToken);
    }

    public async Task<string> UpdateAvatarAsync(Guid userId, IFormFile file, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByIdAsync(userId, cancellationToken)
            ?? throw ApiException.NotFound("User not found.");

        if (!string.IsNullOrEmpty(user.AvatarUrl))
            _uploadService.DeleteImage(user.AvatarUrl);

        user.AvatarUrl = await _uploadService.UploadImageAsync(file, "avatars", cancellationToken);
        await _userRepository.UpdateAsync(user, cancellationToken);
        return user.AvatarUrl;
    }
}
