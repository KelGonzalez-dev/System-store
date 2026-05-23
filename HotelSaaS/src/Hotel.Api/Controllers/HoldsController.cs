using Hotel.Application.Features.Holds.Commands;
using Hotel.Application.Features.Holds.DTOs;
using Hotel.Shared.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hotel.Api.Controllers;

/// <summary>Temporary room holds</summary>
[Tags("Holds")]
[Authorize]
public class HoldsController : BaseController
{
    /// <summary>Create a temporary hold on a room</summary>
    [HttpPost]
    [Authorize(Roles = "Staff,Admin,SuperAdmin")]
    [ProducesResponseType(typeof(ApiResponse<HoldDto>), 201)]
    [ProducesResponseType(typeof(ApiResponse), 409)]
    public async Task<IActionResult> Create([FromBody] CreateHoldRequest req, CancellationToken ct)
    {
        var result = await Mediator.Send(new CreateHoldCommand(
            req.HotelId, req.RoomId, req.GuestId,
            req.CheckInDate, req.CheckOutDate, req.ExpiryMinutes, req.Notes), ct);
        return CreatedResult($"/api/v1/holds/{result.Id}", result, "Hold created.");
    }

    /// <summary>Release (cancel) an active hold</summary>
    [HttpPost("{id}/release")]
    [Authorize(Roles = "Staff,Admin,SuperAdmin")]
    [ProducesResponseType(typeof(ApiResponse<HoldDto>), 200)]
    [ProducesResponseType(typeof(ApiResponse), 404)]
    public async Task<IActionResult> Release(string id, CancellationToken ct)
    {
        var result = await Mediator.Send(new ReleaseHoldCommand(id), ct);
        return OkResult(result, "Hold released.");
    }

    /// <summary>Convert hold into a confirmed reservation</summary>
    [HttpPost("{id}/convert")]
    [Authorize(Roles = "Staff,Admin,SuperAdmin")]
    [ProducesResponseType(typeof(ApiResponse<HoldDto>), 200)]
    [ProducesResponseType(typeof(ApiResponse), 404)]
    [ProducesResponseType(typeof(ApiResponse), 409)]
    public async Task<IActionResult> Convert(string id, [FromBody] ConvertHoldToReservationRequest req, CancellationToken ct)
    {
        var result = await Mediator.Send(new ConvertHoldCommand(
            id, req.GuestId, req.Adults, req.Children,
            req.BaseAmount, req.TaxAmount, req.TotalAmount,
            req.Currency, req.Source, req.SpecialRequests), ct);
        return OkResult(result, "Hold converted to reservation.");
    }
}