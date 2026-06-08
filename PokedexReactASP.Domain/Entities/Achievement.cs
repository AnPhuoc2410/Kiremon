namespace PokedexReactASP.Domain.Entities
{
    /// <summary>
    /// Represents static metadata for achievements or badges.
    /// </summary>
    public class Achievement
    {
        public string Id { get; set; } = string.Empty; // e.g. "kanto_badge_brock"
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty; // Progression | Collection | Social | Badges
        public string Rarity { get; set; } = string.Empty; // Bronze | Silver | Gold | Platinum
        public int TargetValue { get; set; }
        public int RewardCoins { get; set; }
        public string Icon { get; set; } = string.Empty;
        public string? Region { get; set; } // e.g., "Kanto", "Johto", or null for general achievements

        // Navigation property for user progress records
        public ICollection<UserAchievement> UserAchievements { get; set; } = new List<UserAchievement>();
    }
}
