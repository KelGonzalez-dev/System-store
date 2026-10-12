using Hotel.Application.Common.Interfaces;
using Hotel.Application.Features.Guests.DTOs;
using Hotel.Domain.Enums;
using Hotel.Domain.Exceptions;
using MediatR;

namespace Hotel.Application.Features.Guests.Commands;

public record UpdateGuestCommand(string Id, string? FirstName, string? LastName, string? Email,
    string? Phone, string? CountryCode, DocumentType? DocumentType, string? DocumentNumber,
    DateOnly? DateOfBirth, string? Nationality, string? Address, string? City,
    string? Notes, bool? MarketingOptIn) : IRequest<GuestDto>;

public class UpdateGuestCommandHandler : IRequestHandler<UpdateGuestCommand, GuestDto>
{
    private readonly IUnitOfWorkApp _uow;
    public UpdateGuestCommandHandler(IUnitOfWorkApp uow) { _uow = uow; }

    public async Task<GuestDto> Handle(UpdateGuestCommand req, CancellationToken ct)
    {
        var g = await _uow.Guests.GetByIdAsync(req.Id, ct)
            ?? throw new EntityNotFoundException("Guest", req.Id);

        if (req.FirstName != null) g.FirstName = req.FirstName;
        if (req.LastName != null) g.LastName = req.LastName;
        if (req.Email != null) g.Email = req.Email;
        if (req.Phone != null) g.Phone = req.Phone;
        if (req.CountryCode != null) g.CountryCode = req.CountryCode;
        if (req.DocumentType.HasValue) g.DocumentType = req.DocumentType.Value;
        if (req.DocumentNumber != null) g.DocumentNumber = req.DocumentNumber;
        if (req.DateOfBirth.HasValue) g.DateOfBirth = req.DateOfBirth;
        if (req.Nationality != null) g.Nationality = req.Nationality;
        if (req.Address != null) g.Address = req.Address;
        if (req.City != null) g.City = req.City;
        if (req.Notes != null) g.Notes = req.Notes;
        if (req.MarketingOptIn.HasValue) g.MarketingOptIn = req.MarketingOptIn.Value;
        g.UpdatedAt = DateTime.UtcNow;

        _uow.Guests.Update(g);
        await _uow.SaveChangesAsync(ct);

        return CreateGuestCommandHandler.MapToDto(g);
    }
}