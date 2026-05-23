using Hotel.Application.Common.Interfaces;
using Hotel.Application.Features.Auth.Commands;
using Hotel.Domain.Entities;
using Hotel.Domain.Enums;
using Hotel.Domain.Interfaces;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;
using FluentAssertions;

namespace Hotel.UnitTests.Features.Auth;

public class LoginCommandHandlerTests
{
    private readonly Mock<IUnitOfWorkApp> _uowMock = new();
    private readonly Mock<ITokenService> _tokenMock = new();
    private readonly Mock<IPasswordService> _passwordMock = new();
    private readonly Mock<ILogger<LoginCommandHandler>> _loggerMock = new();
    private readonly Mock<IUserRepository> _userRepoMock = new();

    private LoginCommandHandler CreateHandler()
    {
        _uowMock.Setup(u => u.Users).Returns(_userRepoMock.Object);
        return new LoginCommandHandler(_uowMock.Object, _tokenMock.Object, _passwordMock.Object, _loggerMock.Object);
    }

    [Fact]
    public async Task Handle_ValidCredentials_ReturnsLoginResponse()
    {
        // Arrange
        var user = new User
        {
            Id = "01USER001",
            Email = "test@hotel.com",
            PasswordHash = "hashed_password",
            FirstName = "John",
            LastName = "Doe",
            Role = UserRole.Admin,
            Status = UserStatus.Active,
            HotelId = "01HOTEL001"
        };

        _userRepoMock.Setup(r => r.GetByEmailAsync("test@hotel.com", It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);
        _passwordMock.Setup(p => p.Verify("Password123!", "hashed_password")).Returns(true);
        _tokenMock.Setup(t => t.GenerateAccessToken(user))
            .Returns(("jwt_token", DateTime.UtcNow.AddHours(1)));
        _tokenMock.Setup(t => t.GenerateRefreshToken()).Returns("refresh_token");

        var handler = CreateHandler();
        var command = new LoginCommand("test@hotel.com", "Password123!");

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.AccessToken.Should().Be("jwt_token");
        result.RefreshToken.Should().Be("refresh_token");
        result.User.Email.Should().Be("test@hotel.com");
        result.User.Role.Should().Be("Admin");
    }

    [Fact]
    public async Task Handle_UserNotFound_ThrowsEntityNotFoundException()
    {
        // Arrange
        _userRepoMock.Setup(r => r.GetByEmailAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((User?)null);
        var handler = CreateHandler();

        // Act & Assert
        await Assert.ThrowsAsync<Hotel.Domain.Exceptions.EntityNotFoundException>(
            () => handler.Handle(new LoginCommand("noone@hotel.com", "pass"), CancellationToken.None));
    }

    [Fact]
    public async Task Handle_WrongPassword_ThrowsUnauthorizedAccessException()
    {
        // Arrange
        var user = new User
        {
            Id = "01USER001", Email = "test@hotel.com", PasswordHash = "hashed",
            FirstName = "John", LastName = "Doe", Role = UserRole.Staff, Status = UserStatus.Active
        };
        _userRepoMock.Setup(r => r.GetByEmailAsync("test@hotel.com", It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);
        _passwordMock.Setup(p => p.Verify(It.IsAny<string>(), It.IsAny<string>())).Returns(false);
        var handler = CreateHandler();

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(
            () => handler.Handle(new LoginCommand("test@hotel.com", "wrong"), CancellationToken.None));
    }

    [Fact]
    public async Task Handle_LockedAccount_ThrowsUnauthorizedAccessException()
    {
        // Arrange
        var user = new User
        {
            Id = "01USER001", Email = "test@hotel.com", PasswordHash = "hashed",
            FirstName = "John", LastName = "Doe", Role = UserRole.Staff, Status = UserStatus.Active,
            LockedUntil = DateTime.UtcNow.AddMinutes(10)
        };
        _userRepoMock.Setup(r => r.GetByEmailAsync("test@hotel.com", It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);
        var handler = CreateHandler();

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(
            () => handler.Handle(new LoginCommand("test@hotel.com", "pass"), CancellationToken.None));
    }
}