namespace HotelSaaS.API.DTOs.Common;

public class PaginationQuery
{
    private int _page = 1;
    private int _pageSize = 10;

    public int Page
    {
        get => _page;
        set => _page = value < 1 ? 1 : value;
    }

    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = value is < 1 or > 100 ? 10 : value;
    }

    public string? SortBy { get; set; }
    public bool SortDescending { get; set; }
    public string? Search { get; set; }
}
