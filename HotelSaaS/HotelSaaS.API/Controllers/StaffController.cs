using HotelSaaS.API.Common;
using HotelSaaS.API.Data;
using HotelSaaS.API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelSaaS.API.Controllers;

[Authorize(Policy = PolicyNames.ManagerOrAbove)]
public class StaffController : BaseApiController
{
    private readonly ApplicationDbContext _context;

    public StaffController(ApplicationDbContext context) => _context = context;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] Guid? hotelId, CancellationToken cancellationToken)
    {
        var query = _context.Staff.Include(s => s.User).Include(s => s.Hotel).AsQueryable();
        if (hotelId.HasValue) query = query.Where(s => s.HotelId == hotelId.Value);
        return OkResponse(await query.ToListAsync(cancellationToken));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var staff = await _context.Staff.Include(s => s.User).Include(s => s.Hotel)
            .FirstOrDefaultAsync(s => s.Id == id, cancellationToken)
            ?? throw ApiException.NotFound("Staff member not found");
        return OkResponse(staff);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateStaffRequest dto, CancellationToken cancellationToken)
    {
        var staff = new Staff
        {
            HotelId = dto.HotelId,
            UserId = dto.UserId,
            Position = dto.Position,
            Department = dto.Department,
            HireDate = dto.HireDate,
            Salary = dto.Salary,
            CreatedBy = CurrentUserId
        };
        await _context.Staff.AddAsync(staff, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
        return CreatedResponse(staff);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] CreateStaffRequest dto, CancellationToken cancellationToken)
    {
        var staff = await _context.Staff.FindAsync(new object[] { id }, cancellationToken)
            ?? throw ApiException.NotFound("Staff member not found");

        staff.Position = dto.Position;
        staff.Department = dto.Department;
        staff.Salary = dto.Salary;
        staff.IsActive = dto.IsActive;
        staff.UpdatedBy = CurrentUserId;
        staff.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
        return OkResponse(staff);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var staff = await _context.Staff.FindAsync(new object[] { id }, cancellationToken)
            ?? throw ApiException.NotFound("Staff member not found");
        staff.IsDeleted = true;
        staff.DeletedBy = CurrentUserId;
        staff.DeletedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
        return OkResponse("Staff member deleted");
    }
}

public class CreateStaffRequest
{
    public Guid HotelId { get; set; }
    public Guid UserId { get; set; }
    public string Position { get; set; } = string.Empty;
    public string? Department { get; set; }
    public DateTime HireDate { get; set; } = DateTime.UtcNow;
    public decimal? Salary { get; set; }
    public bool IsActive { get; set; } = true;
}
