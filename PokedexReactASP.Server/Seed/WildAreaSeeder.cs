using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using PokedexReactASP.Application.Options;
using PokedexReactASP.Domain.Entities;
using PokedexReactASP.Infrastructure.Persistence;

namespace PokedexReactASP.Server.Seed
{
    public static class WildAreaSeeder
    {
        public static async Task SeedAsync(IServiceProvider serviceProvider, ILogger logger, IWebHostEnvironment env)
        {
            using var scope = serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<PokemonDbContext>();

            if (await context.WildAreaGlobalSettings.AnyAsync() || await context.WildAreaConfigs.AnyAsync())
            {
                logger.LogInformation("Wild Area data already seeded.");
                return;
            }

            try
            {
                var filePath = Path.Combine(env.ContentRootPath, "Data", "wildareas.json");
                if (!File.Exists(filePath))
                {
                    logger.LogWarning("Wild Area seed file not found at {FilePath}. Seeding skipped.", filePath);
                    return;
                }

                var json = await File.ReadAllTextAsync(filePath);
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var seedData = JsonSerializer.Deserialize<WildAreaSettings>(json, options);

                if (seedData == null)
                {
                    logger.LogWarning("Failed to deserialize Wild Area seed data.");
                    return;
                }

                var globalSetting = new WildAreaGlobalSetting
                {
                    ResetIntervalMinutes = seedData.ResetIntervalMinutes,
                    SpawnCount = seedData.SpawnCount,
                    MaxAttemptsPerSpawn = seedData.MaxAttemptsPerSpawn,
                    MaxGeneration = seedData.MaxGeneration,
                    AllowLegendarySpawn = seedData.AllowLegendarySpawn,
                    SpawnWeights = seedData.SpawnWeights
                };

                context.WildAreaGlobalSettings.Add(globalSetting);

                foreach (var area in seedData.WildAreas)
                {
                    var entity = new WildAreaEntity
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
                    };
                    context.WildAreaConfigs.Add(entity);
                }

                await context.SaveChangesAsync();
                logger.LogInformation("Successfully seeded Wild Area data.");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An error occurred while seeding Wild Area data.");
            }
        }
    }
}
