using System.Text.Json;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using HotelSaaS.API.Common;
using HotelSaaS.API.Data;
using HotelSaaS.API.DTOs.Rooms;
using HotelSaaS.API.Entities;
using HotelSaaS.API.Helpers;
using HotelSaaS.API.Interfaces.Repositories;
using HotelSaaS.API.Interfaces.Services;
using Microsoft.EntityFrameworkCore;

namespace HotelSaaS.API.Services;

public class RoomService : IRoomService
{
    private readonly IRoomRepository _roomRepository;
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IUploadService _uploadService;

    public RoomService(IRoomRepository roomRepository, ApplicationDbContext context, IMapper mapper, IUploadService uploadService)
    {
        _roomRepository = roomRepository;
        _context = context;
        _mapper = mapper;
        _uploadService = uploadService;
    }

    public async Task<PagedResponse<RoomDto>> GetAllAsync(RoomFilterDto filter, CancellationToken cancellationToken = default)
    {
        var query = _roomRepository.Query();

        if (filter.HotelId.HasValue)
            query = query.Where(r => r.HotelId == filter.HotelId.Value);

        if (filter.RoomTypeId.HasValue)
            query = query.Where(r => r.RoomTypeId == filter.RoomTypeId.Value);

        if (filter.Status.HasValue)
            query = query.Where(r => r.Status == filter.Status.Value);

        if (filter.IsActive.HasValue)
            query = query.Where(r => r.IsActive == filter.IsActive.Value);

        if (!string.IsNullOrWhiteSpace(filter.Search))
            query = query.Where(r => r.Number.Contains(filter.Search));

        query = string.IsNullOrWhiteSpace(filter.SortBy)
            ? query.OrderBy(r => r.Number)
            : PaginationHelper.ApplySorting(query, filter.SortBy, filter.SortDescending);

        var projected = query.ProjectTo<RoomDto>(_mapper.ConfigurationProvider);
        return await PaginationHelper.ToPagedAsync(projected, filter.Page, filter.PageSize, cancellationToken);
    }

    public async Task<RoomDto> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var room = await _roomRepository.GetByIdAsync(id, cancellationToken)
            ?? throw ApiException.NotFound("Room not found.");
        return _mapper.Map<RoomDto>(room);
    }

    public async Task<RoomDto> CreateAsync(CreateRoomDto dto, Guid createdBy, CancellationToken cancellationToken = default)
    {
        var exists = await _context.Rooms.AnyAsync(r =>
            r.HotelId == dto.HotelId && r.Number == dto.Number && !r.IsDeleted, cancellationToken);

        if (exists)
            throw ApiException.Conflict("Room number already exists in this hotel.");

        var room = new Room
        {
            HotelId = dto.HotelId,
            RoomTypeId = dto.RoomTypeId,
            Number = dto.Number,
            Floor = dto.Floor,
            PricePerNight = dto.PricePerNight,
            Description = dto.Description,
            CreatedBy = createdBy
        };

        await _roomRepository.AddAsync(room, cancellationToken);
        return await GetByIdAsync(room.Id, cancellationToken);
    }

    public async Task<RoomDto> UpdateAsync(Guid id, UpdateRoomDto dto, Guid updatedBy, CancellationToken cancellationToken = default)
    {
        var room = await _roomRepository.GetByIdAsync(id, cancellationToken)
            ?? throw ApiException.NotFound("Room not found.");

        room.RoomTypeId = dto.RoomTypeId;
        room.Number = dto.Number;
        room.Floor = dto.Floor;
        room.Status = dto.Status;
        room.PricePerNight = dto.PricePerNight;
        room.Description = dto.Description;
        room.IsActive = dto.IsActive;
        room.UpdatedBy = updatedBy;

        await _roomRepository.UpdateAsync(room, cancellationToken);
        return await GetByIdAsync(id, cancellationToken);
    }

    public async Task DeleteAsync(Guid id, Guid deletedBy, CancellationToken cancellationToken = default)
    {
        var room = await _roomRepository.GetByIdAsync(id, cancellationToken)
            ?? throw ApiException.NotFound("Room not found.");
        await _roomRepository.SoftDeleteAsync(room, deletedBy, cancellationToken);
    }

    public async Task<List<RoomAvailabilityDto>> GetAvailabilityAsync(AvailabilityQueryDto query, CancellationToken cancellationToken = default)
    {
        var rooms = await _roomRepository.Query()
            .Where(r => r.HotelId == query.HotelId && r.IsActive && r.Status != RoomStatus.Maintenance)
            .Where(r => !query.RoomTypeId.HasValue || r.RoomTypeId == query.RoomTypeId.Value)
            .ToListAsync(cancellationToken);

        var result = new List<RoomAvailabilityDto>();
        foreach (var room in rooms)
        {
            var isAvailable = await _roomRepository.IsAvailableAsync(room.Id, query.CheckIn, query.CheckOut, cancellationToken: cancellationToken);
            result.Add(new RoomAvailabilityDto
            {
                RoomId = room.Id,
                Number = room.Number,
                IsAvailable = isAvailable,
                PricePerNight = room.PricePerNight
            });
        }
        return result;
    }

    public async Task<List<string>> AddImagesAsync(Guid id, List<IFormFile> files, CancellationToken cancellationToken = default)
    {
        var room = await _roomRepository.GetByIdAsync(id, cancellationToken)
            ?? throw ApiException.NotFound("Room not found.");

        var urls = await _uploadService.UploadImagesAsync(files, "rooms", cancellationToken);
        var existing = string.IsNullOrEmpty(room.Images)
            ? new List<string>()
            : JsonSerializer.Deserialize<List<string>>(room.Images) ?? new List<string>();

        existing.AddRange(urls);
        room.Images = JsonSerializer.Serialize(existing);
        await _roomRepository.UpdateAsync(room, cancellationToken);
        return existing;
    }
}
