using GuajiraBags.Api.Models.DTOs;
using GuajiraBags.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GuajiraBags.Api.Controllers;

[ApiController]
[Route("api/productos")]
public class ProductosController(ProductoService service) : ControllerBase
{
    /// <summary>Listar productos (público)</summary>
    [HttpGet]
    public async Task<IActionResult> Listar(
        [FromQuery] int  pagina      = 1,
        [FromQuery] int  porPagina   = 15,
        [FromQuery] bool soloActivos = true)
    {
        if (pagina < 1) pagina = 1;
        if (porPagina < 1 || porPagina > 100) porPagina = 15;

        var result = await service.ListarAsync(pagina, porPagina, soloActivos);
        return Ok(result);
    }

    /// <summary>Obtener producto por Id (público)</summary>
    [HttpGet("{id:int}")]
    public async Task<IActionResult> Obtener(int id)
    {
        var item = await service.ObtenerAsync(id);
        return item is null ? NotFound() : Ok(item);
    }

    /// <summary>Crear producto con imagen principal (requiere auth)</summary>
    [HttpPost]
    [Authorize]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Crear(
        [FromForm] string  nombre,
        [FromForm] string  descripcion,
        [FromForm] string? descripcionLarga,
        [FromForm] decimal precio,
        [FromForm] IFormFile? imagen)           // ← [FromForm] explícito
    {
        if (string.IsNullOrWhiteSpace(nombre))      return BadRequest(new { error = "El nombre es obligatorio" });
        if (string.IsNullOrWhiteSpace(descripcion)) return BadRequest(new { error = "La descripción es obligatoria" });
        if (precio < 0)                             return BadRequest(new { error = "El precio no puede ser negativo" });

        var req = new ProductoCreateRequest(nombre, descripcion, descripcionLarga, precio);
        var producto = await service.CrearAsync(req, imagen);
        return CreatedAtAction(nameof(Obtener), new { id = producto.Id }, producto);
    }

    /// <summary>Agregar imagen adicional a un producto (requiere auth)</summary>
    [HttpPost("{id:int}/imagenes")]
    [Authorize]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> AgregarImagen(int id, [FromForm] IFormFile imagen)
    {
        var (ok, error, url) = await service.AgregarImagenAsync(id, imagen);
        if (!ok) return BadRequest(new { error });
        return Ok(new { url });
    }

    /// <summary>Actualizar producto (requiere auth)</summary>
    [HttpPut("{id:int}")]
    [Authorize]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Actualizar(
        int id,
        [FromForm] string?  nombre,
        [FromForm] string?  descripcion,
        [FromForm] string?  descripcionLarga,
        [FromForm] decimal? precio,
        [FromForm] bool?    activo,
        [FromForm] IFormFile? nuevaImagen)      // ← [FromForm] explícito
    {
        var req = new ProductoUpdateRequest(nombre, descripcion, descripcionLarga, precio, activo);
        var (ok, error, data) = await service.ActualizarAsync(id, req, nuevaImagen);
        if (!ok) return BadRequest(new { error });
        return Ok(data);
    }

    /// <summary>Eliminar producto (requiere auth)</summary>
    [HttpDelete("{id:int}")]
    [Authorize]
    public async Task<IActionResult> Eliminar(int id)
    {
        var ok = await service.EliminarAsync(id);
        return ok ? NoContent() : NotFound();
    }
}