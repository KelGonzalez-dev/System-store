using Hotel.Application.Features.Reservations.Commands;
using Hotel.Application.Features.Reservations.DTOs;
using Hotel.Application.Features.Reservations.Queries;
using Hotel.Domain.Enums;
using Hotel.Shared.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hotel.Api.Controllers;

/// <summary>Reservation management</summary>
[Tags("Reservations")]
[Authorize]
public class ReservationsController : BaseController
{
    /// <summary>Get all reservations (paginated, filterable)</summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<ReservationDto>>), 200)]
    public async Task<IActionResult> GetAll(
        [FromQuery] string hotelId,
        [FromQuery] ReservationStatus? status,
        [FromQuery] DateOnly? from,
        [FromQuery] DateOnly? to,
        [FromQuery] string? guestId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken ct = default)
    {
        var result = await Mediator.Send(
            new GetReservationsQuery(hotelId, status, from, to, guestId, page, pageSize), ct);
        return OkResult(result);
    }

    /// <summary>Get reservation by ID</summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ApiResponse<ReservationDto>), 200)]
    [ProducesResponseType(typeof(ApiResponse), 404)]
    public async Task<IActionResult> GetById(string id, CancellationToken ct)
    {
        var result = await Mediator.Send(new GetReservationByIdQuery(id), ct);
        return OkResult(result);
    }

    /// <summary>Check room availability</summary>
    [HttpGet("availability")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<AvailabilityResponse>>), 200)]
    public async Task<IActionResult> GetAvailability(
        [FromQuery] string hotelId,
        [FromQuery] DateOnly checkIn,
        [FromQuery] DateOnly checkOut,
        [FromQuery] int adults = 1,
        [FromQuery] string? roomTypeId = null,
        CancellationToken ct = default)
    {
        var result = await Mediator.Send(new GetAvailabilityQuery(hotelId, checkIn, checkOut, adults, roomTypeId), ct);
        return OkResult(result);
    }

    /// <summary>Create a new reservation — delegates to booking.fn_create_reservation()</summary>
    [HttpPost]
    [Authorize(Roles = "Staff,Admin,SuperAdmin")]
    [ProducesResponseType(typeof(ApiResponse<ReservationDto>), 201)]
    [ProducesResponseType(typeof(ApiResponse), 400)]
    [ProducesResponseType(typeof(ApiResponse), 409)]
    public async Task<IActionResult> Create([FromBody] CreateReservationRequest req, CancellationToken ct)
    {
        var result = await Mediator.Send(new CreateReservationCommand(
            req.HotelId, req.RoomId, req.GuestId, null,
            req.CheckInDate, req.CheckOutDate, req.Adults, req.Children,
            req.BaseAmount, req.TaxAmount, req.TotalAmount, req.Currency,
            req.Source, req.SpecialRequests, req.Notes), ct);
        return CreatedResult($"/api/v1/reservations/{result.Id}", result, "Reservation created.");
    }

    /// <summary>Cancel a reservation</summary>
    [HttpPost("{id}/cancel")]
    [Authorize(Roles = "Staff,Admin,SuperAdmin")]
    [ProducesResponseType(typeof(ApiResponse<ReservationDto>), 200)]
    [ProducesResponseType(typeof(ApiResponse), 404)]
    [ProducesResponseType(typeof(ApiResponse), 409)]
    public async Task<IActionResult> Cancel(string id, [FromBody] CancelReservationRequest req, CancellationToken ct)
    {
        var result = await Mediator.Send(new CancelReservationCommand(id, req.Reason), ct);
        return OkResult(result, "Reservation cancelled.");
    }

    /// <summary>Check in guest</summary>
    [HttpPost("{id}/check-in")]
    [Authorize(Roles = "Staff,Admin,SuperAdmin")]
    [ProducesResponseType(typeof(ApiResponse<ReservationDto>), 200)]
    [ProducesResponseType(typeof(ApiResponse), 404)]
    [ProducesResponseType(typeof(ApiResponse), 409)]
    public async Task<IActionResult> CheckIn(string id, [FromBody] CheckInRequest req, CancellationToken ct)
    {
        var result = await Mediator.Send(new CheckInCommand(id, req.Notes), ct);
        return OkResult(result, "Check-in completed.");
    }

    /// <summary>Check out guest</summary>
    [HttpPost("{id}/check-out")]
    [Authorize(Roles = "Staff,Admin,SuperAdmin")]
    [ProducesResponseType(typeof(ApiResponse<ReservationDto>), 200)]
    [ProducesResponseType(typeof(ApiResponse), 404)]
    [ProducesResponseType(typeof(ApiResponse), 409)]
    public async Task<IActionResult> CheckOut(string id, [FromBody] CheckOutRequest req, CancellationToken ct)
    {
        var result = await Mediator.Send(new CheckOutCommand(id, req.Notes), ct);
        return OkResult(result, "Check-out completed.");
    }
}