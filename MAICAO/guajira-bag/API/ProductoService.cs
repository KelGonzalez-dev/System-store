using GuajiraBags.Api.Data;
using GuajiraBags.Api.Models;
using GuajiraBags.Api.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace GuajiraBags.Api.Services;

public class ProductoService(AppDbContext db, FileStorageService storage)
{
    // ── Listar (paginado) ────────────────────────────────────
    public async Task<PagedResult<ProductoResponse>> ListarAsync(int pagina, int porPagina, bool soloActivos)
    {
        var query = db.Productos
            .Include(p => p.Imagenes)
            .AsQueryable();

        if (soloActivos) query = query.Where(p => p.Activo);

        var total = await query.CountAsync();
        var items = await query
            .OrderByDescending(p => p.CreadoEn)
            .Skip((pagina - 1) * porPagina)
            .Take(porPagina)
            .Select(p => ToResponse(p))
            .ToListAsync();

        return new PagedResult<ProductoResponse>(
            items, total, pagina,
            (int)Math.Ceiling((double)total / porPagina)
        );
    }

    // ── Obtener por Id ───────────────────────────────────────
    public async Task<ProductoResponse?> ObtenerAsync(int id)
    {
        var p = await db.Productos.Include(p => p.Imagenes).FirstOrDefaultAsync(p => p.Id == id);
        return p is null ? null : ToResponse(p);
    }

    // ── Crear ────────────────────────────────────────────────
    public async Task<ProductoResponse> CrearAsync(ProductoCreateRequest req, IFormFile? imagen)
    {
        var producto = new Producto
        {
            Nombre           = req.Nombre,
            Descripcion      = req.Descripcion,
            DescripcionLarga = req.DescripcionLarga,
            Precio           = req.Precio
        };

        if (imagen is not null)
        {
            var (ok, error, url) = await storage.SaveAsync(imagen, "productos");
            if (!ok) throw new InvalidOperationException(error);
            producto.ImagenUrl = url;
        }

        db.Productos.Add(producto);
        await db.SaveChangesAsync();
        return ToResponse(producto);
    }

    // ── Agregar imagen extra ──────────────────────────────────
    public async Task<(bool Ok, string Error, string Url)> AgregarImagenAsync(int productoId, IFormFile imagen)
    {
        var existe = await db.Productos.AnyAsync(p => p.Id == productoId);
        if (!existe) return (false, "Producto no encontrado", string.Empty);

        var (ok, error, url) = await storage.SaveAsync(imagen, "productos");
        if (!ok) return (false, error, string.Empty);

        var orden = (short)(await db.ProductoImagenes.CountAsync(i => i.ProductoId == productoId));
        db.ProductoImagenes.Add(new ProductoImagen { ProductoId = productoId, Url = url, Orden = orden });
        await db.SaveChangesAsync();

        return (true, string.Empty, url);
    }

    // ── Actualizar ───────────────────────────────────────────
    public async Task<(bool Ok, string Error, ProductoResponse? Data)> ActualizarAsync(
        int id, ProductoUpdateRequest req, IFormFile? nuevaImagen)
    {
        var producto = await db.Productos.Include(p => p.Imagenes).FirstOrDefaultAsync(p => p.Id == id);
        if (producto is null) return (false, "Producto no encontrado", null);

        if (req.Nombre is not null)           producto.Nombre           = req.Nombre;
        if (req.Descripcion is not null)       producto.Descripcion      = req.Descripcion;
        if (req.DescripcionLarga is not null)  producto.DescripcionLarga = req.DescripcionLarga;
        if (req.Precio.HasValue)               producto.Precio           = req.Precio.Value;
        if (req.Activo.HasValue)               producto.Activo           = req.Activo.Value;

        if (nuevaImagen is not null)
        {
            storage.Delete(producto.ImagenUrl);
            var (ok, error, url) = await storage.SaveAsync(nuevaImagen, "productos");
            if (!ok) return (false, error, null);
            producto.ImagenUrl = url;
        }

        producto.ActualizadoEn = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return (true, string.Empty, ToResponse(producto));
    }

    // ── Eliminar ─────────────────────────────────────────────
    public async Task<bool> EliminarAsync(int id)
    {
        var producto = await db.Productos.Include(p => p.Imagenes).FirstOrDefaultAsync(p => p.Id == id);
        if (producto is null) return false;

        // Borrar archivos físicos
        storage.Delete(producto.ImagenUrl);
        foreach (var img in producto.Imagenes) storage.Delete(img.Url);

        db.Productos.Remove(producto);
        await db.SaveChangesAsync();
        return true;
    }

    // ── Mapper interno ────────────────────────────────────────
    private static ProductoResponse ToResponse(Producto p) => new(
        p.Id, p.Nombre, p.Descripcion, p.DescripcionLarga,
        p.Precio, p.ImagenUrl, p.Activo, p.CreadoEn,
        p.Imagenes.OrderBy(i => i.Orden).Select(i => i.Url).ToList()
    );
}