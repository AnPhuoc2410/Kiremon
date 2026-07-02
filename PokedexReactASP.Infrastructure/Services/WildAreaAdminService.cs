using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using PokedexReactASP.Application.Interfaces;
using PokedexReactASP.Application.Options;
using PokedexReactASP.Domain.Entities;
using PokedexReactASP.Infrastructure.Persistence;

namespace PokedexReactASP.Infrastructure.Services
{
    public class WildAreaAdminService : IWildAreaAdminService
    {
        private readonly PokemonDbContext _context;
        private readonly IMemoryCache _memoryCache;

        public WildAreaAdminService(PokemonDbContext context, IMemoryCache memoryCache)
        {
            _context = context;
            _memoryCache = memoryCache;
        }

        public async Task<WildAreaSettings> GetSettingsAsync()
        {
            var globalSetting = await _context.WildAreaGlobalSettings.FirstOrDefaultAsync();
            var areas = await _context.WildAreaConfigs.ToListAsync();

            var settings = new WildAreaSettings();

            if (globalSetting != null)
            {
                settings.ResetIntervalMinutes = globalSetting.ResetIntervalMinutes;
                settings.SpawnCount = globalSetting.SpawnCount;
                settings.MaxAttemptsPerSpawn = globalSetting.MaxAttemptsPerSpawn;
                settings.MaxGeneration = globalSetting.MaxGeneration;
                settings.AllowLegendarySpawn = globalSetting.AllowLegendarySpawn;
                settings.SpawnWeights = globalSetting.SpawnWeights;
            }

            settings.WildAreas = areas.Select(a => new WildAreaConfig
            {
                Code = a.Code,
                Name = a.Name,
                SpawnCount = a.SpawnCount,
                ResetIntervalMinutes = a.ResetIntervalMinutes,
                AllowedTypes = a.AllowedTypes,
                PreferredTypes = a.PreferredTypes,
                BannedTypes = a.BannedTypes,
                AllowedHabitats = a.AllowedHabitats,
                PreferredHabitats = a.PreferredHabitats,
                RequiredAnyTags = a.RequiredAnyTags,
                PreferredTags = a.PreferredTags,
                AllowedTags = a.AllowedTags,
                BannedTags = a.BannedTags,
                RequiredAnyTypes = a.RequiredAnyTypes,
                SecondaryAllowedTypes = a.SecondaryAllowedTypes,
                SafeFallbackPokemonIds = a.SafeFallbackPokemonIds,
                MinGeneration = a.MinGeneration,
                MaxGeneration = a.MaxGeneration,
                AllowLegendary = a.AllowLegendary,
                AllowMythical = a.AllowMythical,
                AllowBaby = a.AllowBaby,
                RarityWeights = a.RarityWeights
            }).ToList();

            return settings;
        }

        public async Task UpdateSettingsAsync(WildAreaSettings settings)
        {
            var globalSetting = await _context.WildAreaGlobalSettings.FirstOrDefaultAsync();
            if (globalSetting == null)
            {
                globalSetting = new WildAreaGlobalSetting();
                _context.WildAreaGlobalSettings.Add(globalSetting);
            }

            globalSetting.ResetIntervalMinutes = settings.ResetIntervalMinutes;
            globalSetting.SpawnCount = settings.SpawnCount;
            globalSetting.MaxAttemptsPerSpawn = settings.MaxAttemptsPerSpawn;
            globalSetting.MaxGeneration = settings.MaxGeneration;
            globalSetting.AllowLegendarySpawn = settings.AllowLegendarySpawn;
            globalSetting.SpawnWeights = settings.SpawnWeights;

            var existingAreas = await _context.WildAreaConfigs.ToListAsync();
            _context.WildAreaConfigs.RemoveRange(existingAreas);

            var newAreas = settings.WildAreas.Select(area => new WildAreaEntity
            {
                Code = area.Code,
                Name = area.Name,
                SpawnCount = area.SpawnCount,
                ResetIntervalMinutes = area.ResetIntervalMinutes,
                AllowedTypes = area.AllowedTypes,
                PreferredTypes = area.PreferredTypes,
                BannedTypes = area.BannedTypes,
                AllowedHabitats = area.AllowedHabitats,
                PreferredHabitats = area.PreferredHabitats,
                RequiredAnyTags = area.RequiredAnyTags,
                PreferredTags = area.PreferredTags,
                AllowedTags = area.AllowedTags,
                BannedTags = area.BannedTags,
                RequiredAnyTypes = area.RequiredAnyTypes,
                SecondaryAllowedTypes = area.SecondaryAllowedTypes,
                SafeFallbackPokemonIds = area.SafeFallbackPokemonIds,
                MinGeneration = area.MinGeneration,
                MaxGeneration = area.MaxGeneration,
                AllowLegendary = area.AllowLegendary,
                AllowMythical = area.AllowMythical,
                AllowBaby = area.AllowBaby,
                RarityWeights = area.RarityWeights
            }).ToList();

            await _context.WildAreaConfigs.AddRangeAsync(newAreas);
            await _context.SaveChangesAsync();

            _memoryCache.Remove("WildAreaSettings");
        }
    }
}
