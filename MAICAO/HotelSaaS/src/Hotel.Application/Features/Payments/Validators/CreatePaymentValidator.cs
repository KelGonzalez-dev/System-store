using FluentValidation;
using Hotel.Application.Features.Payments.Commands;

namespace Hotel.Application.Features.Payments.Validators;

public class CreatePaymentValidator : AbstractValidator<CreatePaymentCommand>
{
    public CreatePaymentValidator()
    {
        RuleFor(x => x.ReservationId).NotEmpty();
        RuleFor(x => x.HotelId).NotEmpty();
        RuleFor(x => x.Amount).GreaterThan(0).WithMessage("Amount must be positive.");
        RuleFor(x => x.Currency).Length(3).WithMessage("Currency must be 3 characters.");
        RuleFor(x => x.IdempotencyKey).NotEmpty().MaximumLength(100);
    }
}