namespace Hotel.Shared.Models;

public class PagedResult<T>
{
    public IEnumerable<T> Items { get; set; } = Enumerable.Empty<T>();
    public int Total { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)Total / PageSize);
    public bool HasNext => Page < TotalPages;
    public bool HasPrevious => Page > 1;

    public static PagedResult<T> Create(IEnumerable<T> items, int total, int page, int pageSize)
        => new() { Items = items, Total = total, Page = page, PageSize = pageSize };
}

public class ApiResponse<T>
{
    public bool Success { get; set; }
    public T? Data { get; set; }
    public string? Message { get; set; }
    public IEnumerable<string> Errors { get; set; } = Enumerable.Empty<string>();
    public string? TraceId { get; set; }

    public static ApiResponse<T> Ok(T data, string? message = null) =>
        new() { Success = true, Data = data, Message = message };

    public static ApiResponse<T> Fail(string message, IEnumerable<string>? errors = null) =>
        new() { Success = false, Message = message, Errors = errors ?? Enumerable.Empty<string>() };
}

public class ApiResponse
{
    public bool Success { get; set; }
    public string? Message { get; set; }
    public IEnumerable<string> Errors { get; set; } = Enumerable.Empty<string>();
    public string? TraceId { get; set; }

    public static ApiResponse Ok(string? message = null) =>
        new() { Success = true, Message = message };

    public static ApiResponse Fail(string message, IEnumerable<string>? errors = null) =>
        new() { Success = false, Message = message, Errors = errors ?? Enumerable.Empty<string>() };
}
