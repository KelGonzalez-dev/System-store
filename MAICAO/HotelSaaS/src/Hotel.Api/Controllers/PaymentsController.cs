using Hotel.Application.Features.Payments.Commands;
using Hotel.Application.Features.Payments.DTOs;
using Hotel.Application.Features.Payments.Queries;
using Hotel.Domain.Enums;
using Hotel.Shared.Constants;
using Hotel.Shared.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hotel.Api.Controllers;

/// <summary>Payment processing</summary>
[Tags("Payments")]
[Authorize]
public class PaymentsController : BaseController
{
    /// <summary>Get payments for a reservation</summary>
    [HttpGet("reservation/{reservationId}")]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<PaymentDto>>), 200)]
    public async Task<IActionResult> GetByReservation(string reservationId,
        [FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var result = await Mediator.Send(new GetPaymentsByReservationQuery(reservationId, page, pageSize), ct);
        return OkResult(result);
    }

    /// <summary>Register a payment — supports idempotency via Idempotency-Key header</summary>
    [HttpPost]
    [Authorize(Roles = "Staff,Admin,SuperAdmin")]
    [ProducesResponseType(typeof(ApiResponse<PaymentDto>), 201)]
    [ProducesResponseType(typeof(ApiResponse), 400)]
    [ProducesResponseType(typeof(ApiResponse), 409)]
    public async Task<IActionResult> Create(
        [FromBody] CreatePaymentRequest req,
        [FromHeader(Name = "Idempotency-Key")] string? idempotencyKey,
        CancellationToken ct = default)
    {
        var key = idempotencyKey ?? Guid.NewGuid().ToString();
        var result = await Mediator.Send(new CreatePaymentCommand(
            req.ReservationId, req.HotelId, req.Amount, req.Currency,
            req.Method, key, req.TransactionId, req.Gateway, req.Notes), ct);
        return CreatedResult($"/api/v1/payments/{result.Id}", result, "Payment recorded.");
    }

    /// <summary>Refund a payment (full or partial)</summary>
    [HttpPost("{id}/refund")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    [ProducesResponseType(typeof(ApiResponse<PaymentDto>), 200)]
    [ProducesResponseType(typeof(ApiResponse), 400)]
    [ProducesResponseType(typeof(ApiResponse), 404)]
    public async Task<IActionResult> Refund(string id, [FromBody] RefundPaymentRequest req, CancellationToken ct)
    {
        var result = await Mediator.Send(new RefundPaymentCommand(id, req.Amount, req.Reason), ct);
        return OkResult(result, "Refund processed.");
    }
}