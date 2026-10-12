namespace GuajiraBags.Api.Services;

public class FileStorageService(IConfiguration config, IWebHostEnvironment env)
{
    private readonly string _uploadFolder =
        config["FileStorage:UploadFolder"] ?? "wwwroot/uploads";

    private readonly long _maxBytes =
        (long)(double.Parse(config["FileStorage:MaxFileSizeMB"] ?? "5") * 1024 * 1024);

    private static readonly string[] _allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

    // ── Guardar archivo ──────────────────────────────────────
    public async Task<(bool Ok, string Error, string Url)> SaveAsync(IFormFile file, string subfolder)
    {
        if (file.Length == 0)
            return (false, "El archivo está vacío", string.Empty);

        if (file.Length > _maxBytes)
            return (false, $"El archivo supera el máximo permitido ({_maxBytes / 1024 / 1024} MB)", string.Empty);

        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!_allowedExtensions.Contains(ext))
            return (false, $"Extensión no permitida. Use: {string.Join(", ", _allowedExtensions)}", string.Empty);

        // Carpeta destino: wwwroot/uploads/{subfolder}/
        var destFolder = Path.Combine(env.WebRootPath ?? "wwwroot", "uploads", subfolder);
        Directory.CreateDirectory(destFolder);

        // Nombre único para evitar colisiones
        var fileName = $"{Guid.NewGuid()}{ext}";
        var fullPath = Path.Combine(destFolder, fileName);

        await using var stream = new FileStream(fullPath, FileMode.Create);
        await file.CopyToAsync(stream);

        // URL pública relativa
        var url = $"/uploads/{subfolder}/{fileName}";
        return (true, string.Empty, url);
    }

    // ── Eliminar archivo ─────────────────────────────────────
    public void Delete(string? relativeUrl)
    {
        if (string.IsNullOrWhiteSpace(relativeUrl)) return;

        var fullPath = Path.Combine(env.WebRootPath ?? "wwwroot", relativeUrl.TrimStart('/'));
        if (File.Exists(fullPath))
            File.Delete(fullPath);
    }
}