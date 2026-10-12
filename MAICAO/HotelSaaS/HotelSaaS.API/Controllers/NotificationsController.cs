using HotelSaaS.API.Common;
using HotelSaaS.API.Data;
using HotelSaaS.API.Entities;
using HotelSaaS.API.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelSaaS.API.Controllers;

[Authorize]
public class NotificationsController : BaseApiController
{
    private readonly ApplicationDbContext _context;

    public NotificationsController(ApplicationDbContext context) => _context = context;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] DTOs.Common.PaginationQuery filter, [FromQuery] bool? unreadOnly, CancellationToken cancellationToken)
    {
        var query = _context.Notifications.Where(n => n.UserId == CurrentUserId);
        if (unreadOnly == true) query = query.Where(n => !n.IsRead);

        var paged = await PaginationHelper.ToPagedAsync(
            query.OrderByDescending(n => n.CreatedAt), filter.Page, filter.PageSize, cancellationToken);
        return OkResponse(paged);
    }

    [HttpPatch("{id:guid}/read")]
    public async Task<IActionResult> MarkAsRead(Guid id, CancellationToken cancellationToken)
    {
        var notification = await _context.Notifications
            .FirstOrDefaultAsync(n => n.Id == id && n.UserId == CurrentUserId, cancellationToken)
            ?? throw ApiException.NotFound("Notification not found");

        notification.IsRead = true;
        notification.ReadAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
        return OkResponse("Notification marked as read");
    }

    [HttpPatch("read-all")]
    public async Task<IActionResult> MarkAllAsRead(CancellationToken cancellationToken)
    {
        await _context.Notifications
            .Where(n => n.UserId == CurrentUserId && !n.IsRead)
            .ExecuteUpdateAsync(s => s
                .SetProperty(n => n.IsRead, true)
                .SetProperty(n => n.ReadAt, DateTime.UtcNow), cancellationToken);
        return OkResponse("All notifications marked as read");
    }

    [HttpPost]
    [Authorize(Policy = PolicyNames.ManagerOrAbove)]
    public async Task<IActionResult> Create([FromBody] CreateNotificationRequest dto, CancellationToken cancellationToken)
    {
        var notification = new Notification
        {
            UserId = dto.UserId,
            Title = dto.Title,
            Message = dto.Message,
            Type = dto.Type,
            Link = dto.Link
        };
        await _context.Notifications.AddAsync(notification, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
        return CreatedResponse(notification);
    }
}

public class CreateNotificationRequest
{
    public Guid UserId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public NotificationType Type { get; set; } = NotificationType.Info;
    public string? Link { get; set; }
}
