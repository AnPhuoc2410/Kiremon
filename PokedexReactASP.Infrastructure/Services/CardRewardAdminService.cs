using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using PokedexReactASP.Application.Interfaces;
using PokedexReactASP.Application.Options;
using PokedexReactASP.Domain.Entities;
using PokedexReactASP.Infrastructure.Persistence;

namespace PokedexReactASP.Infrastructure.Services
{
    public class CardRewardAdminService(PokemonDbContext context, IMemoryCache memoryCache)
        : ICardRewardAdminService
    {
        private const string CacheKey = "CardRewardSettings";

        public async Task<CardRewardSettings> GetSettingsAsync()
        {
            var row = await context.CardRewardGlobalSettings.FirstOrDefaultAsync();

            var settings = new CardRewardSettings();

            if (row is not null)
            {
                settings.RarityWeights = row.RarityWeights;
            }

            return settings;
        }

        public async Task UpdateSettingsAsync(CardRewardSettings settings)
        {
            var row = await context.CardRewardGlobalSettings.FirstOrDefaultAsync();

            if (row is null)
            {
                row = new CardRewardGlobalSetting();
                context.CardRewardGlobalSettings.Add(row);
            }

            row.RarityWeights = settings.RarityWeights;

            await context.SaveChangesAsync();

            memoryCache.Remove(CacheKey);
        }
    }
}
