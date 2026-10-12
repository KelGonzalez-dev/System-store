using System.Security.Claims;
using HotelSaaS.API.Common;
using HotelSaaS.API.Entities;
using Microsoft.AspNetCore.Mvc;

namespace HotelSaaS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public abstract class BaseApiController : ControllerBase
{
    protected Guid CurrentUserId
    {
        get
        {
            var claim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (claim != null && Guid.TryParse(claim, out var id))
                return id;
            if (HttpContext.Items["User"] is User user)
                return user.Id;
            throw ApiException.Unauthorized();
        }
    }

    protected IActionResult OkResponse<T>(T data, string message = "Success") =>
        Ok(ApiResponse<T>.Ok(data, message));

    protected IActionResult OkResponse(string message = "Success") =>
        Ok(ApiResponse.Ok(message));

    protected IActionResult CreatedResponse<T>(T data, string message = "Created successfully") =>
        StatusCode(StatusCodes.Status201Created, ApiResponse<T>.Ok(data, message));
}
