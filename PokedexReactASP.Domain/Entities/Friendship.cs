using System;

namespace PokedexReactASP.Domain.Entities
{
    /// <summary>
    /// Represents a friendship relationship between two users.
    /// Each friendship is stored once (User1Id < User2Id to avoid duplicates).
    /// </summary>
    public class Friendship
    {
        public int Id { get; set; }

        public string User1Id { get; set; } = string.Empty;
        public ApplicationUser User1 { get; set; } = null!;
        public string User2Id { get; set; } = string.Empty;
        public ApplicationUser User2 { get; set; } = null!;

        public DateTime FriendsSince { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Friendship level (increases with interactions like trading, battling)
        /// </summary>
        public int FriendshipLevel { get; set; } = 1;
        public int SharedExperience { get; set; } = 0;
        public int TradesCompleted { get; set; } = 0;
        public int BattlesTogether { get; set; } = 0;
        public string? User1NicknameForUser2 { get; set; }
        public string? User2NicknameForUser1 { get; set; }
        public DateTime LastInteraction { get; set; } = DateTime.UtcNow;
    }
}
