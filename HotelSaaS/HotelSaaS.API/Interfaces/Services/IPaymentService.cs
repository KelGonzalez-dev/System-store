using HotelSaaS.API.Common;
using HotelSaaS.API.DTOs.Payments;

namespace HotelSaaS.API.Interfaces.Services;

public interface IPaymentService
{
    Task<PagedResponse<PaymentDto>> GetAllAsync(PaymentFilterDto filter, CancellationToken cancellationToken = default);
    Task<PaymentDto> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<PaymentDto> CreateAsync(CreatePaymentDto dto, Guid createdBy, CancellationToken cancellationToken = default);
    Task<PaymentDto> ProcessStripeAsync(StripePaymentDto dto, Guid createdBy, CancellationToken cancellationToken = default);
    Task<PaymentDto> RefundAsync(Guid id, RefundPaymentDto dto, Guid updatedBy, CancellationToken cancellationToken = default);
    Task<InvoiceDto> CreateInvoiceAsync(CreateInvoiceDto dto, Guid createdBy, CancellationToken cancellationToken = default);
}
