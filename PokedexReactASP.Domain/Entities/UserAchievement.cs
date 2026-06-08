
namespace PokedexReactASP.Domain.Entities
{
    /// <summary>
    /// Tracks an individual trainer's progress and unlock state for a specific achievement or badge.
    /// </summary>
    public class UserAchievement
    {
        public int Id { get; set; }
        
        public string UserId { get; set; } = string.Empty;
        public string AchievementId { get; set; } = string.Empty;
        
        public int Progress { get; set; }
        public bool IsUnlocked { get; set; }
        public DateTime? UnlockedAt { get; set; }

        // Navigation properties
        public ApplicationUser User { get; set; } = null!;
        public Achievement Achievement { get; set; } = null!;
    }
}
