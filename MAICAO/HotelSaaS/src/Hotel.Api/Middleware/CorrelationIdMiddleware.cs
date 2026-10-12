using Hotel.Shared.Constants;

namespace Hotel.Api.Middleware;

public class CorrelationIdMiddleware
{
    private readonly RequestDelegate _next;
    public CorrelationIdMiddleware(RequestDelegate next) { _next = next; }

    public async Task InvokeAsync(HttpContext ctx)
    {
        var correlationId = ctx.Request.Headers[AppConstants.Headers.CorrelationId].FirstOrDefault()
                            ?? Guid.NewGuid().ToString();

        ctx.Items[AppConstants.Headers.CorrelationId] = correlationId;
        ctx.Response.Headers[AppConstants.Headers.CorrelationId] = correlationId;
        ctx.Response.Headers[AppConstants.Headers.TraceId] = ctx.TraceIdentifier;

        await _next(ctx);
    }
}