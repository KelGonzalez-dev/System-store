using Hotel.Application.Common.Interfaces;
using Hotel.Application.Features.Payments.DTOs;
using Hotel.Shared.Models;
using MediatR;

namespace Hotel.Application.Features.Payments.Queries;

public record GetPaymentsByReservationQuery(string ReservationId, int Page = 1, int PageSize = 20) : IRequest<PagedResult<PaymentDto>>;

public class GetPaymentsByReservationQueryHandler : IRequestHandler<GetPaymentsByReservationQuery, PagedResult<PaymentDto>>
{
    private readonly IUnitOfWorkApp _uow;
    public GetPaymentsByReservationQueryHandler(IUnitOfWorkApp uow) { _uow = uow; }

    public async Task<PagedResult<PaymentDto>> Handle(GetPaymentsByReservationQuery req, CancellationToken ct)
    {
        var (items, total) = await _uow.Payments.GetByReservationAsync(req.ReservationId, req.Page, req.PageSize, ct);
        var dtos = items.Select(p => new PaymentDto(p.Id, p.HotelId, p.ReservationId,
            p.IdempotencyKey, p.Amount, p.RefundedAmount, p.Currency, p.Method.ToString(),
            p.Status.ToString(), p.TransactionId, p.Gateway, p.Notes,
            p.ProcessedBy, p.ProcessedAt, p.CreatedAt, p.UpdatedAt));
        return PagedResult<PaymentDto>.Create(dtos, total, req.Page, req.PageSize);
    }
}