using FluentValidation;
using Hotel.Application.Features.Holds.Commands;

namespace Hotel.Application.Features.Holds.Validators;

public class CreateHoldValidator : AbstractValidator<CreateHoldCommand>
{
    public CreateHoldValidator()
    {
        RuleFor(x => x.HotelId).NotEmpty();
        RuleFor(x => x.RoomId).NotEmpty();
        RuleFor(x => x.CheckInDate).NotEmpty();
        RuleFor(x => x.CheckOutDate).GreaterThan(x => x.CheckInDate)
            .WithMessage("CheckOutDate must be after CheckInDate.");
        RuleFor(x => x.ExpiryMinutes).InclusiveBetween(5, 240)
            .WithMessage("Expiry must be between 5 and 240 minutes.");
    }
}