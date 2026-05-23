using Hotel.Application.Common.Interfaces;
using Hotel.Application.Features.Guests.DTOs;
using Hotel.Domain.Entities;
using Hotel.Domain.Enums;
using MediatR;

namespace Hotel.Application.Features.Guests.Commands;

public record CreateGuestCommand(string HotelId, string FirstName, string LastName, string Email,
    string? Phone, string? CountryCode, DocumentType DocumentType, string? DocumentNumber,
    DateOnly? DateOfBirth, string? Nationality, string? Address, string? City,
    string? Notes, bool MarketingOptIn) : IRequest<GuestDto>;

public class CreateGuestCommandHandler : IRequestHandler<CreateGuestCommand, GuestDto>
{
    private readonly IUnitOfWorkApp _uow;
    public CreateGuestCommandHandler(IUnitOfWorkApp uow) { _uow = uow; }

    public async Task<GuestDto> Handle(CreateGuestCommand req, CancellationToken ct)
    {
        var guest = new Guest
        {
            Id = Ulid.NewUlid().ToString(),
            HotelId = req.HotelId,
            FirstName = req.FirstName,
            LastName = req.LastName,
            Email = req.Email,
            Phone = req.Phone,
            CountryCode = req.CountryCode,
            DocumentType = req.DocumentType,
            DocumentNumber = req.DocumentNumber,
            DateOfBirth = req.DateOfBirth,
            Nationality = req.Nationality,
            Address = req.Address,
            City = req.City,
            Notes = req.Notes,
            MarketingOptIn = req.MarketingOptIn,
            Status = GuestStatus.Active,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _uow.Guests.AddAsync(guest, ct);
        await _uow.SaveChangesAsync(ct);

        return MapToDto(guest);
    }

    public static GuestDto MapToDto(Guest g) => new(
        g.Id, g.HotelId, g.FirstName, g.LastName, $"{g.FirstName} {g.LastName}",
        g.Email, g.Phone, g.CountryCode, g.DocumentType.ToString(), g.DocumentNumber,
        g.DateOfBirth, g.Nationality, g.Address, g.City, g.Notes,
        g.Status.ToString(), g.TotalStays, g.TotalSpent, g.LoyaltyLevel,
        g.MarketingOptIn, g.CreatedAt, g.UpdatedAt);
}