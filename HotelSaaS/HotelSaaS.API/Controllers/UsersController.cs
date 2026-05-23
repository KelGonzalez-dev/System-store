using HotelSaaS.API.Common;
using HotelSaaS.API.DTOs.Users;
using HotelSaaS.API.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelSaaS.API.Controllers;

[Authorize(Policy = PolicyNames.ManagerOrAbove)]
public class UsersController : BaseApiController
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService) => _userService = userService;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] UserFilterDto filter, CancellationToken cancellationToken) =>
        OkResponse(await _userService.GetAllAsync(filter, cancellationToken));

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken) =>
        OkResponse(await _userService.GetByIdAsync(id, cancellationToken));

    [HttpPost]
    [Authorize(Policy = PolicyNames.AdminOrAbove)]
    public async Task<IActionResult> Create([FromBody] CreateUserDto dto, CancellationToken cancellationToken) =>
        CreatedResponse(await _userService.CreateAsync(dto, CurrentUserId, cancellationToken));

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateUserDto dto, CancellationToken cancellationToken) =>
        OkResponse(await _userService.UpdateAsync(id, dto, CurrentUserId, cancellationToken));

    [HttpDelete("{id:guid}")]
    [Authorize(Policy = PolicyNames.AdminOrAbove)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await _userService.DeleteAsync(id, CurrentUserId, cancellationToken);
        return OkResponse("User deleted successfully");
    }

    [HttpPatch("{id:guid}/activate")]
    public async Task<IActionResult> Activate(Guid id, CancellationToken cancellationToken)
    {
        await _userService.ActivateAsync(id, cancellationToken);
        return OkResponse("User activated");
    }

    [HttpPatch("{id:guid}/deactivate")]
    public async Task<IActionResult> Deactivate(Guid id, CancellationToken cancellationToken)
    {
        await _userService.DeactivateAsync(id, cancellationToken);
        return OkResponse("User deactivated");
    }

    [HttpGet("profile")]
    [Authorize]
    public async Task<IActionResult> GetProfile(CancellationToken cancellationToken) =>
        OkResponse(await _userService.GetProfileAsync(CurrentUserId, cancellationToken));

    [HttpPut("profile")]
    [Authorize]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto, CancellationToken cancellationToken) =>
        OkResponse(await _userService.UpdateProfileAsync(CurrentUserId, dto, cancellationToken));

    [HttpPost("profile/avatar")]
    [Authorize]
    public async Task<IActionResult> UpdateAvatar(IFormFile file, CancellationToken cancellationToken) =>
        OkResponse(await _userService.UpdateAvatarAsync(CurrentUserId, file, cancellationToken), "Avatar updated");
}
