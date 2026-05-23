using Hotel.Domain.Entities;
using Hotel.Domain.Interfaces;
using Hotel.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Hotel.Infrastructure.Persistence.Repositories;

public class UserRepository : BaseRepository<User>, IUserRepository
{
    public UserRepository(HotelDbContext ctx) : base(ctx) { }

    public async Task<User?> GetByEmailAsync(string email, CancellationToken ct = default)
        => await _ctx.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower(), ct);

    public async Task<User?> GetByRefreshTokenAsync(string refreshToken, CancellationToken ct = default)
        => await _ctx.Users.FirstOrDefaultAsync(u => u.RefreshToken == refreshToken, ct);
}