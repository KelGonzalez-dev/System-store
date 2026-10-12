using HotelSaaS.API.Common;
using HotelSaaS.API.DTOs.Reservations;
using HotelSaaS.API.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelSaaS.API.Controllers;

[Authorize]
public class ReservationsController : BaseApiController
{
    private readonly IReservationService _reservationService;

    public ReservationsController(IReservationService reservationService) => _reservationService = reservationService;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] ReservationFilterDto filter, CancellationToken cancellationToken) =>
        OkResponse(await _reservationService.GetAllAsync(filter, cancellationToken));

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken) =>
        OkResponse(await _reservationService.GetByIdAsync(id, cancellationToken));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateReservationDto dto, CancellationToken cancellationToken) =>
        CreatedResponse(await _reservationService.CreateAsync(dto, CurrentUserId, CurrentUserId, cancellationToken));

    [HttpPost("{id:guid}/confirm")]
    [Authorize(Policy = PolicyNames.StaffOnly)]
    public async Task<IActionResult> Confirm(Guid id, CancellationToken cancellationToken) =>
        OkResponse(await _reservationService.ConfirmAsync(id, CurrentUserId, cancellationToken), "Reservation confirmed");

    [HttpPost("{id:guid}/cancel")]
    public async Task<IActionResult> Cancel(Guid id, [FromBody] CancelReservationDto dto, CancellationToken cancellationToken) =>
        OkResponse(await _reservationService.CancelAsync(id, dto, CurrentUserId, cancellationToken), "Reservation cancelled");

    [HttpPost("{id:guid}/check-in")]
    [Authorize(Policy = PolicyNames.StaffOnly)]
    public async Task<IActionResult> CheckIn(Guid id, CancellationToken cancellationToken) =>
        OkResponse(await _reservationService.CheckInAsync(id, CurrentUserId, cancellationToken), "Check-in completed");

    [HttpPost("{id:guid}/check-out")]
    [Authorize(Policy = PolicyNames.StaffOnly)]
    public async Task<IActionResult> CheckOut(Guid id, CancellationToken cancellationToken) =>
        OkResponse(await _reservationService.CheckOutAsync(id, CurrentUserId, cancellationToken), "Check-out completed");
}
