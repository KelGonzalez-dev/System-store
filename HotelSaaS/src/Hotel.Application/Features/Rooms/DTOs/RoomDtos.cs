using Hotel.Domain.Enums;
namespace Hotel.Application.Features.Rooms.DTOs;
public record CreateRoomRequest(string HotelId, string RoomTypeId, string Number, int Floor, string? Notes);
public record UpdateRoomRequest(string? Number, int? Floor, RoomStatus? Status, string? Notes, string? MaintenanceReason, string? HousekeepingStatus);
public record RoomDto(string Id, string HotelId, string RoomTypeId, string RoomTypeName, string Number, int Floor, string Status, bool IsActive, string? Notes, string? MaintenanceReason, string? HousekeepingStatus, DateTime? LastCleanedAt, DateTime CreatedAt, DateTime UpdatedAt);
public record CreateRoomTypeRequest(string HotelId, string Name, string? Description, int MaxOccupancy, int MaxAdults, int MaxChildren, decimal BasePrice, decimal? WeekendPrice, int SizeM2, string BedConfiguration, List<string> Amenities);
public record UpdateRoomTypeRequest(string? Name, string? Description, int? MaxOccupancy, int? MaxAdults, int? MaxChildren, decimal? BasePrice, decimal? WeekendPrice, int? SizeM2, string? BedConfiguration, List<string>? Amenities, bool? IsActive);
public record RoomTypeDto(string Id, string HotelId, string Name, string? Description, int MaxOccupancy, int MaxAdults, int MaxChildren, decimal BasePrice, decimal? WeekendPrice, int SizeM2, string BedConfiguration, List<string> Amenities, bool IsActive, DateTime CreatedAt);