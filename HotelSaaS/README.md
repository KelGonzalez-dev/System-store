# Hotel SaaS API — Enterprise .NET 9 Backend

Multi-tenant SaaS hotel management REST API built with:
- ASP.NET Core 9 + Clean Architecture
- CQRS + MediatR
- PostgreSQL + EF Core + GIST exclusion constraints
- Redis distributed cache
- JWT Authentication with refresh tokens
- FluentValidation + Serilog + Swagger

## Quick Start

### Option A — Docker (recommended)

```bash
# 1. Clone and navigate
cd HotelSaaS

# 2. Start everything
docker compose up -d

# 3. Swagger UI
open http://localhost:8080
```

### Option B — Local development

**Prerequisites:** .NET 9 SDK, PostgreSQL 16, Redis

```bash
# 1. Start PostgreSQL + Redis via Docker
docker compose up -d postgres redis

# 2. Run DB schema + seed
psql -U hotel_user -d hotel_saas -f scripts/db/01_schemas.sql

# 3. Restore and run
cd src/Hotel.Api
dotnet restore ../../HotelSaaS.sln
dotnet run

# 4. Swagger UI at
open http://localhost:5000
```

## Authentication

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "superadmin@hotelsaas.io",
  "password": "Admin1234!"
}
```

Response includes `accessToken` and `refreshToken`. Use:
```
Authorization: Bearer <accessToken>
```

## Key Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/v1/auth/login | Login |
| POST | /api/v1/auth/refresh-token | Refresh JWT |
| GET | /api/v1/reservations/availability | Check availability |
| POST | /api/v1/reservations | Create reservation (via DB function) |
| POST | /api/v1/reservations/{id}/check-in | Check in |
| POST | /api/v1/reservations/{id}/check-out | Check out |
| POST | /api/v1/reservations/{id}/cancel | Cancel |
| GET/POST/PUT | /api/v1/rooms | Room CRUD |
| GET/POST/PUT | /api/v1/guests | Guest CRUD + search |
| POST | /api/v1/payments | Register payment (idempotent) |
| POST | /api/v1/payments/{id}/refund | Refund |
| POST | /api/v1/holds | Create hold |
| POST | /api/v1/holds/{id}/convert | Convert to reservation |
| GET | /api/v1/audit | Audit logs |
| POST | /api/v1/cache/availability/rebuild | Rebuild cache |
| GET | /health | Health check |

## Run Tests

```bash
# Unit tests
dotnet test tests/Hotel.UnitTests/

# Integration tests (requires DB)
docker compose up -d postgres redis
dotnet test tests/Hotel.IntegrationTests/
```

## Architecture

```
Hotel.Api           → Controllers, Middleware, DI wiring
Hotel.Application   → CQRS Commands/Queries, Validators, Interfaces
Hotel.Domain        → Entities, Enums, Exceptions, Repository contracts
Hotel.Infrastructure→ EF Core, Repositories, UoW, JWT, Redis, BCrypt
Hotel.Shared        → DTOs, Constants, shared models
```

## Multi-tenancy
Every entity has `hotel_id`. PostgreSQL Row Level Security (RLS) is
applied at the DB level. The API enforces tenant isolation via the
`ICurrentUserService.HotelId` claim on all write operations.

## DB Functions Called
- `booking.fn_create_reservation(...)` — creates reservation (no duplicate logic in C#)
- `booking.fn_is_room_available(...)` — used in room availability query
- `cache.fn_rebuild_availability(...)` — triggers cache rebuild