using Hotel.Shared.Models;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Hotel.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Produces("application/json")]
public abstract class BaseController : ControllerBase
{
    protected IMediator Mediator => HttpContext.RequestServices.GetRequiredService<IMediator>();

    protected IActionResult OkResult<T>(T data, string? message = null)
        => Ok(ApiResponse<T>.Ok(data, message));

    protected IActionResult CreatedResult<T>(string location, T data, string? message = null)
        => Created(location, ApiResponse<T>.Ok(data, message));

    protected IActionResult NoContentResult()
        => NoContent();
}