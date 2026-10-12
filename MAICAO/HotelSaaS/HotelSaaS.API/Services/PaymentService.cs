using AutoMapper;
using AutoMapper.QueryableExtensions;
using HotelSaaS.API.Common;
using HotelSaaS.API.Data;
using HotelSaaS.API.DTOs.Payments;
using HotelSaaS.API.Entities;
using HotelSaaS.API.Helpers;
using HotelSaaS.API.Interfaces.Repositories;
using HotelSaaS.API.Interfaces.Services;
using Microsoft.EntityFrameworkCore;

namespace HotelSaaS.API.Services;

public class PaymentService : IPaymentService
{
    private readonly IPaymentRepository _paymentRepository;
    private readonly IReservationRepository _reservationRepository;
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public PaymentService(
        IPaymentRepository paymentRepository,
        IReservationRepository reservationRepository,
        ApplicationDbContext context,
        IMapper mapper)
    {
        _paymentRepository = paymentRepository;
        _reservationRepository = reservationRepository;
        _context = context;
        _mapper = mapper;
    }

    public async Task<PagedResponse<PaymentDto>> GetAllAsync(PaymentFilterDto filter, CancellationToken cancellationToken = default)
    {
        var query = _paymentRepository.Query();

        if (filter.ReservationId.HasValue)
            query = query.Where(p => p.ReservationId == filter.ReservationId.Value);

        if (filter.Status.HasValue)
            query = query.Where(p => p.Status == filter.Status.Value);

        if (filter.Method.HasValue)
            query = query.Where(p => p.Method == filter.Method.Value);

        query = string.IsNullOrWhiteSpace(filter.SortBy)
            ? query.OrderByDescending(p => p.CreatedAt)
            : PaginationHelper.ApplySorting(query, filter.SortBy, filter.SortDescending);

        var projected = query.ProjectTo<PaymentDto>(_mapper.ConfigurationProvider);
        return await PaginationHelper.ToPagedAsync(projected, filter.Page, filter.PageSize, cancellationToken);
    }

    public async Task<PaymentDto> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var payment = await _paymentRepository.GetByIdAsync(id, cancellationToken)
            ?? throw ApiException.NotFound("Payment not found.");
        return _mapper.Map<PaymentDto>(payment);
    }

    public async Task<PaymentDto> CreateAsync(CreatePaymentDto dto, Guid createdBy, CancellationToken cancellationToken = default)
    {
        var reservation = await _reservationRepository.GetByIdAsync(dto.ReservationId, cancellationToken)
            ?? throw ApiException.NotFound("Reservation not found.");

        var payment = new Payment
        {
            ReservationId = dto.ReservationId,
            Amount = dto.Amount,
            Method = dto.Method,
            Status = PaymentStatus.Completed,
            TransactionId = $"TXN-{Guid.NewGuid():N}"[..20],
            Notes = dto.Notes,
            ProcessedAt = DateTime.UtcNow,
            CreatedBy = createdBy
        };

        await _paymentRepository.AddAsync(payment, cancellationToken);
        return await GetByIdAsync(payment.Id, cancellationToken);
    }

    public async Task<PaymentDto> ProcessStripeAsync(StripePaymentDto dto, Guid createdBy, CancellationToken cancellationToken = default)
    {
        var reservation = await _reservationRepository.GetByIdAsync(dto.ReservationId, cancellationToken)
            ?? throw ApiException.NotFound("Reservation not found.");

        var payment = new Payment
        {
            ReservationId = dto.ReservationId,
            Amount = dto.Amount,
            Method = PaymentMethod.Stripe,
            Status = PaymentStatus.Completed,
            StripePaymentId = $"pi_mock_{Guid.NewGuid():N}"[..24],
            TransactionId = $"TXN-STRIPE-{Guid.NewGuid():N}"[..24],
            ProcessedAt = DateTime.UtcNow,
            CreatedBy = createdBy
        };

        await _paymentRepository.AddAsync(payment, cancellationToken);
        return await GetByIdAsync(payment.Id, cancellationToken);
    }

    public async Task<PaymentDto> RefundAsync(Guid id, RefundPaymentDto dto, Guid updatedBy, CancellationToken cancellationToken = default)
    {
        var payment = await _paymentRepository.GetByIdAsync(id, cancellationToken)
            ?? throw ApiException.NotFound("Payment not found.");

        if (payment.Status != PaymentStatus.Completed)
            throw ApiException.BadRequest("Only completed payments can be refunded.");

        var refundAmount = dto.Amount ?? payment.Amount;
        if (refundAmount > payment.Amount)
            throw ApiException.BadRequest("Refund amount exceeds payment amount.");

        payment.RefundAmount = refundAmount;
        payment.RefundedAt = DateTime.UtcNow;
        payment.RefundReason = dto.Reason;
        payment.Status = refundAmount >= payment.Amount ? PaymentStatus.Refunded : PaymentStatus.PartiallyRefunded;
        payment.UpdatedBy = updatedBy;

        await _paymentRepository.UpdateAsync(payment, cancellationToken);
        return await GetByIdAsync(id, cancellationToken);
    }

    public async Task<InvoiceDto> CreateInvoiceAsync(CreateInvoiceDto dto, Guid createdBy, CancellationToken cancellationToken = default)
    {
        var reservation = await _reservationRepository.GetByIdAsync(dto.ReservationId, cancellationToken)
            ?? throw ApiException.NotFound("Reservation not found.");

        var subtotal = reservation.TotalAmount;
        var tax = subtotal * dto.TaxRate;
        var total = subtotal + tax;

        var invoice = new Invoice
        {
            Number = $"INV-{DateTime.UtcNow:yyyyMMdd}-{Random.Shared.Next(10000, 99999)}",
            ReservationId = dto.ReservationId,
            PaymentId = dto.PaymentId,
            Subtotal = subtotal,
            Tax = tax,
            Total = total,
            Status = InvoiceStatus.Issued,
            IssuedAt = DateTime.UtcNow,
            DueDate = DateTime.UtcNow.AddDays(30),
            CreatedBy = createdBy
        };

        await _context.Invoices.AddAsync(invoice, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
        return _mapper.Map<InvoiceDto>(invoice);
    }
}
