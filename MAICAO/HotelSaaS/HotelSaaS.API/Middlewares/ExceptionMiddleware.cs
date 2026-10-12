using System.Net;
using System.Text.Json;
using HotelSaaS.API.Common;

namespace HotelSaaS.API.Middlewares;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception: {Message}", ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        var (statusCode, message, errors) = exception switch
        {
            ApiException apiEx => (apiEx.StatusCode, apiEx.Message, apiEx.Errors),
            UnauthorizedAccessException => (StatusCodes.Status401Unauthorized, "Unauthorized access.", new List<string>()),
            KeyNotFoundException => (StatusCodes.Status404NotFound, exception.Message, new List<string>()),
            ArgumentException => (StatusCodes.Status400BadRequest, exception.Message, new List<string>()),
            _ => (StatusCodes.Status500InternalServerError, "An internal server error occurred.", new List<string>())
        };

        context.Response.StatusCode = statusCode;

        var response = ApiResponse.Fail(message, errors.Count > 0 ? errors : null);
        return context.Response.WriteAsync(JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        }));
    }
}
