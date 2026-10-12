using HotelSaaS.API.Common;

namespace HotelSaaS.API.DTOs.Reservations;

public class ReservationDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public Guid HotelId { get; set; }
    public string HotelName { get; set; } = string.Empty;
    public Guid RoomId { get; set; }
    public string RoomNumber { get; set; } = string.Empty;
    public Guid GuestId { get; set; }
    public string GuestName { get; set; } = string.Empty;
    public DateTime CheckIn { get; set; }
    public DateTime CheckOut { get; set; }
    public string Status { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public int Adults { get; set; }
    public int Children { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateReservationDto
{
    public Guid HotelId { get; set; }
    public Guid RoomId { get; set; }
    public Guid GuestId { get; set; }
    public DateTime CheckIn { get; set; }
    public DateTime CheckOut { get; set; }
    public int Adults { get; set; } = 1;
    public int Children { get; set; }
    public string? Notes { get; set; }
}

public class CreateGuestDto
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? DocumentType { get; set; }
    public string? DocumentNumber { get; set; }
    public string? Nationality { get; set; }
}

public class GuestDto
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? DocumentType { get; set; }
    public string? DocumentNumber { get; set; }
    public string? Nationality { get; set; }
}

public class ReservationFilterDto : DTOs.Common.PaginationQuery
{
    public Guid? HotelId { get; set; }
    public Guid? GuestId { get; set; }
    public ReservationStatus? Status { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
}

public class CancelReservationDto
{
    public string? Reason { get; set; }
}
