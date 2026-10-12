namespace HotelSaaS.API.Common;

public enum RoomStatus
{
    Available = 0,
    Occupied = 1,
    Cleaning = 2,
    Maintenance = 3
}

public enum ReservationStatus
{
    Pending = 0,
    Confirmed = 1,
    CheckedIn = 2,
    CheckedOut = 3,
    Cancelled = 4,
    NoShow = 5
}

public enum PaymentStatus
{
    Pending = 0,
    Completed = 1,
    Failed = 2,
    Refunded = 3,
    PartiallyRefunded = 4
}

public enum PaymentMethod
{
    Cash = 0,
    CreditCard = 1,
    DebitCard = 2,
    BankTransfer = 3,
    Stripe = 4
}

public enum InvoiceStatus
{
    Draft = 0,
    Issued = 1,
    Paid = 2,
    Cancelled = 3
}

public enum MaintenanceStatus
{
    Scheduled = 0,
    InProgress = 1,
    Completed = 2,
    Cancelled = 3
}

public enum NotificationType
{
    Info = 0,
    Warning = 1,
    Success = 2,
    Error = 3,
    Reservation = 4,
    Payment = 5
}

public static class RoleNames
{
    public const string SuperAdmin = "SuperAdmin";
    public const string Admin = "Admin";
    public const string Manager = "Manager";
    public const string Receptionist = "Receptionist";
    public const string Guest = "Guest";
}

public static class PolicyNames
{
    public const string SuperAdminOnly = "SuperAdminOnly";
    public const string AdminOrAbove = "AdminOrAbove";
    public const string ManagerOrAbove = "ManagerOrAbove";
    public const string StaffOnly = "StaffOnly";
    public const string AllAuthenticated = "AllAuthenticated";
}
