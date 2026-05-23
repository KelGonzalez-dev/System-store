namespace HotelSaaS.API.Entities;

public class User : AuditEntity
{
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? AvatarUrl { get; set; }
    public bool IsActive { get; set; } = true;
    public bool EmailVerified { get; set; }
    public string? EmailVerificationToken { get; set; }
    public DateTime? EmailVerificationExpiry { get; set; }
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiry { get; set; }
    public string? PasswordResetToken { get; set; }
    public DateTime? PasswordResetExpiry { get; set; }

    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    public ICollection<Staff> StaffMembers { get; set; } = new List<Staff>();
    public ICollection<AuditLog> AuditLogs { get; set; } = new List<AuditLog>();
    public ICollection<UserHotel> UserHotels { get; set; } = new List<UserHotel>();
}

public class UserRole
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public Guid RoleId { get; set; }
    public Role Role { get; set; } = null!;
}

public class UserHotel
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public Guid HotelId { get; set; }
    public Hotel Hotel { get; set; } = null!;
}
