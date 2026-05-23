namespace HotelSaaS.API.Common;

public class ApiException : Exception
{
    public int StatusCode { get; }
    public List<string> Errors { get; }

    public ApiException(string message, int statusCode = 400, List<string>? errors = null)
        : base(message)
    {
        StatusCode = statusCode;
        Errors = errors ?? new List<string>();
    }

    public static ApiException NotFound(string message = "Resource not found") =>
        new(message, StatusCodes.Status404NotFound);

    public static ApiException Unauthorized(string message = "Unauthorized") =>
        new(message, StatusCodes.Status401Unauthorized);

    public static ApiException Forbidden(string message = "Forbidden") =>
        new(message, StatusCodes.Status403Forbidden);

    public static ApiException BadRequest(string message, List<string>? errors = null) =>
        new(message, StatusCodes.Status400BadRequest, errors);

    public static ApiException Conflict(string message) =>
        new(message, StatusCodes.Status409Conflict);
}
