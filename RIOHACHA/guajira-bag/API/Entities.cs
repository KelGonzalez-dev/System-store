namespace GuajiraBags.Api.Models;

// ── Usuario ──────────────────────────────────────────────────
public class Usuario
{
    public int    Id             { get; set; }
    public string Username       { get; set; } = null!;
    public string Email          { get; set; } = null!;
    public string PasswordHash   { get; set; } = null!;
    public string Rol            { get; set; } = "admin";
    public bool   Activo         { get; set; } = true;
    public DateTime CreadoEn     { get; set; } = DateTime.UtcNow;
    public DateTime ActualizadoEn { get; set; } = DateTime.UtcNow;
}

// ── Producto ─────────────────────────────────────────────────
public class Producto
{
    public int     Id                { get; set; }
    public string  Nombre            { get; set; } = null!;
    public string  Descripcion       { get; set; } = null!;
    public string? DescripcionLarga  { get; set; }
    public decimal Precio            { get; set; }
    public string? ImagenUrl         { get; set; }
    public bool    Activo            { get; set; } = true;
    public DateTime CreadoEn        { get; set; } = DateTime.UtcNow;
    public DateTime ActualizadoEn   { get; set; } = DateTime.UtcNow;

    public ICollection<ProductoImagen> Imagenes { get; set; } = [];
}

public class ProductoImagen
{
    public int    Id         { get; set; }
    public int    ProductoId { get; set; }
    public string Url        { get; set; } = null!;
    public short  Orden      { get; set; }

    public Producto Producto { get; set; } = null!;
}

// ── Galería ──────────────────────────────────────────────────
public class GaleriaItem
{
    public int     Id        { get; set; }
    public string  Url       { get; set; } = null!;
    public string? Caption   { get; set; }
    public short   Orden     { get; set; }
    public bool    Activo    { get; set; } = true;
    public DateTime CreadoEn { get; set; } = DateTime.UtcNow;
}