using FluentValidation;
using HotelSaaS.API.DTOs.Hotels;

namespace HotelSaaS.API.Validators.Hotels;

public class CreateHotelValidator : AbstractValidator<CreateHotelDto>
{
    public CreateHotelValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Address).NotEmpty().MaximumLength(500);
        RuleFor(x => x.City).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Country).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Email).EmailAddress().When(x => !string.IsNullOrEmpty(x.Email));
    }
}

public class UpdateHotelValidator : AbstractValidator<UpdateHotelDto>
{
    public UpdateHotelValidator()
    {
        Include(new CreateHotelValidator());
    }
}
