using Hotel.Application.Features.Rooms.Commands;
using Hotel.Application.Features.Rooms.DTOs;
using Hotel.Application.Features.Rooms.Queries;
using Hotel.Domain.Enums;
using Hotel.Shared.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hotel.Api.Controllers;

/// <summary>Room management</summary>
[Tags("Rooms")]
[Authorize]
public class RoomsController : BaseController
{
    /// <summary>Get all rooms with pagination and filters</summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<RoomDto>>), 200)]
    public async Task<IActionResult> GetAll(
        [FromQuery] string hotelId, [FromQuery] RoomStatus? status,
        [FromQuery] string? roomTypeId, [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var result = await Mediator.Send(new GetRoomsQuery(hotelId, status, roomTypeId, page, pageSize), ct);
        return OkResult(result);
    }

    /// <summary>Get room by ID</summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ApiResponse<RoomDto>), 200)]
    [ProducesResponseType(typeof(ApiResponse), 404)]
    public async Task<IActionResult> GetById(string id, CancellationToken ct)
        => OkResult(await Mediator.Send(new GetRoomByIdQuery(id), ct));

    /// <summary>Create a new room</summary>
    [HttpPost]
    [Authorize(Roles = "Admin,SuperAdmin")]
    [ProducesResponseType(typeof(ApiResponse<RoomDto>), 201)]
    public async Task<IActionResult> Create([FromBody] CreateRoomRequest req, CancellationToken ct)
    {
        var result = await Mediator.Send(new CreateRoomCommand(req.HotelId, req.RoomTypeId, req.Number, req.Floor, req.Notes), ct);
        return CreatedResult($"/api/v1/rooms/{result.Id}", result, "Room created.");
    }

    /// <summary>Update room details or status</summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "Staff,Admin,SuperAdmin")]
    [ProducesResponseType(typeof(ApiResponse<RoomDto>), 200)]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateRoomRequest req, CancellationToken ct)
    {
        var result = await Mediator.Send(new UpdateRoomCommand(id, req.Number, req.Floor, req.Status, req.Notes, req.MaintenanceReason, req.HousekeepingStatus), ct);
        return OkResult(result, "Room updated.");
    }

    /// <summary>Soft-delete a room</summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    [ProducesResponseType(204)]
    public async Task<IActionResult> Delete(string id, CancellationToken ct)
    {
        await Mediator.Send(new DeleteRoomCommand(id), ct);
        return NoContentResult();
    }
}