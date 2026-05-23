namespace Hotel.Shared.Constants;

public static class AppConstants
{
    public static class Auth
    {
        public const string SuperAdmin = "SuperAdmin";
        public const string Admin = "Admin";
        public const string Staff = "Staff";
        public const int AccessTokenExpiryMinutes = 60;
        public const int RefreshTokenExpiryDays = 30;
        public const int MaxFailedLoginAttempts = 5;
        public const int LockoutMinutes = 15;
    }

    public static class Cache
    {
        public const string AvailabilityPrefix = "availability:";
        public const string RoomPrefix = "room:";
        public const string HotelPrefix = "hotel:";
        public const int DefaultExpiryMinutes = 30;
        public const int AvailabilityExpiryMinutes = 5;
    }

    public static class Pagination
    {
        public const int DefaultPage = 1;
        public const int DefaultPageSize = 20;
        public const int MaxPageSize = 100;
    }

    public static class Hold
    {
        public const int DefaultExpiryMinutes = 30;
    }

    public static class Headers
    {
        public const string CorrelationId = "X-Correlation-Id";
        public const string TraceId = "X-Trace-Id";
        public const string TenantId = "X-Tenant-Id";
        public const string IdempotencyKey = "Idempotency-Key";
    }
}
