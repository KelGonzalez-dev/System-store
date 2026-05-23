namespace HotelSaaS.API.Interfaces.Services;

public interface IUploadService
{
    Task<string> UploadImageAsync(IFormFile file, string subFolder = "", CancellationToken cancellationToken = default);
    Task<List<string>> UploadImagesAsync(List<IFormFile> files, string subFolder = "", CancellationToken cancellationToken = default);
    bool DeleteImage(string url);
}
