using HotelSaaS.API.Common;
using Microsoft.EntityFrameworkCore;

namespace HotelSaaS.API.Helpers;

public static class PaginationHelper
{
    public static async Task<PagedResponse<T>> ToPagedAsync<T>(
        IQueryable<T> query,
        int page,
        int pageSize,
        CancellationToken cancellationToken = default)
    {
        page = page < 1 ? 1 : page;
        pageSize = pageSize is < 1 or > 100 ? 10 : pageSize;

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return new PagedResponse<T>
        {
            Items = items,
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount
        };
    }

    public static IQueryable<T> ApplySorting<T>(IQueryable<T> query, string? sortBy, bool descending = false)
    {
        if (string.IsNullOrWhiteSpace(sortBy))
            return query;

        return descending
            ? query.OrderByDescending(e => EF.Property<object>(e, sortBy))
            : query.OrderBy(e => EF.Property<object>(e, sortBy));
    }
}
