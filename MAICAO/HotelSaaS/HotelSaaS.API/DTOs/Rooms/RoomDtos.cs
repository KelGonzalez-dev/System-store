using HotelSaaS.API.Common;

namespace HotelSaaS.API.DTOs.Rooms;

public class RoomDto
{
    public Guid Id { get; set; }
    public Guid HotelId { get; set; }
    public string HotelName { get; set; } = string.Empty;
    public Guid RoomTypeId { get; set; }
    public string RoomTypeName { get; set; } = string.Empty;
    public string Number { get; set; } = string.Empty;
    public int Floor { get; set; }
    public string Status { get; set; } = string.Empty;
    public decimal PricePerNight { get; set; }
    public string? Description { get; set; }
    public List<string> Images { get; set; } = new();
    public bool IsActive { get; set; }
}

public class RoomTypeDto
{
    public Guid Id { get; set; }
    public Guid HotelId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int Capacity { get; set; }
    public decimal BasePrice { get; set; }
    public List<string> Amenities { get; set; } = new();
    public List<string> Images { get; set; } = new();
}

public class CreateRoomDto
{
    public Guid HotelId { get; set; }
    public Guid RoomTypeId { get; set; }
    public string Number { get; set; } = string.Empty;
    public int Floor { get; set; }
    public decimal PricePerNight { get; set; }
    public string? Description { get; set; }
}

public class UpdateRoomDto
{
    public Guid RoomTypeId { get; set; }
    public string Number { get; set; } = string.Empty;
    public int Floor { get; set; }
    public RoomStatus Status { get; set; }
    public decimal PricePerNight { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
}

public class CreateRoomTypeDto
{
    public Guid HotelId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int Capacity { get; set; }
    public decimal BasePrice { get; set; }
    public List<string>? Amenities { get; set; }
}

public class RoomFilterDto : DTOs.Common.PaginationQuery
{
    public Guid? HotelId { get; set; }
    public Guid? RoomTypeId { get; set; }
    public RoomStatus? Status { get; set; }
    public bool? IsActive { get; set; }
}

public class RoomAvailabilityDto
{
    public Guid RoomId { get; set; }
    public string Number { get; set; } = string.Empty;
    public bool IsAvailable { get; set; }
    public decimal PricePerNight { get; set; }
}

public class AvailabilityQueryDto
{
    public Guid HotelId { get; set; }
    public DateTime CheckIn { get; set; }
    public DateTime CheckOut { get; set; }
    public Guid? RoomTypeId { get; set; }
}
