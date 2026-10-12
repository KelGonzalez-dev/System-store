using System.Text.Json;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using HotelSaaS.API.Common;
using HotelSaaS.API.DTOs.Hotels;
using HotelSaaS.API.Entities;
using HotelSaaS.API.Helpers;
using HotelSaaS.API.Interfaces.Repositories;
using HotelSaaS.API.Interfaces.Services;

namespace HotelSaaS.API.Services;

public class HotelService : IHotelService
{
    private readonly IHotelRepository _hotelRepository;
    private readonly IMapper _mapper;
    private readonly IUploadService _uploadService;

    public HotelService(IHotelRepository hotelRepository, IMapper mapper, IUploadService uploadService)
    {
        _hotelRepository = hotelRepository;
        _mapper = mapper;
        _uploadService = uploadService;
    }

    public async Task<PagedResponse<HotelDto>> GetAllAsync(HotelFilterDto filter, CancellationToken cancellationToken = default)
    {
        var query = _hotelRepository.Query();

        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            var search = filter.Search.ToLower();
            query = query.Where(h =>
                h.Name.ToLower().Contains(search) ||
                h.City.ToLower().Contains(search) ||
                h.Country.ToLower().Contains(search));
        }

        if (!string.IsNullOrWhiteSpace(filter.City))
            query = query.Where(h => h.City.ToLower() == filter.City.ToLower());

        if (!string.IsNullOrWhiteSpace(filter.Country))
            query = query.Where(h => h.Country.ToLower() == filter.Country.ToLower());

        if (filter.IsActive.HasValue)
            query = query.Where(h => h.IsActive == filter.IsActive.Value);

        query = string.IsNullOrWhiteSpace(filter.SortBy)
            ? query.OrderByDescending(h => h.CreatedAt)
            : PaginationHelper.ApplySorting(query, filter.SortBy, filter.SortDescending);

        var projected = query.ProjectTo<HotelDto>(_mapper.ConfigurationProvider);
        return await PaginationHelper.ToPagedAsync(projected, filter.Page, filter.PageSize, cancellationToken);
    }

    public async Task<HotelDto> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var hotel = await _hotelRepository.GetByIdAsync(id, cancellationToken)
            ?? throw ApiException.NotFound("Hotel not found.");
        return _mapper.Map<HotelDto>(hotel);
    }

    public async Task<HotelDto> CreateAsync(CreateHotelDto dto, Guid createdBy, CancellationToken cancellationToken = default)
    {
        var hotel = _mapper.Map<Hotel>(dto);
        hotel.CreatedBy = createdBy;
        await _hotelRepository.AddAsync(hotel, cancellationToken);
        return _mapper.Map<HotelDto>(hotel);
    }

    public async Task<HotelDto> UpdateAsync(Guid id, UpdateHotelDto dto, Guid updatedBy, CancellationToken cancellationToken = default)
    {
        var hotel = await _hotelRepository.GetByIdAsync(id, cancellationToken)
            ?? throw ApiException.NotFound("Hotel not found.");

        _mapper.Map(dto, hotel);
        hotel.IsActive = dto.IsActive;
        hotel.UpdatedBy = updatedBy;
        await _hotelRepository.UpdateAsync(hotel, cancellationToken);
        return _mapper.Map<HotelDto>(hotel);
    }

    public async Task DeleteAsync(Guid id, Guid deletedBy, CancellationToken cancellationToken = default)
    {
        var hotel = await _hotelRepository.GetByIdAsync(id, cancellationToken)
            ?? throw ApiException.NotFound("Hotel not found.");
        await _hotelRepository.SoftDeleteAsync(hotel, deletedBy, cancellationToken);
    }

    public async Task<List<string>> AddImagesAsync(Guid id, List<IFormFile> files, CancellationToken cancellationToken = default)
    {
        var hotel = await _hotelRepository.GetByIdAsync(id, cancellationToken)
            ?? throw ApiException.NotFound("Hotel not found.");

        var urls = await _uploadService.UploadImagesAsync(files, "hotels", cancellationToken);
        var existing = string.IsNullOrEmpty(hotel.Images)
            ? new List<string>()
            : JsonSerializer.Deserialize<List<string>>(hotel.Images) ?? new List<string>();

        existing.AddRange(urls);
        hotel.Images = JsonSerializer.Serialize(existing);
        await _hotelRepository.UpdateAsync(hotel, cancellationToken);
        return existing;
    }
}
