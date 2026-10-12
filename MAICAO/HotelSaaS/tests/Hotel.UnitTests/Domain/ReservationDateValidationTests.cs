using Xunit;
using FluentAssertions;
using FluentValidation;
using Hotel.Application.Features.Reservations.Commands;
using Hotel.Application.Features.Reservations.Validators;

namespace Hotel.UnitTests.Domain;

public class ReservationDateValidationTests
{
    private readonly CreateReservationValidator _validator = new();

    [Fact]
    public void Validate_CheckOutBeforeCheckIn_FailsValidation()
    {
        var cmd = new CreateReservationCommand(
            "hotel-1", "room-1", "guest-1", null,
            DateOnly.FromDateTime(DateTime.UtcNow.AddDays(5)),
            DateOnly.FromDateTime(DateTime.UtcNow.AddDays(2)),
            1, 0, 100, 10, 110, "USD", null, null, null);

        var result = _validator.Validate(cmd);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "CheckOutDate");
    }

    [Fact]
    public void Validate_NegativeAmount_FailsValidation()
    {
        var cmd = new CreateReservationCommand(
            "hotel-1", "room-1", "guest-1", null,
            DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1)),
            DateOnly.FromDateTime(DateTime.UtcNow.AddDays(3)),
            1, 0, -100, 10, -90, "USD", null, null, null);

        var result = _validator.Validate(cmd);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "BaseAmount");
    }

    [Fact]
    public void Validate_ValidReservation_PassesValidation()
    {
        var cmd = new CreateReservationCommand(
            "hotel-1", "room-1", "guest-1", null,
            DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1)),
            DateOnly.FromDateTime(DateTime.UtcNow.AddDays(3)),
            2, 1, 200, 20, 220, "USD", "web", null, null);

        var result = _validator.Validate(cmd);
        result.IsValid.Should().BeTrue();
    }
}