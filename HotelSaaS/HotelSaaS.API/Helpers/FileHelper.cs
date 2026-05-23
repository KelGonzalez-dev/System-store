namespace HotelSaaS.API.Helpers;

public class FileHelper
{
    private readonly IConfiguration _configuration;
    private readonly IWebHostEnvironment _environment;

    public FileHelper(IConfiguration configuration, IWebHostEnvironment environment)
    {
        _configuration = configuration;
        _environment = environment;
    }

    public string UploadPath => Path.Combine(_environment.ContentRootPath,
        _configuration["Upload:UploadPath"] ?? "Uploads");

    public long MaxFileSize => long.Parse(_configuration["Upload:MaxFileSizeBytes"] ?? "5242880");

    public string[] AllowedExtensions => _configuration.GetSection("Upload:AllowedExtensions").Get<string[]>()
        ?? new[] { ".jpg", ".jpeg", ".png", ".webp", ".gif" };

    public void ValidateFile(IFormFile file)
    {
        if (file == null || file.Length == 0)
            throw new InvalidOperationException("File is empty.");

        if (file.Length > MaxFileSize)
            throw new InvalidOperationException($"File exceeds maximum size of {MaxFileSize / 1024 / 1024}MB.");

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(extension))
            throw new InvalidOperationException($"File type '{extension}' is not allowed.");
    }

    public async Task<string> SaveFileAsync(IFormFile file, string subFolder = "")
    {
        ValidateFile(file);
        var folder = string.IsNullOrEmpty(subFolder)
            ? UploadPath
            : Path.Combine(UploadPath, subFolder);

        if (!Directory.Exists(folder))
            Directory.CreateDirectory(folder);

        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        var filePath = Path.Combine(folder, fileName);

        await using var stream = new FileStream(filePath, FileMode.Create);
        await file.CopyToAsync(stream);

        var relativePath = string.IsNullOrEmpty(subFolder)
            ? $"/uploads/{fileName}"
            : $"/uploads/{subFolder}/{fileName}";

        return relativePath;
    }

    public bool DeleteFile(string relativePath)
    {
        var fileName = Path.GetFileName(relativePath);
        var subFolder = relativePath.Contains('/') && relativePath.Split('/').Length > 3
            ? relativePath.Split('/')[2]
            : string.Empty;

        var filePath = string.IsNullOrEmpty(subFolder)
            ? Path.Combine(UploadPath, fileName)
            : Path.Combine(UploadPath, subFolder, fileName);

        if (!File.Exists(filePath)) return false;
        File.Delete(filePath);
        return true;
    }
}
