using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using HotelSaaS.API.Data;
using Microsoft.EntityFrameworkCore;

namespace HotelSaaS.API.Middlewares;

public class JwtMiddleware
{
    private readonly RequestDelegate _next;

    public JwtMiddleware(RequestDelegate next) => _next = next;

    public async Task InvokeAsync(HttpContext context, ApplicationDbContext dbContext)
    {
        var token = context.Request.Headers.Authorization.FirstOrDefault()?.Split(" ").Last();

        if (!string.IsNullOrEmpty(token))
        {
            AttachUserToContext(context, dbContext, token);
        }

        await _next(context);
    }

    private static void AttachUserToContext(HttpContext context, ApplicationDbContext dbContext, string token)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtToken = tokenHandler.ReadJwtToken(token);
            var userId = jwtToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            if (userId != null && Guid.TryParse(userId, out var id))
            {
                var user = dbContext.Users
                    .Include(u => u.UserRoles).ThenInclude(ur => ur.Role)
                    .FirstOrDefault(u => u.Id == id && u.IsActive && !u.IsDeleted);

                if (user != null)
                    context.Items["User"] = user;
            }
        }
        catch
        {
            // Token parsing failed - authorization middleware will handle
        }
    }
}
