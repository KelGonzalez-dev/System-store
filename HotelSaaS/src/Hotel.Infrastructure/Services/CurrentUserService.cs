using Hotel.Application.Common.Interfaces;
using Hotel.Shared.Constants;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace Hotel.Infrastructure.Services;

public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    { _httpContextAccessor = httpContextAccessor; }

    private ClaimsPrincipal? User => _httpContextAccessor.HttpContext?.User;

    public string? UserId => User?.FindFirstValue(ClaimTypes.NameIdentifier)
                          ?? User?.FindFirstValue("sub");
    public string? Email => User?.FindFirstValue(ClaimTypes.Email)
                         ?? User?.FindFirstValue("email");
    public string? Role => User?.FindFirstValue(ClaimTypes.Role);
    public string? HotelId => User?.FindFirstValue("hotel_id");
    public string? CorrelationId => _httpContextAccessor.HttpContext?.Request.Headers[AppConstants.Headers.CorrelationId].FirstOrDefault();
    public bool IsAuthenticated => User?.Identity?.IsAuthenticated ?? false;
    public bool IsSuperAdmin => Role == AppConstants.Auth.SuperAdmin;
    public bool IsAdmin => Role is AppConstants.Auth.Admin or AppConstants.Auth.SuperAdmin;
}