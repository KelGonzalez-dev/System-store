using HotelSaaS.API.Common;
using HotelSaaS.API.DTOs.Hotels;
using HotelSaaS.API.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelSaaS.API.Controllers;

[Authorize]
public class HotelsController : BaseApiController
{
    private readonly IHotelService _hotelService;

    public HotelsController(IHotelService hotelService) => _hotelService = hotelService;

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll([FromQuery] HotelFilterDto filter, CancellationToken cancellationToken) =>
        OkResponse(await _hotelService.GetAllAsync(filter, cancellationToken));

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken) =>
        OkResponse(await _hotelService.GetByIdAsync(id, cancellationToken));

    [HttpPost]
    [Authorize(Policy = PolicyNames.AdminOrAbove)]
    public async Task<IActionResult> Create([FromBody] CreateHotelDto dto, CancellationToken cancellationToken) =>
        CreatedResponse(await _hotelService.CreateAsync(dto, CurrentUserId, cancellationToken));

    [HttpPut("{id:guid}")]
    [Authorize(Policy = PolicyNames.ManagerOrAbove)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateHotelDto dto, CancellationToken cancellationToken) =>
        OkResponse(await _hotelService.UpdateAsync(id, dto, CurrentUserId, cancellationToken));

    [HttpDelete("{id:guid}")]
    [Authorize(Policy = PolicyNames.AdminOrAbove)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await _hotelService.DeleteAsync(id, CurrentUserId, cancellationToken);
        return OkResponse("Hotel deleted successfully");
    }

    [HttpPost("{id:guid}/images")]
    [Authorize(Policy = PolicyNames.ManagerOrAbove)]
    public async Task<IActionResult> AddImages(Guid id, List<IFormFile> files, CancellationToken cancellationToken) =>
        OkResponse(await _hotelService.AddImagesAsync(id, files, cancellationToken), "Images uploaded");
}
