using Hotel.Application.Common.Interfaces;
using Hotel.Application.Features.Reservations.Commands;
using Hotel.Domain.Entities;
using Hotel.Domain.Enums;
using Hotel.Domain.Exceptions;
using Hotel.Domain.Interfaces;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;
using FluentAssertions;

namespace Hotel.UnitTests.Features.Reservations;

public class CancelReservationTests
{
    private readonly Mock<IUnitOfWorkApp> _uowMock = new();
    private readonly Mock<ICurrentUserService> _currentUserMock = new();
    private readonly Mock<ILogger<CancelReservationCommandHandler>> _loggerMock = new();
    private readonly Mock<IReservationRepository> _repoMock = new();

    private CancelReservationCommandHandler CreateHandler()
    {
        _uowMock.Setup(u => u.Reservations).Returns(_repoMock.Object);
        _currentUserMock.Setup(u => u.UserId).Returns("user-1");
        return new CancelReservationCommandHandler(_uowMock.Object, _currentUserMock.Object, _loggerMock.Object);
    }

    private static Reservation MakeReservation(ReservationStatus status) => new()
    {
        Id = "res-1", HotelId = "hotel-1", RoomId = "room-1", GuestId = "guest-1",
        ConfirmationNumber = "HTL-001", CheckInDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(2)),
        CheckOutDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(5)),
        Status = status, Currency = "USD",
        Room = new Room { Number = "101", HotelId = "hotel-1", RoomTypeId = "rt-1" },
        Guest = new Guest { FirstName = "John", LastName = "Doe", Email = "john@test.com", HotelId = "hotel-1" }
    };

    [Fact]
    public async Task Handle_ConfirmedReservation_CancelsSuccessfully()
    {
        var reservation = MakeReservation(ReservationStatus.Confirmed);
        _repoMock.Setup(r => r.GetWithDetailsAsync("res-1", It.IsAny<CancellationToken>()))
            .ReturnsAsync(reservation);
        var handler = CreateHandler();

        var result = await handler.Handle(new CancelReservationCommand("res-1", "Guest request"), CancellationToken.None);

        result.Status.Should().Be("Cancelled");
        reservation.CancellationReason.Should().Be("Guest request");
        reservation.CancelledBy.Should().Be("user-1");
    }

    [Fact]
    public async Task Handle_AlreadyCancelled_ThrowsInvalidReservationStatusException()
    {
        var reservation = MakeReservation(ReservationStatus.Cancelled);
        _repoMock.Setup(r => r.GetWithDetailsAsync("res-1", It.IsAny<CancellationToken>()))
            .ReturnsAsync(reservation);
        var handler = CreateHandler();

        await Assert.ThrowsAsync<InvalidReservationStatusException>(
            () => handler.Handle(new CancelReservationCommand("res-1", "reason"), CancellationToken.None));
    }

    [Fact]
    public async Task Handle_NotFound_ThrowsEntityNotFoundException()
    {
        _repoMock.Setup(r => r.GetWithDetailsAsync("bad-id", It.IsAny<CancellationToken>()))
            .ReturnsAsync((Reservation?)null);
        var handler = CreateHandler();

        await Assert.ThrowsAsync<EntityNotFoundException>(
            () => handler.Handle(new CancelReservationCommand("bad-id", "reason"), CancellationToken.None));
    }
}