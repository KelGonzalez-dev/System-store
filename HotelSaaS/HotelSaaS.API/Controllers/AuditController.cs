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
public class AuditController : BaseApiController
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public AuditController(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] AuditFilterDto filter, CancellationToken cancellationToken)
    {
        var query = _context.AuditLogs.Include(a => a.User).AsQueryable();

        if (filter.UserId.HasValue)
            query = query.Where(a => a.UserId == filter.UserId.Value);

        if (!string.IsNullOrWhiteSpace(filter.EntityName))
            query = query.Where(a => a.EntityName == filter.EntityName);

        if (filter.FromDate.HasValue)
            query = query.Where(a => a.CreatedAt >= filter.FromDate.Value);

        if (filter.ToDate.HasValue)
            query = query.Where(a => a.CreatedAt <= filter.ToDate.Value);

        query = query.OrderByDescending(a => a.CreatedAt);
        var projected = query.ProjectTo<AuditLogDto>(_mapper.ConfigurationProvider);
        return OkResponse(await PaginationHelper.ToPagedAsync(projected, filter.Page, filter.PageSize, cancellationToken));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var log = await _context.AuditLogs.Include(a => a.User)
            .FirstOrDefaultAsync(a => a.Id == id, cancellationToken)
            ?? throw ApiException.NotFound("Audit log not found");
        return OkResponse(_mapper.Map<AuditLogDto>(log));
    }

    [HttpGet("user/{userId:guid}")]
    public async Task<IActionResult> GetByUser(Guid userId, [FromQuery] DTOs.Common.PaginationQuery filter, CancellationToken cancellationToken)
    {
        var query = _context.AuditLogs.Include(a => a.User)
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.CreatedAt);

        var projected = query.ProjectTo<AuditLogDto>(_mapper.ConfigurationProvider);
        return OkResponse(await PaginationHelper.ToPagedAsync(projected, filter.Page, filter.PageSize, cancellationToken));
    }
}

public class AuditFilterDto : DTOs.Common.PaginationQuery
{
    public Guid? UserId { get; set; }
    public string? EntityName { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
}

public static class AuditHelper
{
    public static async Task LogAsync(
        ApplicationDbContext context,
        Guid? userId,
        string action,
        string entityName,
        Guid? entityId,
        string? oldValues = null,
        string? newValues = null,
        string? ipAddress = null,
        string? userAgent = null)
    {
        context.AuditLogs.Add(new AuditLog
        {
            UserId = userId,
            Action = action,
            EntityName = entityName,
            EntityId = entityId,
            OldValues = oldValues,
            NewValues = newValues,
            IpAddress = ipAddress,
            UserAgent = userAgent
        });
        await context.SaveChangesAsync();
    }
}
