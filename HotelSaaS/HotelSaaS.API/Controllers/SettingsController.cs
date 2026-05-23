using HotelSaaS.API.Common;
using HotelSaaS.API.Data;
using HotelSaaS.API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelSaaS.API.Controllers;

[Authorize(Policy = PolicyNames.AdminOrAbove)]
public class SettingsController : BaseApiController
{
    private readonly ApplicationDbContext _context;

    public SettingsController(ApplicationDbContext context) => _context = context;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] Guid? hotelId, [FromQuery] string? category, CancellationToken cancellationToken)
    {
        var query = _context.Settings.AsQueryable();
        if (hotelId.HasValue) query = query.Where(s => s.HotelId == hotelId || s.HotelId == null);
        if (!string.IsNullOrWhiteSpace(category)) query = query.Where(s => s.Category == category);
        return OkResponse(await query.ToListAsync(cancellationToken));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var setting = await _context.Settings.FindAsync(new object[] { id }, cancellationToken)
            ?? throw ApiException.NotFound("Setting not found");
        return OkResponse(setting);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateSettingRequest dto, CancellationToken cancellationToken)
    {
        var setting = new Setting
        {
            Key = dto.Key,
            Value = dto.Value,
            Description = dto.Description,
            Category = dto.Category,
            HotelId = dto.HotelId
        };
        await _context.Settings.AddAsync(setting, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
        return CreatedResponse(setting);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] CreateSettingRequest dto, CancellationToken cancellationToken)
    {
        var setting = await _context.Settings.FindAsync(new object[] { id }, cancellationToken)
            ?? throw ApiException.NotFound("Setting not found");

        setting.Key = dto.Key;
        setting.Value = dto.Value;
        setting.Description = dto.Description;
        setting.Category = dto.Category;
        setting.HotelId = dto.HotelId;
        setting.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
        return OkResponse(setting);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var setting = await _context.Settings.FindAsync(new object[] { id }, cancellationToken)
            ?? throw ApiException.NotFound("Setting not found");
        _context.Settings.Remove(setting);
        await _context.SaveChangesAsync(cancellationToken);
        return OkResponse("Setting deleted");
    }
}

public class CreateSettingRequest
{
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Category { get; set; } = "General";
    public Guid? HotelId { get; set; }
}
