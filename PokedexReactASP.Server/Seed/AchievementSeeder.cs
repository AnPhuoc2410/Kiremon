using Microsoft.EntityFrameworkCore;
using PokedexReactASP.Domain.Entities;
using PokedexReactASP.Infrastructure.Persistence;

namespace PokedexReactASP.Server.Seed
{
    public static class AchievementSeeder
    {
        public static async Task SeedAsync(PokemonDbContext context, ILogger logger)
        {
            try
            {
                var defaultAchievements = PokedexReactASP.Application.Services.AchievementService.DefaultAchievements;
                bool changes = false;

                foreach (var achievement in defaultAchievements)
                {
                    var existing = await context.Achievements.FirstOrDefaultAsync(a => a.Id == achievement.Id);
                    if (existing == null)
                    {
                        await context.Achievements.AddAsync(new Achievement
                        {
                            Id = achievement.Id,
                            Name = achievement.Name,
                            Description = achievement.Description,
                            Category = achievement.Category,
                            Rarity = achievement.Rarity,
                            TargetValue = achievement.TargetValue,
                            RewardCoins = achievement.RewardCoins,
                            Icon = achievement.Icon,
                            Region = achievement.Region
                        });
                        changes = true;
                    }
                    else
                    {
                        if (existing.Name != achievement.Name ||
                            existing.Description != achievement.Description ||
                            existing.Category != achievement.Category ||
                            existing.Rarity != achievement.Rarity ||
                            existing.TargetValue != achievement.TargetValue ||
                            existing.RewardCoins != achievement.RewardCoins ||
                            existing.Icon != achievement.Icon ||
                            existing.Region != achievement.Region)
                        {
                            existing.Name = achievement.Name;
                            existing.Description = achievement.Description;
                            existing.Category = achievement.Category;
                            existing.Rarity = achievement.Rarity;
                            existing.TargetValue = achievement.TargetValue;
                            existing.RewardCoins = achievement.RewardCoins;
                            existing.Icon = achievement.Icon;
                            existing.Region = achievement.Region;

                            context.Achievements.Update(existing);
                            changes = true;
                        }
                    }
                }

                if (changes)
                {
                    await context.SaveChangesAsync();
                    logger.LogInformation("Achievements and region badges seeded/updated successfully.");
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An error occurred while seeding achievements.");
            }
        }
    }
}
