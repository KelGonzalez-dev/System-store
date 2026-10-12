using System.Diagnostics;

namespace HotelSaaS.API.Middlewares;

public class LoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<LoggingMiddleware> _logger;

    public LoggingMiddleware(RequestDelegate next, ILogger<LoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var stopwatch = Stopwatch.StartNew();
        var requestId = Guid.NewGuid().ToString("N")[..8];
        context.Items["RequestId"] = requestId;

        _logger.LogInformation(
            "Request {RequestId} {Method} {Path} started",
            requestId, context.Request.Method, context.Request.Path);

        await _next(context);

        stopwatch.Stop();
        _logger.LogInformation(
            "Request {RequestId} {Method} {Path} completed with {StatusCode} in {ElapsedMs}ms",
            requestId, context.Request.Method, context.Request.Path,
            context.Response.StatusCode, stopwatch.ElapsedMilliseconds);
    }
}
