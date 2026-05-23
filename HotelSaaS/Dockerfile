# ─── Build Stage ─────────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj and restore as distinct layers
COPY ["src/Hotel.Api/Hotel.Api.csproj", "src/Hotel.Api/"]
COPY ["src/Hotel.Application/Hotel.Application.csproj", "src/Hotel.Application/"]
COPY ["src/Hotel.Domain/Hotel.Domain.csproj", "src/Hotel.Domain/"]
COPY ["src/Hotel.Infrastructure/Hotel.Infrastructure.csproj", "src/Hotel.Infrastructure/"]
COPY ["src/Hotel.Shared/Hotel.Shared.csproj", "src/Hotel.Shared/"]

RUN dotnet restore "src/Hotel.Api/Hotel.Api.csproj"

# Copy all source
COPY . .

# Build & Publish
RUN dotnet publish "src/Hotel.Api/Hotel.Api.csproj" \
    -c Release \
    -o /app/publish \
    --no-restore \
    /p:UseAppHost=false

# ─── Runtime Stage ────────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

# Security: run as non-root
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser
USER appuser

# Copy published output
COPY --from=build --chown=appuser:appgroup /app/publish .

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

EXPOSE 8080
EXPOSE 8443

ENTRYPOINT ["dotnet", "Hotel.Api.dll"]