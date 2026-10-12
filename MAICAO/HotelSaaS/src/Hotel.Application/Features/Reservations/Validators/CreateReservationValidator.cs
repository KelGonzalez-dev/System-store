using FluentValidation;
using Hotel.Application.Features.Reservations.Commands;

namespace Hotel.Application.Features.Reservations.Validators;

public class CreateReservationValidator : AbstractValidator<CreateReservationCommand>
{
    public CreateReservationValidator()
    {
        RuleFor(x => x.HotelId).NotEmpty().WithMessage("HotelId is required.");
        RuleFor(x => x.RoomId).NotEmpty().WithMessage("RoomId is required.");
        RuleFor(x => x.GuestId).NotEmpty().WithMessage("GuestId is required.");
        RuleFor(x => x.CheckInDate).NotEmpty().WithMessage("CheckInDate is required.");
        RuleFor(x => x.CheckOutDate).NotEmpty().WithMessage("CheckOutDate is required.");
        RuleFor(x => x.CheckOutDate).GreaterThan(x => x.CheckInDate)
            .WithMessage("CheckOutDate must be after CheckInDate.");
        RuleFor(x => x.CheckInDate).GreaterThanOrEqualTo(DateOnly.FromDateTime(DateTime.UtcNow))
            .WithMessage("CheckInDate cannot be in the past.");
        RuleFor(x => x.Adults).InclusiveBetween(1, 20).WithMessage("Adults must be between 1 and 20.");
        RuleFor(x => x.Children).InclusiveBetween(0, 10).WithMessage("Children must be between 0 and 10.");
        RuleFor(x => x.BaseAmount).GreaterThan(0).WithMessage("BaseAmount must be positive.");
        RuleFor(x => x.TaxAmount).GreaterThanOrEqualTo(0).WithMessage("TaxAmount cannot be negative.");
        RuleFor(x => x.TotalAmount).GreaterThan(0).WithMessage("TotalAmount must be positive.");
        RuleFor(x => x.Currency).Length(3).WithMessage("Currency must be a 3-letter ISO code.");
    }
}