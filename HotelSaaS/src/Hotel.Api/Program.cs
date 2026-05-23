using Hotel.Api.Extensions;
using Hotel.Api.Middleware;
using Microsoft.AspNetCore.RateLimiting;
using Serilog;
using Serilog.Events;

var builder = WebApplication.CreateBuilder(args);

// ── Serilog ───────────────────────────────────────────────────────────────────
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
    .MinimumLevel.Override("Microsoft.EntityFrameworkCore.Database.Command", LogEventLevel.Warning)
    .Enrich.FromLogContext()
    .Enrich.WithMachineName()
    .Enrich.WithEnvironmentName()
    .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {CorrelationId} {Message:lj}{NewLine}{Exception}")
    .WriteTo.File("logs/hotel-api-.log",
        rollingInterval: RollingInterval.Day,
        retainedFileCountLimit: 30,
        outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {CorrelationId} {Message:lj}{NewLine}{Exception}")
    .CreateLogger();

builder.Host.UseSerilog();

// ── Services ─────────────────────────────────────────────────────────────────
builder.Services.AddControllers()
    .AddJsonOptions(opts =>
    {
        opts.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        opts.JsonSerializerOptions.DefaultIgnoreCondition =
            System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
        opts.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    });

builder.Services.AddEndpointsApiExplorer();

// Application
builder.Services.AddApplicationServices();

// Infrastructure (DB, Redis, Security)
builder.Services.AddInfrastructureServices(builder.Configuration);

// JWT Auth
builder.Services.AddJwtAuthentication(builder.Configuration);

// Swagger
builder.Services.AddSwaggerDocumentation();

// Rate Limiting
builder.Services.AddRateLimitingPolicies();

// CORS + Security Headers
builder.Services.AddSecurityHeaders();

// Health Checks
builder.Services.AddHealthChecks()
    .AddNpgSql(builder.Configuration.GetConnectionString("DefaultConnection")!, name: "postgresql")
    .AddRedis(builder.Configuration.GetConnectionString("Redis") ?? "localhost:6379", name: "redis");

builder.Services.AddResponseCompression(opts => opts.EnableForHttps = true);

// ── App Pipeline ─────────────────────────────────────────────────────────────
var app = builder.Build();

app.UseResponseCompression();
app.UseMiddleware<CorrelationIdMiddleware>();
app.UseMiddleware<GlobalExceptionMiddleware>();

if (app.Environment.IsDevelopment() || app.Environment.IsStaging())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Hotel SaaS API v1");
        c.RoutePrefix = string.Empty; // Swagger at root
        c.DisplayRequestDuration();
    });
}

app.UseHttpsRedirection();

// Security headers
app.Use(async (ctx, next) =>
{
    ctx.Response.Headers["X-Content-Type-Options"] = "nosniff";
    ctx.Response.Headers["X-Frame-Options"] = "DENY";
    ctx.Response.Headers["X-XSS-Protection"] = "1; mode=block";
    ctx.Response.Headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
    ctx.Response.Headers["Permissions-Policy"] = "geolocation=(), microphone=()";
    await next();
});

app.UseCors("DefaultPolicy");
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();
app.UseMiddleware<AuditMiddleware>();

app.MapControllers();
app.MapHealthChecks("/health");

// Warm-up DB on start
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<Hotel.Infrastructure.Persistence.HotelDbContext>();
    await db.Database.CanConnectAsync();
    Log.Information("Database connection verified.");
}

Log.Information("Hotel SaaS API started. Environment: {Env}", app.Environment.EnvironmentName);

try
{
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly.");
}
finally
{
    Log.CloseAndFlush();
}