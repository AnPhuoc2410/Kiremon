namespace PokedexReactASP.Application.DTOs.User
{
    /// <summary>
    /// DTO for trainer profile with enhanced statistics
    /// </summary>
    public class TrainerProfileDto
    {
        public string Id { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        
        // Personal Info
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? AvatarUrl { get; set; }
        public string? Bio { get; set; }
        public string? FavoriteType { get; set; }
        public DateTime DateJoined { get; set; }
        
        // Progression
        public int TrainerLevel { get; set; }
        public int TotalExperience { get; set; }
        public int CurrentLevelExperience { get; set; }
        public int ExperienceToNextLevel { get; set; }
        
        // Pokedex Statistics
        public int PokemonCaught { get; set; }
        public int UniquePokemonCaught { get; set; }
        public int ShinyPokemonCaught { get; set; }
        public int LegendaryPokemonCaught { get; set; }
        public decimal PokedexCompletion { get; set; }
        
        // Battle Statistics
        public int TotalBattles { get; set; }
        public int BattlesWon { get; set; }
        public int BattlesLost { get; set; }
        public decimal WinRate { get; set; }
        public int WinStreak { get; set; }
        public int BestWinStreak { get; set; }
        
        // Resources
        public int Coins { get; set; }
        public int PokeBalls { get; set; }
        public int GreatBalls { get; set; }
        public int UltraBalls { get; set; }
        public int MasterBalls { get; set; }
        
        // Achievements & Badges
        public List<string> Achievements { get; set; } = new();
        public List<string> Badges { get; set; } = new();
        
        // Location
        public string? CurrentRegion { get; set; }
        public string? CurrentLocation { get; set; }
        
        // Social
        public int FriendsCount { get; set; }
        public int TradesCompleted { get; set; }
        
        // Activity
        public DateTime LastActiveDate { get; set; }
        public int DaysPlayed { get; set; }
        public int HoursPlayed { get; set; }
        
        // Preferences
        public bool ShowOnlineStatus { get; set; }
        public bool AllowTradeRequests { get; set; }
        public bool AllowBattleRequests { get; set; }
        
        // Statistics
        public int TotalPokemon { get; set; }
        public int FavoritePokemonCount { get; set; }
    }

    /// <summary>
    /// DTO for updating trainer profile
    /// </summary>
    public class UpdateTrainerProfileDto
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? AvatarUrl { get; set; }
        public string? Bio { get; set; }
        public string? FavoriteType { get; set; }
        public string? CurrentRegion { get; set; }
        public string? CurrentLocation { get; set; }
        public bool ShowOnlineStatus { get; set; }
        public bool AllowTradeRequests { get; set; }
        public bool AllowBattleRequests { get; set; }
    }

    /// <summary>
    /// DTO for trainer leaderboard
    /// </summary>
    public class TrainerLeaderboardDto
    {
        public string Id { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string? AvatarUrl { get; set; }
        public int TrainerLevel { get; set; }
        public int PokemonCaught { get; set; }
        public int UniquePokemonCaught { get; set; }
        public int BattlesWon { get; set; }
        public decimal WinRate { get; set; }
        public int Rank { get; set; }
    }
}
