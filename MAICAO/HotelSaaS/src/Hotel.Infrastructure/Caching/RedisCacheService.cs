using Hotel.Application.Common.Interfaces;
using Microsoft.Extensions.Caching.Distributed;
using StackExchange.Redis;
using System.Text.Json;

namespace Hotel.Infrastructure.Caching;

public class RedisCacheService : ICacheService
{
    private readonly IDistributedCache _cache;
    private readonly IConnectionMultiplexer _redis;

    public RedisCacheService(IDistributedCache cache, IConnectionMultiplexer redis)
    { _cache = cache; _redis = redis; }

    public async Task<T?> GetAsync<T>(string key, CancellationToken ct = default)
    {
        var data = await _cache.GetStringAsync(key, ct);
        return data == null ? default : JsonSerializer.Deserialize<T>(data);
    }

    public async Task SetAsync<T>(string key, T value, TimeSpan? expiry = null, CancellationToken ct = default)
    {
        var opts = new DistributedCacheEntryOptions();
        if (expiry.HasValue) opts.SetAbsoluteExpiration(expiry.Value);
        else opts.SetAbsoluteExpiration(TimeSpan.FromMinutes(30));
        await _cache.SetStringAsync(key, JsonSerializer.Serialize(value), opts, ct);
    }

    public async Task RemoveAsync(string key, CancellationToken ct = default)
        => await _cache.RemoveAsync(key, ct);

    public async Task InvalidatePatternAsync(string pattern)
    {
        var db = _redis.GetDatabase();
        var server = _redis.GetServer(_redis.GetEndPoints().First());
        var keys = server.Keys(pattern: pattern).ToArray();
        if (keys.Length > 0) await db.KeyDeleteAsync(keys);
    }

    public async Task<bool> ExistsAsync(string key, CancellationToken ct = default)
    {
        var data = await _cache.GetAsync(key, ct);
        return data != null;
    }
}