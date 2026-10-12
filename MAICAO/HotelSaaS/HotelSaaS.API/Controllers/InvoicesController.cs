using AutoMapper;
using AutoMapper.QueryableExtensions;
using HotelSaaS.API.Common;
using HotelSaaS.API.Data;
using HotelSaaS.API.DTOs.Payments;
using HotelSaaS.API.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelSaaS.API.Controllers;

[Authorize(Policy = PolicyNames.StaffOnly)]
public class InvoicesController : BaseApiController
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public InvoicesController(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] DTOs.Common.PaginationQuery filter, CancellationToken cancellationToken)
    {
        var query = _context.Invoices.Include(i => i.Reservation).AsQueryable();
        if (!string.IsNullOrWhiteSpace(filter.Search))
            query = query.Where(i => i.Number.Contains(filter.Search));

        var projected = query.ProjectTo<InvoiceDto>(_mapper.ConfigurationProvider);
        return OkResponse(await PaginationHelper.ToPagedAsync(projected, filter.Page, filter.PageSize, cancellationToken));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var invoice = await _context.Invoices.FindAsync(new object[] { id }, cancellationToken)
            ?? throw ApiException.NotFound("Invoice not found");
        return OkResponse(_mapper.Map<InvoiceDto>(invoice));
    }
}
