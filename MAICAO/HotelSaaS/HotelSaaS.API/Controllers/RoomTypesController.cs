using AutoMapper;
using HotelSaaS.API.Common;
using HotelSaaS.API.Data;
using HotelSaaS.API.DTOs.Rooms;
using HotelSaaS.API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace HotelSaaS.API.Controllers;

[Authorize]
public class RoomTypesController : BaseApiController
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public RoomTypesController(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll([FromQuery] Guid? hotelId, CancellationToken cancellationToken)
    {
        var query = _context.RoomTypes.AsQueryable();
        if (hotelId.HasValue) query = query.Where(rt => rt.HotelId == hotelId.Value);
        var items = await query.ToListAsync(cancellationToken);
        return OkResponse(_mapper.Map<List<RoomTypeDto>>(items));
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var roomType = await _context.RoomTypes.FindAsync(new object[] { id }, cancellationToken)
            ?? throw ApiException.NotFound("Room type not found");
        return OkResponse(_mapper.Map<RoomTypeDto>(roomType));
    }

    [HttpPost]
    [Authorize(Policy = PolicyNames.ManagerOrAbove)]
    public async Task<IActionResult> Create([FromBody] CreateRoomTypeDto dto, CancellationToken cancellationToken)
    {
        var roomType = new RoomType
        {
            HotelId = dto.HotelId,
            Name = dto.Name,
            Description = dto.Description,
            Capacity = dto.Capacity,
            BasePrice = dto.BasePrice,
            Amenities = dto.Amenities != null ? JsonSerializer.Serialize(dto.Amenities) : null,
            CreatedBy = CurrentUserId
        };
        await _context.RoomTypes.AddAsync(roomType, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
        return CreatedResponse(_mapper.Map<RoomTypeDto>(roomType));
    }

    [HttpPut("{id:guid}")]
    [Authorize(Policy = PolicyNames.ManagerOrAbove)]
    public async Task<IActionResult> Update(Guid id, [FromBody] CreateRoomTypeDto dto, CancellationToken cancellationToken)
    {
        var roomType = await _context.RoomTypes.FindAsync(new object[] { id }, cancellationToken)
            ?? throw ApiException.NotFound("Room type not found");

        roomType.Name = dto.Name;
        roomType.Description = dto.Description;
        roomType.Capacity = dto.Capacity;
        roomType.BasePrice = dto.BasePrice;
        roomType.Amenities = dto.Amenities != null ? JsonSerializer.Serialize(dto.Amenities) : null;
        roomType.UpdatedBy = CurrentUserId;
        roomType.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
        return OkResponse(_mapper.Map<RoomTypeDto>(roomType));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Policy = PolicyNames.AdminOrAbove)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var roomType = await _context.RoomTypes.FindAsync(new object[] { id }, cancellationToken)
            ?? throw ApiException.NotFound("Room type not found");
        roomType.IsDeleted = true;
        roomType.DeletedBy = CurrentUserId;
        roomType.DeletedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
        return OkResponse("Room type deleted");
    }
}
