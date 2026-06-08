using System.Collections.Generic;
using System.Threading.Tasks;
using PokedexReactASP.Application.DTOs.Achievement;

namespace PokedexReactASP.Application.Interfaces
{
    /// <summary>
    /// Service to manage achievement evaluation, caching, manual unlocking, and notifications.
    /// </summary>
    public interface IAchievementService
    {
        /// <summary>
        /// Gets all achievements with current progress for a specific user.
        /// </summary>
        Task<IEnumerable<UserAchievementStatusDto>> GetUserAchievementsAsync(string userId);

        /// <summary>
        /// Scans user stats and unlocks any achievements where conditions are newly met.
        /// </summary>
        Task CheckAndUnlockAchievementsAsync(string userId);

        /// <summary>
        /// Explicitly unlocks an achievement (e.g., a region gym badge) for the user.
        /// </summary>
        Task<bool> UnlockAchievementManuallyAsync(string userId, string achievementId);
    }
}
