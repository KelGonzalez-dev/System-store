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

[Authorize(Policy = PolicyNames.AdminOrAbove)]
public class RolesController : BaseApiController
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public RolesController(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] DTOs.Common.PaginationQuery filter, CancellationToken cancellationToken)
    {
        var query = _context.Roles.Include(r => r.RolePermissions).ThenInclude(rp => rp.Permission).AsQueryable();
        if (!string.IsNullOrWhiteSpace(filter.Search))
            query = query.Where(r => r.Name.Contains(filter.Search));

        var projected = query.ProjectTo<RoleDto>(_mapper.ConfigurationProvider);
        return OkResponse(await PaginationHelper.ToPagedAsync(projected, filter.Page, filter.PageSize, cancellationToken));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var role = await _context.Roles.Include(r => r.RolePermissions).ThenInclude(rp => rp.Permission)
            .FirstOrDefaultAsync(r => r.Id == id, cancellationToken)
            ?? throw ApiException.NotFound("Role not found");
        return OkResponse(_mapper.Map<RoleDto>(role));
    }

    [HttpPost]
    [Authorize(Policy = PolicyNames.SuperAdminOnly)]
    public async Task<IActionResult> Create([FromBody] CreateRoleRequest dto, CancellationToken cancellationToken)
    {
        var role = new Role { Name = dto.Name, Description = dto.Description };
        await _context.Roles.AddAsync(role, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        foreach (var permId in dto.PermissionIds)
            _context.RolePermissions.Add(new RolePermission { RoleId = role.Id, PermissionId = permId });

        await _context.SaveChangesAsync(cancellationToken);
        return CreatedResponse(_mapper.Map<RoleDto>(role));
    }

    [HttpPut("{id:guid}")]
    [Authorize(Policy = PolicyNames.SuperAdminOnly)]
    public async Task<IActionResult> Update(Guid id, [FromBody] CreateRoleRequest dto, CancellationToken cancellationToken)
    {
        var role = await _context.Roles.FindAsync(new object[] { id }, cancellationToken)
            ?? throw ApiException.NotFound("Role not found");

        role.Name = dto.Name;
        role.Description = dto.Description;
        role.UpdatedAt = DateTime.UtcNow;

        var existing = await _context.RolePermissions.Where(rp => rp.RoleId == id).ToListAsync(cancellationToken);
        _context.RolePermissions.RemoveRange(existing);
        foreach (var permId in dto.PermissionIds)
            _context.RolePermissions.Add(new RolePermission { RoleId = id, PermissionId = permId });

        await _context.SaveChangesAsync(cancellationToken);
        return OkResponse(_mapper.Map<RoleDto>(role));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Policy = PolicyNames.SuperAdminOnly)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var role = await _context.Roles.FindAsync(new object[] { id }, cancellationToken)
            ?? throw ApiException.NotFound("Role not found");
        role.IsDeleted = true;
        role.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
        return OkResponse("Role deleted");
    }
}

public class CreateRoleRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public List<Guid> PermissionIds { get; set; } = new();
}
