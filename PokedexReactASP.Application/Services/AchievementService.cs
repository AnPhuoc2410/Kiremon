using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using PokedexReactASP.Application.DTOs.Achievement;
using PokedexReactASP.Application.Interfaces;
using PokedexReactASP.Domain.Entities;
using System.Text.Json;

namespace PokedexReactASP.Application.Services
{
    public class AchievementService : IAchievementService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IDistributedCache _cache;
        private readonly IAchievementNotificationService _notificationService;
        private readonly ILogger<AchievementService> _logger;

        private static readonly TimeSpan CacheDuration = TimeSpan.FromHours(24);

        // Predefined list of achievements and region gym badges
        public static readonly List<Achievement> DefaultAchievements = new()
        {
            // General progression
            new Achievement { Id = "level_5", Name = "Novice Trainer", Description = "Reach Trainer Level 5", Category = "Progression", Rarity = "Bronze", TargetValue = 5, RewardCoins = 100, Icon = "star-level-5" },
            new Achievement { Id = "level_10", Name = "Rising Star", Description = "Reach Trainer Level 10", Category = "Progression", Rarity = "Bronze", TargetValue = 10, RewardCoins = 200, Icon = "star-level-10" },
            new Achievement { Id = "level_20", Name = "Ace Trainer", Description = "Reach Trainer Level 20", Category = "Progression", Rarity = "Silver", TargetValue = 20, RewardCoins = 500, Icon = "star-level-20" },
            new Achievement { Id = "level_30", Name = "Grandmaster", Description = "Reach Trainer Level 30", Category = "Progression", Rarity = "Gold", TargetValue = 30, RewardCoins = 1000, Icon = "star-level-30" },

            // General collection
            new Achievement { Id = "catch_10", Name = "First Steps", Description = "Catch 10 Pokémon", Category = "Collection", Rarity = "Bronze", TargetValue = 10, RewardCoins = 100, Icon = "catch-10" },
            new Achievement { Id = "catch_50", Name = "Collector", Description = "Catch 50 Pokémon", Category = "Collection", Rarity = "Silver", TargetValue = 50, RewardCoins = 300, Icon = "catch-50" },
            new Achievement { Id = "catch_100", Name = "Super Catcher", Description = "Catch 100 Pokémon", Category = "Collection", Rarity = "Silver", TargetValue = 100, RewardCoins = 500, Icon = "catch-100" },
            new Achievement { Id = "catch_500", Name = "Catching Master", Description = "Catch 500 Pokémon", Category = "Collection", Rarity = "Gold", TargetValue = 500, RewardCoins = 1500, Icon = "catch-500" },

            // Species diversity
            new Achievement { Id = "unique_10", Name = "Species Researcher", Description = "Register 10 unique Pokémon species in your Pokédex", Category = "Collection", Rarity = "Bronze", TargetValue = 10, RewardCoins = 150, Icon = "unique-10" },
            new Achievement { Id = "unique_50", Name = "Pokédex Enthusiast", Description = "Register 50 unique Pokémon species in your Pokédex", Category = "Collection", Rarity = "Silver", TargetValue = 50, RewardCoins = 400, Icon = "unique-50" },
            new Achievement { Id = "unique_100", Name = "Professor's Assistant", Description = "Register 100 unique Pokémon species in your Pokédex", Category = "Collection", Rarity = "Gold", TargetValue = 100, RewardCoins = 800, Icon = "unique-100" },

            // Shinies & Legendaries
            new Achievement { Id = "shiny_1", Name = "Lucky Find", Description = "Catch your first Shiny Pokémon", Category = "Collection", Rarity = "Silver", TargetValue = 1, RewardCoins = 500, Icon = "shiny-1" },
            new Achievement { Id = "shiny_5", Name = "Sparkle Catcher", Description = "Catch 5 Shiny Pokémon", Category = "Collection", Rarity = "Gold", TargetValue = 5, RewardCoins = 1000, Icon = "shiny-5" },
            new Achievement { Id = "legendary_1", Name = "Myth Defier", Description = "Catch your first Legendary Pokémon", Category = "Collection", Rarity = "Gold", TargetValue = 1, RewardCoins = 1000, Icon = "legendary-1" },

            // Social
            new Achievement { Id = "friends_1", Name = "Friendly Encounter", Description = "Add your first friend", Category = "Social", Rarity = "Bronze", TargetValue = 1, RewardCoins = 100, Icon = "friends-1" },
            new Achievement { Id = "friends_5", Name = "Social Butterfly", Description = "Have 5 friends", Category = "Social", Rarity = "Silver", TargetValue = 5, RewardCoins = 300, Icon = "friends-5" },
            new Achievement { Id = "friends_10", Name = "Popular Trainer", Description = "Have 10 friends", Category = "Social", Rarity = "Gold", TargetValue = 10, RewardCoins = 500, Icon = "friends-10" },

            // Kanto Region Badges (Gym Leaders)
            new Achievement { Id = "kanto_badge_brock", Name = "Boulder Badge", Description = "Defeat Gym Leader Brock in Pewter City (Kanto)", Category = "Badges", Rarity = "Bronze", TargetValue = 1, RewardCoins = 500, Icon = "badge-boulder", Region = "Kanto" },
            new Achievement { Id = "kanto_badge_misty", Name = "Cascade Badge", Description = "Defeat Gym Leader Misty in Cerulean City (Kanto)", Category = "Badges", Rarity = "Bronze", TargetValue = 1, RewardCoins = 500, Icon = "badge-cascade", Region = "Kanto" },
            new Achievement { Id = "kanto_badge_lt_surge", Name = "Thunder Badge", Description = "Defeat Gym Leader Lt. Surge in Vermilion City (Kanto)", Category = "Badges", Rarity = "Bronze", TargetValue = 1, RewardCoins = 600, Icon = "badge-thunder", Region = "Kanto" },
            new Achievement { Id = "kanto_badge_erika", Name = "Rainbow Badge", Description = "Defeat Gym Leader Erika in Celadon City (Kanto)", Category = "Badges", Rarity = "Silver", TargetValue = 1, RewardCoins = 700, Icon = "badge-rainbow", Region = "Kanto" },
            new Achievement { Id = "kanto_badge_koga", Name = "Soul Badge", Description = "Defeat Gym Leader Koga in Fuchsia City (Kanto)", Category = "Badges", Rarity = "Silver", TargetValue = 1, RewardCoins = 800, Icon = "badge-soul", Region = "Kanto" },
            new Achievement { Id = "kanto_badge_sabrina", Name = "Marsh Badge", Description = "Defeat Gym Leader Sabrina in Saffron City (Kanto)", Category = "Badges", Rarity = "Silver", TargetValue = 1, RewardCoins = 900, Icon = "badge-marsh", Region = "Kanto" },
            new Achievement { Id = "kanto_badge_blaine", Name = "Volcano Badge", Description = "Defeat Gym Leader Blaine in Cinnabar Island (Kanto)", Category = "Badges", Rarity = "Gold", TargetValue = 1, RewardCoins = 1000, Icon = "badge-volcano", Region = "Kanto" },
            new Achievement { Id = "kanto_badge_giovanni", Name = "Earth Badge", Description = "Defeat Gym Leader Giovanni in Viridian City (Kanto)", Category = "Badges", Rarity = "Gold", TargetValue = 1, RewardCoins = 1200, Icon = "badge-earth", Region = "Kanto" },

            // Johto Region Badges (Gym Leaders)
            new Achievement { Id = "johto_badge_falkner", Name = "Zephyr Badge", Description = "Defeat Gym Leader Falkner in Violet City (Johto)", Category = "Badges", Rarity = "Bronze", TargetValue = 1, RewardCoins = 500, Icon = "badge-zephyr", Region = "Johto" },
            new Achievement { Id = "johto_badge_bugsy", Name = "Hive Badge", Description = "Defeat Gym Leader Bugsy in Azalea Town (Johto)", Category = "Badges", Rarity = "Bronze", TargetValue = 1, RewardCoins = 500, Icon = "badge-hive", Region = "Johto" },
            new Achievement { Id = "johto_badge_whitney", Name = "Plain Badge", Description = "Defeat Gym Leader Whitney in Goldenrod City (Johto)", Category = "Badges", Rarity = "Bronze", TargetValue = 1, RewardCoins = 600, Icon = "badge-plain", Region = "Johto" },
            new Achievement { Id = "johto_badge_morty", Name = "Fog Badge", Description = "Defeat Gym Leader Morty in Ecruteak City (Johto)", Category = "Badges", Rarity = "Silver", TargetValue = 1, RewardCoins = 700, Icon = "badge-fog", Region = "Johto" },
            new Achievement { Id = "johto_badge_chuck", Name = "Storm Badge", Description = "Defeat Gym Leader Chuck in Cianwood City (Johto)", Category = "Badges", Rarity = "Silver", TargetValue = 1, RewardCoins = 800, Icon = "badge-storm", Region = "Johto" },
            new Achievement { Id = "johto_badge_jasmine", Name = "Mineral Badge", Description = "Defeat Gym Leader Jasmine in Olivine City (Johto)", Category = "Badges", Rarity = "Silver", TargetValue = 1, RewardCoins = 900, Icon = "badge-mineral", Region = "Johto" },
            new Achievement { Id = "johto_badge_pryce", Name = "Glacier Badge", Description = "Defeat Gym Leader Pryce in Mahogany Town (Johto)", Category = "Badges", Rarity = "Gold", TargetValue = 1, RewardCoins = 1000, Icon = "badge-glacier", Region = "Johto" },
            new Achievement { Id = "johto_badge_clair", Name = "Rising Badge", Description = "Defeat Gym Leader Clair in Blackthorn City (Johto)", Category = "Badges", Rarity = "Gold", TargetValue = 1, RewardCoins = 1200, Icon = "badge-rising", Region = "Johto" },
        };

        public AchievementService(
            IUnitOfWork unitOfWork,
            UserManager<ApplicationUser> userManager,
            IDistributedCache cache,
            IAchievementNotificationService notificationService,
            ILogger<AchievementService> logger)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
            _cache = cache;
            _notificationService = notificationService;
            _logger = logger;
        }

        /// <inheritdoc/>
        public async Task<IEnumerable<UserAchievementStatusDto>> GetUserAchievementsAsync(string userId)
        {
            var cacheKey = $"achievements:{userId}";

            // 1. Try cache lookup
            string? cachedJson = null;
            try
            {
                cachedJson = await _cache.GetStringAsync(cacheKey);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to read achievements cache for user {UserId} from Redis. Falling back to DB.", userId);
            }

            if (!string.IsNullOrEmpty(cachedJson))
            {
                try
                {
                    return JsonSerializer.Deserialize<List<UserAchievementStatusDto>>(cachedJson) ?? new List<UserAchievementStatusDto>();
                }
                catch (JsonException)
                {
                    // Fallback to database query on corrupted cache
                }
            }

            // 2. Fetch from DB
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return Enumerable.Empty<UserAchievementStatusDto>();

            var userAchievementsList = await _unitOfWork.UserAchievement.FindAsync(ua => ua.UserId == userId, disableTracking: true);
            var userAchievements = userAchievementsList.ToDictionary(ua => ua.AchievementId);

            var result = new List<UserAchievementStatusDto>();

            foreach (var definition in DefaultAchievements)
            {
                var hasProgress = userAchievements.TryGetValue(definition.Id, out var record);

                int progress = 0;
                bool isUnlocked = false;
                DateTime? unlockedAt = null;

                if (hasProgress && record != null)
                {
                    progress = record.Progress;
                    isUnlocked = record.IsUnlocked;
                    unlockedAt = record.UnlockedAt;
                }
                else
                {
                    // Dynamically calculate progress for stats-based achievements if not recorded in DB
                    progress = CalculateStatProgress(user, definition);
                    isUnlocked = progress >= definition.TargetValue;
                    if (isUnlocked)
                    {
                        unlockedAt = DateTime.UtcNow;
                    }
                }

                result.Add(new UserAchievementStatusDto
                {
                    Id = definition.Id,
                    Name = definition.Name,
                    Description = definition.Description,
                    Category = definition.Category,
                    Rarity = definition.Rarity,
                    CurrentProgress = progress,
                    TargetValue = definition.TargetValue,
                    IsUnlocked = isUnlocked,
                    UnlockedAt = unlockedAt,
                    RewardCoins = definition.RewardCoins,
                    Icon = definition.Icon,
                    Region = definition.Region
                });
            }

            // 3. Save to Redis
            try
            {
                var cacheOptions = new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = CacheDuration
                };
                await _cache.SetStringAsync(cacheKey, JsonSerializer.Serialize(result), cacheOptions);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to save achievements cache for user {UserId} to Redis.", userId);
            }

            return result;
        }

        /// <inheritdoc/>
        public async Task CheckAndUnlockAchievementsAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return;

            var userAchievementsList = await _unitOfWork.UserAchievement.FindAsync(ua => ua.UserId == userId);
            var userAchievements = userAchievementsList.ToDictionary(ua => ua.AchievementId);

            bool anyNewUnlock = false;

            foreach (var definition in DefaultAchievements)
            {
                // Skip manually triggered regional badges
                if (definition.Category == "Badges") continue;

                var hasProgress = userAchievements.TryGetValue(definition.Id, out var record);
                if (record != null && record.IsUnlocked) continue;

                int currentProgress = CalculateStatProgress(user, definition);

                if (record == null)
                {
                    record = new UserAchievement
                    {
                        UserId = userId,
                        AchievementId = definition.Id,
                        Progress = currentProgress,
                        IsUnlocked = false
                    };
                    await _unitOfWork.UserAchievement.AddAsync(record);
                }
                else
                {
                    record.Progress = currentProgress;
                }

                if (record.Progress >= definition.TargetValue && !record.IsUnlocked)
                {
                    record.IsUnlocked = true;
                    record.UnlockedAt = DateTime.UtcNow;
                    anyNewUnlock = true;

                    // Grant coins reward
                    user.Coins += definition.RewardCoins;

                    // Push real-time SignalR toast
                    var notification = new AchievementNotificationDto
                    {
                        Id = definition.Id,
                        Name = definition.Name,
                        Description = definition.Description,
                        Rarity = definition.Rarity,
                        RewardCoins = definition.RewardCoins,
                        Icon = definition.Icon,
                        Region = definition.Region
                    };

                    // Fire-and-forget push
                    _ = _notificationService.NotifyAchievementUnlockedAsync(userId, notification);
                }
            }

            if (anyNewUnlock)
            {
                // Update User entity for coins
                await _userManager.UpdateAsync(user);
                // Save database records
                await _unitOfWork.SaveChangesAsync();
                // Invalidate Redis cache
                try
                {
                    await _cache.RemoveAsync($"achievements:{userId}");
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to invalidate achievements cache for user {UserId} in Redis.", userId);
                }
            }
        }

        /// <inheritdoc/>
        public async Task<bool> UnlockAchievementManuallyAsync(string userId, string achievementId)
        {
            var definition = DefaultAchievements.FirstOrDefault(a => a.Id == achievementId);
            if (definition == null) return false;

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return false;

            var record = await _unitOfWork.UserAchievement
                .FirstOrDefaultAsync(ua => ua.UserId == userId && ua.AchievementId == achievementId);

            if (record != null && record.IsUnlocked)
            {
                return true; // Already unlocked
            }

            if (record == null)
            {
                record = new UserAchievement
                {
                    UserId = userId,
                    AchievementId = achievementId,
                    Progress = definition.TargetValue,
                    IsUnlocked = true,
                    UnlockedAt = DateTime.UtcNow
                };
                await _unitOfWork.UserAchievement.AddAsync(record);
            }
            else
            {
                record.Progress = definition.TargetValue;
                record.IsUnlocked = true;
                record.UnlockedAt = DateTime.UtcNow;
            }

            // Credit Coins
            user.Coins += definition.RewardCoins;

            await _userManager.UpdateAsync(user);
            await _unitOfWork.SaveChangesAsync();

            // Clear cache
            try
            {
                await _cache.RemoveAsync($"achievements:{userId}");
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to invalidate achievements cache for user {UserId} in Redis.", userId);
            }

            // Notify SignalR
            var notification = new AchievementNotificationDto
            {
                Id = definition.Id,
                Name = definition.Name,
                Description = definition.Description,
                Rarity = definition.Rarity,
                RewardCoins = definition.RewardCoins,
                Icon = definition.Icon,
                Region = definition.Region
            };
            await _notificationService.NotifyAchievementUnlockedAsync(userId, notification);

            return true;
        }

        private static int CalculateStatProgress(ApplicationUser user, Achievement definition)
        {
            return definition.Id switch
            {
                // Progression levels
                var s when s.StartsWith("level_") => user.TrainerLevel,
                // Collection catch totals
                var s when s.StartsWith("catch_") => user.PokemonCaught,
                // Pokedex species diversity
                var s when s.StartsWith("unique_") => user.UniquePokemonCaught,
                // Shinies caught
                var s when s.StartsWith("shiny_") => user.ShinyPokemonCaught,
                // Legendaries caught
                var s when s.StartsWith("legendary_") => user.LegendaryPokemonCaught,
                // Friends
                var s when s.StartsWith("friends_") => user.FriendsCount,
                // Manual
                _ => 0
            };
        }
    }
}
