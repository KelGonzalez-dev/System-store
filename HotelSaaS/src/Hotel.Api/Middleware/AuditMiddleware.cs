using Hotel.Application.Common.Interfaces;
using Hotel.Domain.Entities;

namespace Hotel.Api.Middleware;

public class AuditMiddleware
{
    private readonly RequestDelegate _next;
    public AuditMiddleware(RequestDelegate next) { _next = next; }

    public async Task InvokeAsync(HttpContext ctx, IUnitOfWorkApp uow, ICurrentUserService currentUser)
    {
        await _next(ctx);

        // Log write operations to audit
        if (ctx.Request.Method is "POST" or "PUT" or "PATCH" or "DELETE" && ctx.Response.StatusCode < 400)
        {
            try
            {
                var log = new AuditLog
                {
                    Id = Ulid.NewUlid().ToString(),
                    HotelId = currentUser.HotelId,
                    UserId = currentUser.UserId,
                    UserEmail = currentUser.Email,
                    Action = ctx.Request.Method,
                    EntityType = ctx.Request.Path.ToString(),
                    IpAddress = ctx.Connection.RemoteIpAddress?.ToString(),
                    UserAgent = ctx.Request.Headers["User-Agent"].FirstOrDefault(),
                    CorrelationId = ctx.Items["X-Correlation-Id"]?.ToString(),
                    TraceId = ctx.TraceIdentifier,
                    Success = ctx.Response.StatusCode < 400,
                    CreatedAt = DateTime.UtcNow
                };
                await uow.Audits.AddAsync(log);
                await uow.SaveChangesAsync();
            }
            catch { /* Don't let audit failures break requests */ }
        }
    }
}