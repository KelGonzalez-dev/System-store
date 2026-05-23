using HotelSaaS.API.Helpers;
using HotelSaaS.API.Interfaces.Services;

namespace HotelSaaS.API.Services;

public class UploadService : IUploadService
{
    private readonly FileHelper _fileHelper;

    public UploadService(FileHelper fileHelper) => _fileHelper = fileHelper;

    public async Task<string> UploadImageAsync(IFormFile file, string subFolder = "", CancellationToken cancellationToken = default) =>
        await _fileHelper.SaveFileAsync(file, subFolder);

    public async Task<List<string>> UploadImagesAsync(List<IFormFile> files, string subFolder = "", CancellationToken cancellationToken = default)
    {
        var urls = new List<string>();
        foreach (var file in files)
            urls.Add(await _fileHelper.SaveFileAsync(file, subFolder));
        return urls;
    }

    public bool DeleteImage(string url) => _fileHelper.DeleteFile(url);
}
