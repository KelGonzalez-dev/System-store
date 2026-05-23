using Hotel.Application.Common.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Hotel.Application.Features.Cache.Commands;

public record RebuildAvailabilityCommand(string HotelId) : IRequest<bool>;

public class RebuildAvailabilityCommandHandler : IRequestHandler<RebuildAvailabilityCommand, bool>
{
    private readonly IUnitOfWorkApp _uow;
    private readonly ICacheService _cache;
    private readonly ILogger<RebuildAvailabilityCommandHandler> _logger;

    public RebuildAvailabilityCommandHandler(IUnitOfWorkApp uow, ICacheService cache,
        ILogger<RebuildAvailabilityCommandHandler> logger)
    { _uow = uow; _cache = cache; _logger = logger; }

    public async Task<bool> Handle(RebuildAvailabilityCommand req, CancellationToken ct)
    {
        await _uow.RebuildAvailabilityCacheAsync(req.HotelId, ct);
        await _cache.InvalidatePatternAsync($"availability:{req.HotelId}:*");
        _logger.LogInformation("Availability cache rebuilt for hotel {HotelId}", req.HotelId);
        return true;
    }
}