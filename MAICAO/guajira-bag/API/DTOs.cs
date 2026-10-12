using System.ComponentModel.DataAnnotations;

namespace GuajiraBags.Api.Models.DTOs;

// ── Auth ─────────────────────────────────────────────────────
public record RegisterRequest(
    [Required, MinLength(3), MaxLength(60)]  string Username,
    [Required, EmailAddress]                 string Email,
    [Required, MinLength(8)]                 string Password
);

public record LoginRequest(
    [Required] string Username,
    [Required] string Password
);

public record AuthResponse(
    string Token,
    string Username,
    string Email,
    string Rol,
    DateTime Expira
);

// ── Producto ─────────────────────────────────────────────────
public record ProductoCreateRequest(
    [Required, MaxLength(200)] string Nombre,
    [Required]                 string Descripcion,
    string?                    DescripcionLarga,
    [Required, Range(0, 99999999)] decimal Precio
);

public record ProductoUpdateRequest(
    [MaxLength(200)] string? Nombre,
    string?                  Descripcion,
    string?                  DescripcionLarga,
    [Range(0, 99999999)] decimal? Precio,
    bool?                    Activo
);

public record ProductoResponse(
    int      Id,
    string   Nombre,
    string   Descripcion,
    string?  DescripcionLarga,
    decimal  Precio,
    string?  ImagenUrl,
    bool     Activo,
    DateTime CreadoEn,
    List<string> Imagenes
);

// ── Galería ──────────────────────────────────────────────────
public record GaleriaCreateRequest(
    string? Caption
);

public record GaleriaResponse(
    int      Id,
    string   Url,
    string?  Caption,
    short    Orden,
    bool     Activo,
    DateTime CreadoEn
);

public record GaleriaUpdateRequest(
    string? Caption,
    short?  Orden,
    bool?   Activo
);

// ── Paginación genérica ──────────────────────────────────────
public record PagedResult<T>(
    List<T> Items,
    int     Total,
    int     Pagina,
    int     TotalPaginas
);