using HotelSaaS.API.Common;
using HotelSaaS.API.Data;
using HotelSaaS.API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelSaaS.API.Controllers;

[Authorize(Policy = PolicyNames.StaffOnly)]
public class MaintenanceController : BaseApiController
{
    private readonly ApplicationDbContext _context;

    public MaintenanceController(ApplicationDbContext context) => _context = context;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] Guid? roomId, [FromQuery] MaintenanceStatus? status, CancellationToken cancellationToken)
    {
        var query = _context.Maintenances.Include(m => m.Room).AsQueryable();
        if (roomId.HasValue) query = query.Where(m => m.RoomId == roomId.Value);
        if (status.HasValue) query = query.Where(m => m.Status == status.Value);
        return OkResponse(await query.OrderByDescending(m => m.ScheduledDate).ToListAsync(cancellationToken));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var maintenance = await _context.Maintenances.Include(m => m.Room)
            .FirstOrDefaultAsync(m => m.Id == id, cancellationToken)
            ?? throw ApiException.NotFound("Maintenance record not found");
        return OkResponse(maintenance);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateMaintenanceRequest dto, CancellationToken cancellationToken)
    {
        var maintenance = new Maintenance
        {
            RoomId = dto.RoomId,
            Title = dto.Title,
            Description = dto.Description,
            ScheduledDate = dto.ScheduledDate,
            AssignedTo = dto.AssignedTo,
            Cost = dto.Cost,
            CreatedBy = CurrentUserId
        };
        await _context.Maintenances.AddAsync(maintenance, cancellationToken);

        var room = await _context.Rooms.FindAsync(new object[] { dto.RoomId }, cancellationToken);
        if (room != null) room.Status = RoomStatus.Maintenance;

        await _context.SaveChangesAsync(cancellationToken);
        return CreatedResponse(maintenance);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] CreateMaintenanceRequest dto, CancellationToken cancellationToken)
    {
        var maintenance = await _context.Maintenances.FindAsync(new object[] { id }, cancellationToken)
            ?? throw ApiException.NotFound("Maintenance record not found");

        maintenance.Title = dto.Title;
        maintenance.Description = dto.Description;
        maintenance.ScheduledDate = dto.ScheduledDate;
        maintenance.AssignedTo = dto.AssignedTo;
        maintenance.Cost = dto.Cost;
        maintenance.UpdatedBy = CurrentUserId;
        maintenance.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
        return OkResponse(maintenance);
    }

    [HttpPost("{id:guid}/complete")]
    public async Task<IActionResult> Complete(Guid id, CancellationToken cancellationToken)
    {
        var maintenance = await _context.Maintenances.Include(m => m.Room)
            .FirstOrDefaultAsync(m => m.Id == id, cancellationToken)
            ?? throw ApiException.NotFound("Maintenance record not found");

        maintenance.Status = MaintenanceStatus.Completed;
        maintenance.CompletedDate = DateTime.UtcNow;
        maintenance.UpdatedBy = CurrentUserId;

        if (maintenance.Room != null)
            maintenance.Room.Status = RoomStatus.Available;

        await _context.SaveChangesAsync(cancellationToken);
        return OkResponse(maintenance, "Maintenance completed");
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Policy = PolicyNames.ManagerOrAbove)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var maintenance = await _context.Maintenances.FindAsync(new object[] { id }, cancellationToken)
            ?? throw ApiException.NotFound("Maintenance record not found");
        maintenance.IsDeleted = true;
        maintenance.DeletedBy = CurrentUserId;
        maintenance.DeletedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
        return OkResponse("Maintenance record deleted");
    }
}

public class CreateMaintenanceRequest
{
    public Guid RoomId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime ScheduledDate { get; set; }
    public string? AssignedTo { get; set; }
    public decimal? Cost { get; set; }
}
