using System;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using PokedexReactASP.Application.Interfaces;
using PokedexReactASP.Application.Options;
using PokedexReactASP.Domain.Entities;
using PokedexReactASP.Infrastructure.Persistence;

namespace PokedexReactASP.Infrastructure.Services
{
    public class SystemConfigService : ISystemConfigService
    {
        private const string WildAreaKey = "WildArea";
        private const string CardRewardKey = "CardReward";

        private readonly PokemonDbContext _context;
        private readonly WildAreaSettings _fallbackWildArea;
        private readonly CardRewardSettings _fallbackCardReward;

        private static WildAreaSettings? _wildAreaCache;
        private static CardRewardSettings? _cardRewardCache;
        private static readonly object CacheLock = new();

        private static readonly JsonSerializerOptions JsonOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            PropertyNameCaseInsensitive = true,
            WriteIndented = true
        };

        public SystemConfigService(
            PokemonDbContext context,
            IOptions<WildAreaSettings> wildAreaOptions,
            IOptions<CardRewardSettings> cardRewardOptions)
        {
            _context = context;
            _fallbackWildArea = wildAreaOptions.Value;
            _fallbackCardReward = cardRewardOptions.Value;
        }

        public async Task<WildAreaSettings> GetWildAreaSettingsAsync()
        {
            if (_wildAreaCache != null)
            {
                return _wildAreaCache;
            }

            var config = await _context.SystemConfigs
                .FirstOrDefaultAsync(x => x.Key == WildAreaKey);

            if (config == null)
            {
                await InitializeSeedAsync();
                return _wildAreaCache ?? _fallbackWildArea;
            }

            try
            {
                var settings = JsonSerializer.Deserialize<WildAreaSettings>(config.Value, JsonOptions);
                if (settings != null)
                {
                    lock (CacheLock)
                    {
                        _wildAreaCache = settings;
                    }
                    return settings;
                }
            }
            catch (Exception)
            {
                // Fallback on error
            }

            return _fallbackWildArea;
        }

        public async Task<CardRewardSettings> GetCardRewardSettingsAsync()
        {
            if (_cardRewardCache != null)
            {
                return _cardRewardCache;
            }

            var config = await _context.SystemConfigs
                .FirstOrDefaultAsync(x => x.Key == CardRewardKey);

            if (config == null)
            {
                await InitializeSeedAsync();
                return _cardRewardCache ?? _fallbackCardReward;
            }

            try
            {
                var settings = JsonSerializer.Deserialize<CardRewardSettings>(config.Value, JsonOptions);
                if (settings != null)
                {
                    lock (CacheLock)
                    {
                        _cardRewardCache = settings;
                    }
                    return settings;
                }
            }
            catch (Exception)
            {
                // Fallback on error
            }

            return _fallbackCardReward;
        }

        public async Task SaveWildAreaSettingsAsync(WildAreaSettings settings)
        {
            var json = JsonSerializer.Serialize(settings, JsonOptions);

            var config = await _context.SystemConfigs
                .FirstOrDefaultAsync(x => x.Key == WildAreaKey);

            if (config == null)
            {
                config = new SystemConfig
                {
                    Key = WildAreaKey,
                    Value = json,
                    Description = "Wild Area configuration settings",
                    UpdatedAt = DateTime.UtcNow
                };
                _context.SystemConfigs.Add(config);
            }
            else
            {
                config.Value = json;
                config.UpdatedAt = DateTime.UtcNow;
                _context.SystemConfigs.Update(config);
            }

            await _context.SaveChangesAsync();

            lock (CacheLock)
            {
                _wildAreaCache = settings;
            }
        }

        public async Task SaveCardRewardSettingsAsync(CardRewardSettings settings)
        {
            var json = JsonSerializer.Serialize(settings, JsonOptions);

            var config = await _context.SystemConfigs
                .FirstOrDefaultAsync(x => x.Key == CardRewardKey);

            if (config == null)
            {
                config = new SystemConfig
                {
                    Key = CardRewardKey,
                    Value = json,
                    Description = "TCG Card Reward weights configuration settings",
                    UpdatedAt = DateTime.UtcNow
                };
                _context.SystemConfigs.Add(config);
            }
            else
            {
                config.Value = json;
                config.UpdatedAt = DateTime.UtcNow;
                _context.SystemConfigs.Update(config);
            }

            await _context.SaveChangesAsync();

            lock (CacheLock)
            {
                _cardRewardCache = settings;
            }
        }

        public async Task InitializeSeedAsync()
        {
            var wildAreaExists = await _context.SystemConfigs.AnyAsync(x => x.Key == WildAreaKey);
            if (!wildAreaExists)
            {
                await SaveWildAreaSettingsAsync(_fallbackWildArea);
            }

            var cardRewardExists = await _context.SystemConfigs.AnyAsync(x => x.Key == CardRewardKey);
            if (!cardRewardExists)
            {
                await SaveCardRewardSettingsAsync(_fallbackCardReward);
            }
        }
    }
}
