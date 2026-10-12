using Hotel.Application.Features.Guests.Commands;
using Hotel.Application.Features.Guests.DTOs;
using Hotel.Application.Features.Guests.Queries;
using Hotel.Application.Features.Reservations.DTOs;
using Hotel.Application.Features.Reservations.Queries;
using Hotel.Shared.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hotel.Api.Controllers;

/// <summary>Guest management</summary>
[Tags("Guests")]
[Authorize]
public class GuestsController : BaseController
{
    /// <summary>Search guests with optional full-text, document or email filters</summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<GuestDto>>), 200)]
    public async Task<IActionResult> Search(
        [FromQuery] string hotelId, [FromQuery] string? query,
        [FromQuery] string? documentNumber, [FromQuery] string? email,
        [FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var result = await Mediator.Send(new SearchGuestsQuery(hotelId, query, documentNumber, email, page, pageSize), ct);
        return OkResult(result);
    }

    /// <summary>Get guest by ID</summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ApiResponse<GuestDto>), 200)]
    [ProducesResponseType(typeof(ApiResponse), 404)]
    public async Task<IActionResult> GetById(string id, CancellationToken ct)
        => OkResult(await Mediator.Send(new GetGuestByIdQuery(id), ct));

    /// <summary>Get guest reservation history</summary>
    [HttpGet("{id}/reservations")]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<ReservationDto>>), 200)]
    public async Task<IActionResult> GetReservations(string id,
        [FromQuery] string hotelId, [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var result = await Mediator.Send(new GetReservationsQuery(hotelId, null, null, null, id, page, pageSize), ct);
        return OkResult(result);
    }

    /// <summary>Register a new guest</summary>
    [HttpPost]
    [Authorize(Roles = "Staff,Admin,SuperAdmin")]
    [ProducesResponseType(typeof(ApiResponse<GuestDto>), 201)]
    public async Task<IActionResult> Create([FromBody] CreateGuestRequest req, CancellationToken ct)
    {
        var result = await Mediator.Send(new CreateGuestCommand(
            req.HotelId, req.FirstName, req.LastName, req.Email, req.Phone,
            req.CountryCode, req.DocumentType, req.DocumentNumber, req.DateOfBirth,
            req.Nationality, req.Address, req.City, req.Notes, req.MarketingOptIn), ct);
        return CreatedResult($"/api/v1/guests/{result.Id}", result, "Guest created.");
    }

    /// <summary>Update guest information</summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "Staff,Admin,SuperAdmin")]
    [ProducesResponseType(typeof(ApiResponse<GuestDto>), 200)]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateGuestRequest req, CancellationToken ct)
    {
        var result = await Mediator.Send(new UpdateGuestCommand(
            id, req.FirstName, req.LastName, req.Email, req.Phone,
            req.CountryCode, req.DocumentType, req.DocumentNumber, req.DateOfBirth,
            req.Nationality, req.Address, req.City, req.Notes, req.MarketingOptIn), ct);
        return OkResult(result, "Guest updated.");
    }
}