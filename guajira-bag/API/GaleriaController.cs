using GuajiraBags.Api.Models.DTOs;
using GuajiraBags.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GuajiraBags.Api.Controllers;

[ApiController]
[Route("api/galeria")]
public class GaleriaController(GaleriaService service) : ControllerBase
{
    /// <summary>Listar imágenes de galería (público)</summary>
    [HttpGet]
    public async Task<IActionResult> Listar([FromQuery] bool soloActivos = true)
    {
        var items = await service.ListarAsync(soloActivos);
        return Ok(items);
    }

    /// <summary>Obtener imagen por Id (público)</summary>
    [HttpGet("{id:int}")]
    public async Task<IActionResult> Obtener(int id)
    {
        var item = await service.ObtenerAsync(id);
        return item is null ? NotFound() : Ok(item);
    }

    /// <summary>Subir nueva imagen a la galería (requiere auth)</summary>
    [HttpPost]
    [Authorize]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Crear(
        [FromForm] IFormFile foto,           // ← [FromForm] explícito
        [FromForm] string? caption)          // ← string directo, sin record
    {
        if (foto is null || foto.Length == 0)
            return BadRequest(new { error = "La foto es obligatoria" });

        var req = new GaleriaCreateRequest(caption);
        var (ok, error, data) = await service.CrearAsync(foto, req);
        if (!ok) return BadRequest(new { error });

        return CreatedAtAction(nameof(Obtener), new { id = data!.Id }, data);
    }

    /// <summary>Actualizar caption, orden o visibilidad (requiere auth)</summary>
    [HttpPut("{id:int}")]
    [Authorize]
    public async Task<IActionResult> Actualizar(int id, [FromBody] GaleriaUpdateRequest req)
    {
        var (ok, error, data) = await service.ActualizarAsync(id, req);
        if (!ok) return BadRequest(new { error });
        return Ok(data);
    }

    /// <summary>Eliminar imagen de galería (requiere auth)</summary>
    [HttpDelete("{id:int}")]
    [Authorize]
    public async Task<IActionResult> Eliminar(int id)
    {
        var ok = await service.EliminarAsync(id);
        return ok ? NoContent() : NotFound();
    }
}