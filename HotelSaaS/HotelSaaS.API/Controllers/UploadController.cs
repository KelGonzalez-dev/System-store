using HotelSaaS.API.Common;
using HotelSaaS.API.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelSaaS.API.Controllers;

[Authorize]
public class UploadController : BaseApiController
{
    private readonly IUploadService _uploadService;

    public UploadController(IUploadService uploadService) => _uploadService = uploadService;

    [HttpPost("image")]
    public async Task<IActionResult> UploadImage(IFormFile file, [FromQuery] string? folder, CancellationToken cancellationToken)
    {
        var url = await _uploadService.UploadImageAsync(file, folder ?? "general", cancellationToken);
        return OkResponse(new { Url = url }, "Image uploaded successfully");
    }

    [HttpPost("images")]
    public async Task<IActionResult> UploadImages(List<IFormFile> files, [FromQuery] string? folder, CancellationToken cancellationToken)
    {
        var urls = await _uploadService.UploadImagesAsync(files, folder ?? "general", cancellationToken);
        return OkResponse(new { Urls = urls }, "Images uploaded successfully");
    }

    [HttpDelete]
    public IActionResult DeleteImage([FromQuery] string url)
    {
        var deleted = _uploadService.DeleteImage(url);
        return deleted ? OkResponse("Image deleted") : NotFound(ApiResponse.Fail("Image not found"));
    }
}
