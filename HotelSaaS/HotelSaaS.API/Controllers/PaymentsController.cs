using HotelSaaS.API.Common;
using HotelSaaS.API.DTOs.Payments;
using HotelSaaS.API.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelSaaS.API.Controllers;

[Authorize(Policy = PolicyNames.StaffOnly)]
public class PaymentsController : BaseApiController
{
    private readonly IPaymentService _paymentService;

    public PaymentsController(IPaymentService paymentService) => _paymentService = paymentService;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] PaymentFilterDto filter, CancellationToken cancellationToken) =>
        OkResponse(await _paymentService.GetAllAsync(filter, cancellationToken));

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken) =>
        OkResponse(await _paymentService.GetByIdAsync(id, cancellationToken));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePaymentDto dto, CancellationToken cancellationToken) =>
        CreatedResponse(await _paymentService.CreateAsync(dto, CurrentUserId, cancellationToken));

    [HttpPost("stripe")]
    public async Task<IActionResult> ProcessStripe([FromBody] StripePaymentDto dto, CancellationToken cancellationToken) =>
        CreatedResponse(await _paymentService.ProcessStripeAsync(dto, CurrentUserId, cancellationToken), "Stripe payment processed");

    [HttpPost("{id:guid}/refund")]
    [Authorize(Policy = PolicyNames.ManagerOrAbove)]
    public async Task<IActionResult> Refund(Guid id, [FromBody] RefundPaymentDto dto, CancellationToken cancellationToken) =>
        OkResponse(await _paymentService.RefundAsync(id, dto, CurrentUserId, cancellationToken), "Refund processed");

    [HttpPost("invoices")]
    public async Task<IActionResult> CreateInvoice([FromBody] CreateInvoiceDto dto, CancellationToken cancellationToken) =>
        CreatedResponse(await _paymentService.CreateInvoiceAsync(dto, CurrentUserId, cancellationToken));
}
