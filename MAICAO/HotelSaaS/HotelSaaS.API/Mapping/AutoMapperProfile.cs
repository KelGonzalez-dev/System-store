using System.Text.Json;
using AutoMapper;
using HotelSaaS.API.DTOs.Auth;
using HotelSaaS.API.DTOs.Hotels;
using HotelSaaS.API.DTOs.Payments;
using HotelSaaS.API.DTOs.Reservations;
using HotelSaaS.API.DTOs.Rooms;
using HotelSaaS.API.DTOs.Users;
using HotelSaaS.API.Entities;

namespace HotelSaaS.API.Mapping;

public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        CreateMap<User, UserDto>()
            .ForMember(d => d.Roles, o => o.MapFrom(s => s.UserRoles.Select(ur => ur.Role.Name).ToList()));

        CreateMap<User, UserProfileDto>()
            .ForMember(d => d.Roles, o => o.MapFrom(s => s.UserRoles.Select(ur => ur.Role.Name).ToList()));

        CreateMap<CreateUserDto, User>()
            .ForMember(d => d.Email, o => o.MapFrom(s => s.Email.ToLower()));

        CreateMap<RegisterDto, User>()
            .ForMember(d => d.Email, o => o.MapFrom(s => s.Email.ToLower()));

        CreateMap<Role, RoleDto>()
            .ForMember(d => d.Permissions, o => o.MapFrom(s => s.RolePermissions.Select(rp => rp.Permission.Name).ToList()));

        CreateMap<Permission, PermissionDto>();

        CreateMap<Hotel, HotelDto>()
            .ForMember(d => d.Images, o => o.MapFrom(s => DeserializeList(s.Images)))
            .ForMember(d => d.Amenities, o => o.MapFrom(s => DeserializeList(s.Amenities)))
            .ForMember(d => d.CheckInTime, o => o.MapFrom(s => s.CheckInTime.ToString(@"hh\:mm")))
            .ForMember(d => d.CheckOutTime, o => o.MapFrom(s => s.CheckOutTime.ToString(@"hh\:mm")));

        CreateMap<CreateHotelDto, Hotel>()
            .ForMember(d => d.CheckInTime, o => o.MapFrom(s => TimeSpan.Parse(s.CheckInTime)))
            .ForMember(d => d.CheckOutTime, o => o.MapFrom(s => TimeSpan.Parse(s.CheckOutTime)))
            .ForMember(d => d.Amenities, o => o.MapFrom(s => SerializeList(s.Amenities)));

        CreateMap<UpdateHotelDto, Hotel>()
            .ForMember(d => d.CheckInTime, o => o.MapFrom(s => TimeSpan.Parse(s.CheckInTime)))
            .ForMember(d => d.CheckOutTime, o => o.MapFrom(s => TimeSpan.Parse(s.CheckOutTime)))
            .ForMember(d => d.Amenities, o => o.MapFrom(s => SerializeList(s.Amenities)));

        CreateMap<Room, RoomDto>()
            .ForMember(d => d.HotelName, o => o.MapFrom(s => s.Hotel.Name))
            .ForMember(d => d.RoomTypeName, o => o.MapFrom(s => s.RoomType.Name))
            .ForMember(d => d.Status, o => o.MapFrom(s => s.Status.ToString()))
            .ForMember(d => d.Images, o => o.MapFrom(s => DeserializeList(s.Images)));

        CreateMap<RoomType, RoomTypeDto>()
            .ForMember(d => d.Amenities, o => o.MapFrom(s => DeserializeList(s.Amenities)))
            .ForMember(d => d.Images, o => o.MapFrom(s => DeserializeList(s.Images)));

        CreateMap<Reservation, ReservationDto>()
            .ForMember(d => d.HotelName, o => o.MapFrom(s => s.Hotel.Name))
            .ForMember(d => d.RoomNumber, o => o.MapFrom(s => s.Room.Number))
            .ForMember(d => d.GuestName, o => o.MapFrom(s => $"{s.Guest.FirstName} {s.Guest.LastName}"))
            .ForMember(d => d.Status, o => o.MapFrom(s => s.Status.ToString()));

        CreateMap<Guest, GuestDto>();
        CreateMap<CreateGuestDto, Guest>();

        CreateMap<Payment, PaymentDto>()
            .ForMember(d => d.ReservationCode, o => o.MapFrom(s => s.Reservation.Code))
            .ForMember(d => d.Method, o => o.MapFrom(s => s.Method.ToString()))
            .ForMember(d => d.Status, o => o.MapFrom(s => s.Status.ToString()));

        CreateMap<Invoice, InvoiceDto>()
            .ForMember(d => d.Status, o => o.MapFrom(s => s.Status.ToString()));

        CreateMap<AuditLog, AuditLogDto>()
            .ForMember(d => d.UserEmail, o => o.MapFrom(s => s.User != null ? s.User.Email : null));
    }

    private static List<string> DeserializeList(string? json) =>
        string.IsNullOrEmpty(json) ? new List<string>() : JsonSerializer.Deserialize<List<string>>(json) ?? new List<string>();

    private static string? SerializeList(List<string>? list) =>
        list == null || list.Count == 0 ? null : JsonSerializer.Serialize(list);
}
