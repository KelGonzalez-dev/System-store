using GuajiraBags.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace GuajiraBags.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Usuario>       Usuarios      => Set<Usuario>();
    public DbSet<Producto>      Productos     => Set<Producto>();
    public DbSet<ProductoImagen> ProductoImagenes => Set<ProductoImagen>();
    public DbSet<GaleriaItem>   Galeria       => Set<GaleriaItem>();

    protected override void OnModelCreating(ModelBuilder mb)
    {
        // ── Usuario ──────────────────────────────────────────
        mb.Entity<Usuario>(e =>
        {
            e.ToTable("usuarios");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id").UseIdentityAlwaysColumn();
            e.Property(x => x.Username).HasColumnName("username").HasMaxLength(60);
            e.Property(x => x.Email).HasColumnName("email").HasMaxLength(120);
            e.Property(x => x.PasswordHash).HasColumnName("password_hash");
            e.Property(x => x.Rol).HasColumnName("rol").HasMaxLength(20).HasDefaultValue("admin");
            e.Property(x => x.Activo).HasColumnName("activo").HasDefaultValue(true);
            e.Property(x => x.CreadoEn).HasColumnName("creado_en").HasDefaultValueSql("NOW()");
            e.Property(x => x.ActualizadoEn).HasColumnName("actualizado_en").HasDefaultValueSql("NOW()");
            e.HasIndex(x => x.Username).IsUnique();
            e.HasIndex(x => x.Email).IsUnique();
        });

        // ── Producto ─────────────────────────────────────────
        mb.Entity<Producto>(e =>
        {
            e.ToTable("productos");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id").UseIdentityAlwaysColumn();
            e.Property(x => x.Nombre).HasColumnName("nombre").HasMaxLength(200);
            e.Property(x => x.Descripcion).HasColumnName("descripcion");
            e.Property(x => x.DescripcionLarga).HasColumnName("descripcion_larga");
            e.Property(x => x.Precio).HasColumnName("precio").HasColumnType("numeric(12,2)");
            e.Property(x => x.ImagenUrl).HasColumnName("imagen_url");
            e.Property(x => x.Activo).HasColumnName("activo").HasDefaultValue(true);
            e.Property(x => x.CreadoEn).HasColumnName("creado_en").HasDefaultValueSql("NOW()");
            e.Property(x => x.ActualizadoEn).HasColumnName("actualizado_en").HasDefaultValueSql("NOW()");
        });

        // ── ProductoImagen ────────────────────────────────────
        mb.Entity<ProductoImagen>(e =>
        {
            e.ToTable("producto_imagenes");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id").UseIdentityAlwaysColumn();
            e.Property(x => x.ProductoId).HasColumnName("producto_id");
            e.Property(x => x.Url).HasColumnName("url");
            e.Property(x => x.Orden).HasColumnName("orden").HasDefaultValue((short)0);
            e.HasOne(x => x.Producto)
             .WithMany(p => p.Imagenes)
             .HasForeignKey(x => x.ProductoId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // ── GaleriaItem ───────────────────────────────────────
        mb.Entity<GaleriaItem>(e =>
        {
            e.ToTable("galeria");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id").UseIdentityAlwaysColumn();
            e.Property(x => x.Url).HasColumnName("url");
            e.Property(x => x.Caption).HasColumnName("caption").HasMaxLength(300);
            e.Property(x => x.Orden).HasColumnName("orden").HasDefaultValue((short)0);
            e.Property(x => x.Activo).HasColumnName("activo").HasDefaultValue(true);
            e.Property(x => x.CreadoEn).HasColumnName("creado_en").HasDefaultValueSql("NOW()");
        });
    }
}