using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using PokedexReactASP.Application.DTOs.WildArea;
using PokedexReactASP.Application.Interfaces;
using PokedexReactASP.Application.Options;
using PokedexReactASP.Domain.Entities;
using PokedexReactASP.Domain.Enums;
using PokedexReactASP.Infrastructure.Persistence;

namespace PokedexReactASP.Infrastructure.Services
{
    public class CardRewardService : ICardRewardService
    {
        private readonly PokemonDbContext _context;
        private readonly ITcgCardService _tcgCardService;
        private readonly CardRewardSettings _settings;
        private readonly Random _random = new();

        private static readonly TcgCardRarityTier[] TierOrder =
        [
            TcgCardRarityTier.Common,
            TcgCardRarityTier.Uncommon,
            TcgCardRarityTier.Rare,
            TcgCardRarityTier.HoloRare,
            TcgCardRarityTier.UltraRare,
            TcgCardRarityTier.SecretRare
        ];

        public CardRewardService(
            PokemonDbContext context,
            ITcgCardService tcgCardService,
            IOptions<CardRewardSettings> settings)
        {
            _context = context;
            _tcgCardService = tcgCardService;
            _settings = settings.Value;
        }

        public async Task<WildCardRewardDto?> RollAndGrantCardAsync(string userId, int pokemonApiId, CardRewardSource source)
        {
            var tier = RollTier(_settings.BuildWeights());
            var cards = await _tcgCardService.GetCardsByPokemonAndTierAsync(pokemonApiId, tier);

            if (cards.Count == 0)
            {
                cards = await _tcgCardService.GetCardsByPokemonAsync(pokemonApiId);
            }

            if (cards.Count == 0)
            {
                return null;
            }

            var selected = cards[_random.Next(cards.Count)];
            var now = DateTime.UtcNow;

            var existing = await _context.UserTcgCards
                .FirstOrDefaultAsync(x => x.UserId == userId && x.TcgCardId == selected.TcgCardId);

            if (existing != null)
            {
                existing.Quantity += 1;
                existing.Name = selected.Name;
                existing.Supertype = selected.Supertype;
                existing.Rarity = selected.Rarity;
                existing.RarityTier = selected.RarityTier;
                existing.SetId = selected.SetId;
                existing.SetName = selected.SetName;
                existing.ImageSmall = selected.ImageSmall;
                existing.ImageLarge = selected.ImageLarge;
                existing.Source = source;
                existing.ObtainedAt = now;

                await _context.SaveChangesAsync();
                return MapReward(existing);
            }

            var entity = new UserTcgCard
            {
                UserId = userId,
                TcgCardId = selected.TcgCardId,
                PokemonApiId = selected.PokemonApiId,
                Name = selected.Name,
                Supertype = selected.Supertype,
                Rarity = selected.Rarity,
                RarityTier = selected.RarityTier,
                SetId = selected.SetId,
                SetName = selected.SetName,
                ImageSmall = selected.ImageSmall,
                ImageLarge = selected.ImageLarge,
                Quantity = 1,
                Source = source,
                ObtainedAt = now
            };

            _context.UserTcgCards.Add(entity);
            await _context.SaveChangesAsync();

            return MapReward(entity);
        }

        private TcgCardRarityTier RollTier(IReadOnlyDictionary<TcgCardRarityTier, double> weights)
        {
            var totalWeight = weights.Values.Where(x => x > 0).Sum();
            if (totalWeight <= 0)
            {
                return TcgCardRarityTier.Common;
            }

            var roll = _random.NextDouble() * totalWeight;
            var running = 0d;

            foreach (var tier in TierOrder)
            {
                if (!weights.TryGetValue(tier, out var weight) || weight <= 0)
                {
                    continue;
                }

                running += weight;
                if (roll <= running)
                {
                    return tier;
                }
            }

            return TcgCardRarityTier.Common;
        }

        private static WildCardRewardDto MapReward(UserTcgCard card)
        {
            return new WildCardRewardDto
            {
                UserCardId = card.Id,
                TcgCardId = card.TcgCardId,
                Name = card.Name,
                Rarity = card.Rarity,
                RarityTier = card.RarityTier.ToString(),
                ImageSmall = card.ImageSmall,
                ImageLarge = card.ImageLarge
            };
        }
    }
}
