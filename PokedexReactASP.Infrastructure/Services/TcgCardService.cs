using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using PokedexReactASP.Application.DTOs.TcgCards;
using PokedexReactASP.Application.Interfaces;
using PokedexReactASP.Application.Options;
using PokedexReactASP.Domain.Entities;
using PokedexReactASP.Domain.Enums;
using PokedexReactASP.Infrastructure.ExternalApis;
using PokedexReactASP.Infrastructure.Persistence;

namespace PokedexReactASP.Infrastructure.Services
{
    public class TcgCardService : ITcgCardService
    {
        private readonly PokemonDbContext _context;
        private readonly IPokemonTcgApiClient _pokemonTcgApiClient;
        private readonly PokemonTcgApiSettings _settings;
        private readonly ILogger<TcgCardService> _logger;

        public TcgCardService(
            PokemonDbContext context,
            IPokemonTcgApiClient pokemonTcgApiClient,
            IOptions<PokemonTcgApiSettings> settings,
            ILogger<TcgCardService> logger)
        {
            _context = context;
            _pokemonTcgApiClient = pokemonTcgApiClient;
            _settings = settings.Value;
            _logger = logger;
        }

        public async Task<IReadOnlyList<TcgCardDto>> GetCardsByPokemonAsync(int pokemonApiId)
        {
            var now = DateTime.UtcNow;
            var cacheThreshold = now.AddHours(-_settings.CacheDurationHours);

            var freshCache = await _context.TcgCardCaches
                .AsNoTracking()
                .Where(x => x.PokemonApiId == pokemonApiId && x.CachedAt >= cacheThreshold)
                .ToListAsync();

            if (freshCache.Count > 0)
            {
                return freshCache.Select(MapToDto).ToList();
            }

            var apiCards = await _pokemonTcgApiClient.SearchCardsByPokemonAsync(pokemonApiId);
            if (apiCards.Count > 0)
            {
                var refreshedCards = await UpsertCacheAsync(pokemonApiId, apiCards, now);
                return refreshedCards.Select(MapToDto).ToList();
            }

            _logger.LogWarning("TCG API returned empty result for pokemonApiId {PokemonApiId}. Falling back to stale cache if available.", pokemonApiId);
            var staleCache = await _context.TcgCardCaches
                .AsNoTracking()
                .Where(x => x.PokemonApiId == pokemonApiId)
                .ToListAsync();

            return staleCache.Select(MapToDto).ToList();
        }

        public async Task<IReadOnlyList<TcgCardDto>> GetCardsByPokemonAndTierAsync(int pokemonApiId, TcgCardRarityTier tier)
        {
            var cards = await GetCardsByPokemonAsync(pokemonApiId);
            return cards.Where(x => x.RarityTier == tier).ToList();
        }

        private async Task<List<TcgCardCache>> UpsertCacheAsync(
            int pokemonApiId,
            IReadOnlyList<PokemonTcgCardApiModel> apiCards,
            DateTime cachedAt)
        {
            var existing = await _context.TcgCardCaches
                .Where(x => x.PokemonApiId == pokemonApiId)
                .ToDictionaryAsync(x => x.TcgCardId, StringComparer.OrdinalIgnoreCase);

            var touchedIds = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            foreach (var card in apiCards)
            {
                if (string.IsNullOrWhiteSpace(card.Id))
                {
                    continue;
                }

                touchedIds.Add(card.Id);
                var normalized = NormalizeApiCard(pokemonApiId, card, cachedAt);

                if (existing.TryGetValue(card.Id, out var current))
                {
                    current.Name = normalized.Name;
                    current.Supertype = normalized.Supertype;
                    current.Rarity = normalized.Rarity;
                    current.RarityTier = normalized.RarityTier;
                    current.SetId = normalized.SetId;
                    current.SetName = normalized.SetName;
                    current.ImageSmall = normalized.ImageSmall;
                    current.ImageLarge = normalized.ImageLarge;
                    current.CachedAt = normalized.CachedAt;
                }
                else
                {
                    _context.TcgCardCaches.Add(normalized);
                }
            }

            await _context.SaveChangesAsync();

            var refreshed = await _context.TcgCardCaches
                .AsNoTracking()
                .Where(x => x.PokemonApiId == pokemonApiId && touchedIds.Contains(x.TcgCardId))
                .ToListAsync();

            return refreshed;
        }

        private static TcgCardCache NormalizeApiCard(int pokemonApiId, PokemonTcgCardApiModel card, DateTime cachedAt)
        {
            var normalizedName = string.IsNullOrWhiteSpace(card.Name)
                ? $"Pokemon-{pokemonApiId}"
                : card.Name.Trim();

            return new TcgCardCache
            {
                PokemonApiId = pokemonApiId,
                TcgCardId = card.Id.Trim(),
                Name = normalizedName,
                Supertype = card.Supertype?.Trim(),
                Rarity = card.Rarity?.Trim(),
                RarityTier = MapRarity(card.Rarity),
                SetId = card.Set?.Id?.Trim(),
                SetName = card.Set?.Name?.Trim(),
                ImageSmall = card.Images?.Small?.Trim(),
                ImageLarge = card.Images?.Large?.Trim(),
                CachedAt = cachedAt
            };
        }

        private static TcgCardDto MapToDto(TcgCardCache card)
        {
            return new TcgCardDto
            {
                TcgCardId = card.TcgCardId,
                PokemonApiId = card.PokemonApiId,
                Name = card.Name,
                Supertype = card.Supertype,
                Rarity = card.Rarity,
                RarityTier = card.RarityTier,
                SetId = card.SetId,
                SetName = card.SetName,
                ImageSmall = card.ImageSmall,
                ImageLarge = card.ImageLarge
            };
        }

        internal static TcgCardRarityTier MapRarity(string? rarity)
        {
            if (string.IsNullOrWhiteSpace(rarity))
            {
                return TcgCardRarityTier.Unknown;
            }

            var normalized = $" {rarity.ToLowerInvariant()} ";

            if (normalized.Contains("secret") || normalized.Contains("rainbow") || normalized.Contains("hyper"))
            {
                return TcgCardRarityTier.SecretRare;
            }

            if (normalized.Contains("ultra") ||
                normalized.Contains("vmax") ||
                normalized.Contains("vstar") ||
                normalized.Contains(" ex ") ||
                normalized.Contains(" gx ") ||
                normalized.Contains("rare holo ex") ||
                normalized.Contains("rare holo gx"))
            {
                return TcgCardRarityTier.UltraRare;
            }

            if (normalized.Contains("holo"))
            {
                return TcgCardRarityTier.HoloRare;
            }

            if (normalized.Contains("rare"))
            {
                return TcgCardRarityTier.Rare;
            }

            if (normalized.Contains("uncommon"))
            {
                return TcgCardRarityTier.Uncommon;
            }

            if (normalized.Contains("common"))
            {
                return TcgCardRarityTier.Common;
            }

            if (normalized.Contains("promo"))
            {
                return TcgCardRarityTier.Promo;
            }

            return TcgCardRarityTier.Unknown;
        }
    }
}
