using FluentValidation;
using Hotel.Application.Features.Guests.Commands;

namespace Hotel.Application.Features.Guests.Validators;

public class CreateGuestValidator : AbstractValidator<CreateGuestCommand>
{
    public CreateGuestValidator()
    {
        RuleFor(x => x.HotelId).NotEmpty();
        RuleFor(x => x.FirstName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.LastName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Email).NotEmpty().EmailAddress().MaximumLength(255);
        RuleFor(x => x.Phone).MaximumLength(30).When(x => x.Phone != null);
        RuleFor(x => x.DateOfBirth).LessThan(DateOnly.FromDateTime(DateTime.UtcNow))
            .WithMessage("Date of birth must be in the past.")
            .When(x => x.DateOfBirth.HasValue);
    }
}