using AutoMapper;
using AutoMapper.QueryableExtensions;
using HotelSaaS.API.Common;
using HotelSaaS.API.Data;
using HotelSaaS.API.DTOs.Users;
using HotelSaaS.API.Entities;
using HotelSaaS.API.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelSaaS.API.Controllers;

[Authorize(Policy = PolicyNames.SuperAdminOnly)]
public class PermissionsController : BaseApiController
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public PermissionsController(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] DTOs.Common.PaginationQuery filter, CancellationToken cancellationToken)
    {
        var query = _context.Permissions.AsQueryable();
        if (!string.IsNullOrWhiteSpace(filter.Search))
            query = query.Where(p => p.Name.Contains(filter.Search) || p.Module.Contains(filter.Search));

        var projected = query.ProjectTo<PermissionDto>(_mapper.ConfigurationProvider);
        return OkResponse(await PaginationHelper.ToPagedAsync(projected, filter.Page, filter.PageSize, cancellationToken));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var permission = await _context.Permissions.FindAsync(new object[] { id }, cancellationToken)
            ?? throw ApiException.NotFound("Permission not found");
        return OkResponse(_mapper.Map<PermissionDto>(permission));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePermissionRequest dto, CancellationToken cancellationToken)
    {
        var permission = new Permission { Name = dto.Name, Description = dto.Description, Module = dto.Module };
        await _context.Permissions.AddAsync(permission, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
        return CreatedResponse(_mapper.Map<PermissionDto>(permission));
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] CreatePermissionRequest dto, CancellationToken cancellationToken)
    {
        var permission = await _context.Permissions.FindAsync(new object[] { id }, cancellationToken)
            ?? throw ApiException.NotFound("Permission not found");

        permission.Name = dto.Name;
        permission.Description = dto.Description;
        permission.Module = dto.Module;
        permission.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
        return OkResponse(_mapper.Map<PermissionDto>(permission));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var permission = await _context.Permissions.FindAsync(new object[] { id }, cancellationToken)
            ?? throw ApiException.NotFound("Permission not found");
        permission.IsDeleted = true;
        permission.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
        return OkResponse("Permission deleted");
    }
}

public class CreatePermissionRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Module { get; set; } = string.Empty;
}
