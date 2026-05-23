using AutoMapper;
using AutoMapper.QueryableExtensions;
using HotelSaaS.API.Common;
using HotelSaaS.API.Data;
using HotelSaaS.API.DTOs.Reservations;
using HotelSaaS.API.Entities;
using HotelSaaS.API.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelSaaS.API.Controllers;

[Authorize(Policy = PolicyNames.StaffOnly)]
public class GuestsController : BaseApiController
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GuestsController(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] DTOs.Common.PaginationQuery filter, CancellationToken cancellationToken)
    {
        var query = _context.Guests.AsQueryable();
        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            var s = filter.Search.ToLower();
            query = query.Where(g => g.FirstName.ToLower().Contains(s) || g.LastName.ToLower().Contains(s) || g.Email.Contains(s));
        }
        var projected = query.ProjectTo<GuestDto>(_mapper.ConfigurationProvider);
        return OkResponse(await PaginationHelper.ToPagedAsync(projected, filter.Page, filter.PageSize, cancellationToken));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var guest = await _context.Guests.FindAsync(new object[] { id }, cancellationToken)
            ?? throw ApiException.NotFound("Guest not found");
        return OkResponse(_mapper.Map<GuestDto>(guest));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateGuestDto dto, CancellationToken cancellationToken)
    {
        var guest = _mapper.Map<Guest>(dto);
        guest.CreatedBy = CurrentUserId;
        await _context.Guests.AddAsync(guest, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
        return CreatedResponse(_mapper.Map<GuestDto>(guest));
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] CreateGuestDto dto, CancellationToken cancellationToken)
    {
        var guest = await _context.Guests.FindAsync(new object[] { id }, cancellationToken)
            ?? throw ApiException.NotFound("Guest not found");

        _mapper.Map(dto, guest);
        guest.UpdatedBy = CurrentUserId;
        guest.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
        return OkResponse(_mapper.Map<GuestDto>(guest));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Policy = PolicyNames.ManagerOrAbove)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var guest = await _context.Guests.FindAsync(new object[] { id }, cancellationToken)
            ?? throw ApiException.NotFound("Guest not found");
        guest.IsDeleted = true;
        guest.DeletedBy = CurrentUserId;
        guest.DeletedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
        return OkResponse("Guest deleted");
    }

    [HttpGet("{id:guid}/history")]
    public async Task<IActionResult> GetHistory(Guid id, CancellationToken cancellationToken)
    {
        var reservations = await _context.Reservations
            .Include(r => r.Hotel).Include(r => r.Room)
            .Where(r => r.GuestId == id && !r.IsDeleted)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync(cancellationToken);
        return OkResponse(_mapper.Map<List<ReservationDto>>(reservations));
    }
}
