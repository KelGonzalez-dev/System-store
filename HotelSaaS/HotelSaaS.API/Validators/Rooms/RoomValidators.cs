using FluentValidation;
using HotelSaaS.API.DTOs.Rooms;

namespace HotelSaaS.API.Validators.Rooms;

public class CreateRoomValidator : AbstractValidator<CreateRoomDto>
{
    public CreateRoomValidator()
    {
        RuleFor(x => x.HotelId).NotEmpty();
        RuleFor(x => x.RoomTypeId).NotEmpty();
        RuleFor(x => x.Number).NotEmpty().MaximumLength(20);
        RuleFor(x => x.PricePerNight).GreaterThan(0);
    }
}

public class CreateRoomTypeValidator : AbstractValidator<CreateRoomTypeDto>
{
    public CreateRoomTypeValidator()
    {
        RuleFor(x => x.HotelId).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Capacity).GreaterThan(0);
        RuleFor(x => x.BasePrice).GreaterThan(0);
    }
}
