using FluentValidation;
using Hotel.Application.Common.Behaviors;
using Hotel.Application.Common.Interfaces;
using Hotel.Infrastructure.Caching;
using Hotel.Infrastructure.Persistence;
using Hotel.Infrastructure.Persistence.Repositories;
using Hotel.Infrastructure.Security;
using Hotel.Infrastructure.Services;
using Hotel.Domain.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using StackExchange.Redis;
using System.Text;
using System.Threading.RateLimiting;

namespace Hotel.Api.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        var assembly = typeof(Hotel.Application.Features.Auth.Commands.LoginCommand).Assembly;
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(assembly));
        services.AddValidatorsFromAssembly(assembly);
        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(LoggingBehavior<,>));
        return services;
    }

    public static IServiceCollection AddInfrastructureServices(
        this IServiceCollection services, IConfiguration config)
    {
        // Database
        services.AddDbContext<HotelDbContext>(opts =>
            opts.UseNpgsql(config.GetConnectionString("DefaultConnection"),
                npg => npg.MigrationsAssembly(typeof(HotelDbContext).Assembly.FullName)));

        // Unit of Work
        services.AddScoped<IUnitOfWorkApp, UnitOfWork>();

        // Domain services via UoW (individual repos accessible through UoW)
        services.AddScoped<Hotel.Domain.Interfaces.IUserRepository>(sp =>
            new UserRepository(sp.GetRequiredService<HotelDbContext>()));

        // Security
        services.AddSingleton<ITokenService, TokenService>();
        services.AddSingleton<IPasswordService, PasswordService>();
        services.AddHttpContextAccessor();
        services.AddScoped<ICurrentUserService, CurrentUserService>();

        // Redis
        var redisConn = config.GetConnectionString("Redis") ?? "localhost:6379";
        services.AddSingleton<IConnectionMultiplexer>(ConnectionMultiplexer.Connect(redisConn));
        services.AddStackExchangeRedisCache(opts => opts.Configuration = redisConn);
        services.AddScoped<ICacheService, RedisCacheService>();

        return services;
    }

    public static IServiceCollection AddJwtAuthentication(
        this IServiceCollection services, IConfiguration config)
    {
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(opts =>
            {
                opts.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = config["Jwt:Issuer"],
                    ValidAudience = config["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(config["Jwt:Secret"]!)),
                    ClockSkew = TimeSpan.Zero
                };

                opts.Events = new JwtBearerEvents
                {
                    OnAuthenticationFailed = ctx =>
                    {
                        if (ctx.Exception is Microsoft.IdentityModel.Tokens.SecurityTokenExpiredException)
                            ctx.Response.Headers["Token-Expired"] = "true";
                        return Task.CompletedTask;
                    }
                };
            });

        services.AddAuthorization(opts =>
        {
            opts.AddPolicy("AdminOnly", p => p.RequireRole("Admin", "SuperAdmin"));
            opts.AddPolicy("SuperAdminOnly", p => p.RequireRole("SuperAdmin"));
            opts.AddPolicy("AnyAuthenticated", p => p.RequireAuthenticatedUser());
        });

        return services;
    }

    public static IServiceCollection AddSwaggerDocumentation(this IServiceCollection services)
    {
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "Hotel SaaS API",
                Version = "v1",
                Description = "Enterprise Hotel Management SaaS REST API — Multi-tenant, CQRS, Clean Architecture",
                Contact = new OpenApiContact { Name = "Hotel SaaS", Email = "api@hotelsaas.io" }
            });

            c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                In = ParameterLocation.Header,
                Description = "JWT Bearer token. Format: Bearer {token}",
                Name = "Authorization",
                Type = SecuritySchemeType.ApiKey,
                Scheme = "Bearer"
            });

            c.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
                    },
                    Array.Empty<string>()
                }
            });

            var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
            var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
            if (File.Exists(xmlPath)) c.IncludeXmlComments(xmlPath);
        });

        return services;
    }

    public static IServiceCollection AddRateLimitingPolicies(this IServiceCollection services)
    {
        services.AddRateLimiter(opts =>
        {
            opts.AddFixedWindowLimiter("auth", limiterOpts =>
            {
                limiterOpts.PermitLimit = 10;
                limiterOpts.Window = TimeSpan.FromMinutes(1);
                limiterOpts.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
                limiterOpts.QueueLimit = 0;
            });

            opts.AddFixedWindowLimiter("api", limiterOpts =>
            {
                limiterOpts.PermitLimit = 300;
                limiterOpts.Window = TimeSpan.FromMinutes(1);
                limiterOpts.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
                limiterOpts.QueueLimit = 5;
            });

            opts.RejectionStatusCode = 429;
        });

        return services;
    }

    public static IServiceCollection AddSecurityHeaders(this IServiceCollection services)
    {
        services.AddAntiforgery();
        services.AddCors(opts =>
        {
            opts.AddPolicy("DefaultPolicy", policy =>
                policy.WithOrigins("http://localhost:3000", "https://app.hotelsaas.io")
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials());
        });
        return services;
    }
}