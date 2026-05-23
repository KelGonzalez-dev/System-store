using FluentValidation;
using HotelSaaS.API.DTOs.Reservations;

namespace HotelSaaS.API.Validators.Reservations;

public class CreateReservationValidator : AbstractValidator<CreateReservationDto>
{
    public CreateReservationValidator()
    {
        RuleFor(x => x.HotelId).NotEmpty();
        RuleFor(x => x.RoomId).NotEmpty();
        RuleFor(x => x.GuestId).NotEmpty();
        RuleFor(x => x.CheckIn).GreaterThan(DateTime.UtcNow.Date.AddDays(-1));
        RuleFor(x => x.CheckOut).GreaterThan(x => x.CheckIn);
        RuleFor(x => x.Adults).GreaterThan(0);
    }
}

public class CreateGuestValidator : AbstractValidator<CreateGuestDto>
{
    public CreateGuestValidator()
    {
        RuleFor(x => x.FirstName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.LastName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
    }
}
