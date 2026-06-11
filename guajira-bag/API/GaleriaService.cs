using GuajiraBags.Api.Data;
using GuajiraBags.Api.Models;
using GuajiraBags.Api.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace GuajiraBags.Api.Services;

public class GaleriaService(AppDbContext db, FileStorageService storage)
{
    // ── Listar ───────────────────────────────────────────────
    public async Task<List<GaleriaResponse>> ListarAsync(bool soloActivos = true)
    {
        var query = db.Galeria.AsQueryable();
        if (soloActivos) query = query.Where(g => g.Activo);

        return await query
            .OrderBy(g => g.Orden)
            .ThenByDescending(g => g.CreadoEn)
            .Select(g => ToResponse(g))
            .ToListAsync();
    }

    // ── Obtener por Id ───────────────────────────────────────
    public async Task<GaleriaResponse?> ObtenerAsync(int id)
    {
        var g = await db.Galeria.FindAsync(id);
        return g is null ? null : ToResponse(g);
    }

    // ── Crear (con foto obligatoria) ─────────────────────────
    public async Task<(bool Ok, string Error, GaleriaResponse? Data)> CrearAsync(
        IFormFile foto, GaleriaCreateRequest req)
    {
        var (ok, error, url) = await storage.SaveAsync(foto, "galeria");
        if (!ok) return (false, error, null);

        var maxOrden = await db.Galeria.MaxAsync(g => (short?)g.Orden) ?? 0;

        var item = new GaleriaItem
        {
            Url     = url,
            Caption = req.Caption,
            Orden   = (short)(maxOrden + 1)
        };

        db.Galeria.Add(item);
        await db.SaveChangesAsync();
        return (true, string.Empty, ToResponse(item));
    }

    // ── Actualizar caption / orden / activo ──────────────────
    public async Task<(bool Ok, string Error, GaleriaResponse? Data)> ActualizarAsync(
        int id, GaleriaUpdateRequest req)
    {
        var item = await db.Galeria.FindAsync(id);
        if (item is null) return (false, "Imagen no encontrada", null);

        if (req.Caption is not null) item.Caption = req.Caption;
        if (req.Orden.HasValue)      item.Orden   = req.Orden.Value;
        if (req.Activo.HasValue)     item.Activo  = req.Activo.Value;

        await db.SaveChangesAsync();
        return (true, string.Empty, ToResponse(item));
    }

    // ── Eliminar ─────────────────────────────────────────────
    public async Task<bool> EliminarAsync(int id)
    {
        var item = await db.Galeria.FindAsync(id);
        if (item is null) return false;

        storage.Delete(item.Url);
        db.Galeria.Remove(item);
        await db.SaveChangesAsync();
        return true;
    }

    // ── Mapper ───────────────────────────────────────────────
    private static GaleriaResponse ToResponse(GaleriaItem g) =>
        new(g.Id, g.Url, g.Caption, g.Orden, g.Activo, g.CreadoEn);
}