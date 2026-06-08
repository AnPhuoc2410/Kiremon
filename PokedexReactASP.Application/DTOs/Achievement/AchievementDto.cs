using System;

namespace PokedexReactASP.Application.DTOs.Achievement
{
    /// <summary>
    /// Details of an achievement with user progress.
    /// </summary>
    public class UserAchievementStatusDto
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty; // Progression | Collection | Social | Badges
        public string Rarity { get; set; } = string.Empty; // Bronze | Silver | Gold | Platinum
        public int CurrentProgress { get; set; }
        public int TargetValue { get; set; }
        public bool IsUnlocked { get; set; }
        public DateTime? UnlockedAt { get; set; }
        public int RewardCoins { get; set; }
        public string Icon { get; set; } = string.Empty;
        public string? Region { get; set; }
    }

    /// <summary>
    /// Details pushed via SignalR when an achievement is unlocked.
    /// </summary>
    public class AchievementNotificationDto
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Rarity { get; set; } = string.Empty;
        public int RewardCoins { get; set; }
        public string Icon { get; set; } = string.Empty;
        public string? Region { get; set; }
    }
}
