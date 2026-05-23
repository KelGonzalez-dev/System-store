using HotelSaaS.API.Data;
using HotelSaaS.API.Entities;
using HotelSaaS.API.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace HotelSaaS.API.Repositories;

public class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _context;

    public UserRepository(ApplicationDbContext context) => _context = context;

    public async Task<User?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        await _context.Users.FirstOrDefaultAsync(u => u.Id == id && !u.IsDeleted, cancellationToken);

    public async Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default) =>
        await _context.Users.FirstOrDefaultAsync(u => u.Email == email.ToLower() && !u.IsDeleted, cancellationToken);

    public async Task<User?> GetByEmailWithRolesAsync(string email, CancellationToken cancellationToken = default) =>
        await _context.Users
            .Include(u => u.UserRoles).ThenInclude(ur => ur.Role).ThenInclude(r => r.RolePermissions).ThenInclude(rp => rp.Permission)
            .FirstOrDefaultAsync(u => u.Email == email.ToLower() && !u.IsDeleted, cancellationToken);

    public async Task<User?> GetByIdWithRolesAsync(Guid id, CancellationToken cancellationToken = default) =>
        await _context.Users
            .Include(u => u.UserRoles).ThenInclude(ur => ur.Role).ThenInclude(r => r.RolePermissions).ThenInclude(rp => rp.Permission)
            .FirstOrDefaultAsync(u => u.Id == id && !u.IsDeleted, cancellationToken);

    public async Task<List<User>> GetAllAsync(CancellationToken cancellationToken = default) =>
        await _context.Users.Where(u => !u.IsDeleted).ToListAsync(cancellationToken);

    public IQueryable<User> Query() =>
        _context.Users
            .Include(u => u.UserRoles).ThenInclude(ur => ur.Role)
            .Where(u => !u.IsDeleted);

    public async Task<User> AddAsync(User user, CancellationToken cancellationToken = default)
    {
        await _context.Users.AddAsync(user, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
        return user;
    }

    public async Task UpdateAsync(User user, CancellationToken cancellationToken = default)
    {
        user.UpdatedAt = DateTime.UtcNow;
        _context.Users.Update(user);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task SoftDeleteAsync(User user, Guid deletedBy, CancellationToken cancellationToken = default)
    {
        user.IsDeleted = true;
        user.DeletedAt = DateTime.UtcNow;
        user.DeletedBy = deletedBy;
        await UpdateAsync(user, cancellationToken);
    }

    public async Task<bool> EmailExistsAsync(string email, Guid? excludeId = null, CancellationToken cancellationToken = default) =>
        await _context.Users.AnyAsync(u =>
            u.Email == email.ToLower() && !u.IsDeleted && (excludeId == null || u.Id != excludeId), cancellationToken);
}
