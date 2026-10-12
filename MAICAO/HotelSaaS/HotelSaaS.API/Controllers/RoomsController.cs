using HotelSaaS.API.Common;
using HotelSaaS.API.DTOs.Rooms;
using HotelSaaS.API.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelSaaS.API.Controllers;

[Authorize]
public class RoomsController : BaseApiController
{
    private readonly IRoomService _roomService;

    public RoomsController(IRoomService roomService) => _roomService = roomService;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] RoomFilterDto filter, CancellationToken cancellationToken) =>
        OkResponse(await _roomService.GetAllAsync(filter, cancellationToken));

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken) =>
        OkResponse(await _roomService.GetByIdAsync(id, cancellationToken));

    [HttpPost]
    [Authorize(Policy = PolicyNames.ManagerOrAbove)]
    public async Task<IActionResult> Create([FromBody] CreateRoomDto dto, CancellationToken cancellationToken) =>
        CreatedResponse(await _roomService.CreateAsync(dto, CurrentUserId, cancellationToken));

    [HttpPut("{id:guid}")]
    [Authorize(Policy = PolicyNames.ManagerOrAbove)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateRoomDto dto, CancellationToken cancellationToken) =>
        OkResponse(await _roomService.UpdateAsync(id, dto, CurrentUserId, cancellationToken));

    [HttpDelete("{id:guid}")]
    [Authorize(Policy = PolicyNames.AdminOrAbove)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await _roomService.DeleteAsync(id, CurrentUserId, cancellationToken);
        return OkResponse("Room deleted successfully");
    }

    [HttpGet("availability")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAvailability([FromQuery] AvailabilityQueryDto query, CancellationToken cancellationToken) =>
        OkResponse(await _roomService.GetAvailabilityAsync(query, cancellationToken));

    [HttpPost("{id:guid}/images")]
    [Authorize(Policy = PolicyNames.ManagerOrAbove)]
    public async Task<IActionResult> AddImages(Guid id, List<IFormFile> files, CancellationToken cancellationToken) =>
        OkResponse(await _roomService.AddImagesAsync(id, files, cancellationToken), "Images uploaded");
}
