namespace PokedexReactASP.Application.DTOs.Pokemon
{
    /// <summary>
    /// DTO for user's caught Pokemon with PokeAPI data enrichment
    /// </summary>
    public class UserPokemonDto
    {
        // Database fields
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public int PokemonApiId { get; set; }
        
        // Customization
        public string? Nickname { get; set; }
        public bool IsFavorite { get; set; }
        public bool IsShiny { get; set; }
        
        // Catch information
        public DateTime CaughtDate { get; set; }
        public string? CaughtLocation { get; set; }
        public int CaughtLevel { get; set; }
        
        // Current stats
        public int CurrentLevel { get; set; }
        public int CurrentExperience { get; set; }
        public int ExperienceToNextLevel { get; set; }
        public int CurrentHp { get; set; }
        public int MaxHp { get; set; }
        
        // IVs (Individual Values)
        public int? IvHp { get; set; }
        public int? IvAttack { get; set; }
        public int? IvDefense { get; set; }
        public int? IvSpecialAttack { get; set; }
        public int? IvSpecialDefense { get; set; }
        public int? IvSpeed { get; set; }
        public int? IvTotal { get; set; }
        public string? IvRating { get; set; } // "Perfect", "Amazing", "Good", etc.
        
        // EVs (Effort Values)
        public int EvHp { get; set; }
        public int EvAttack { get; set; }
        public int EvDefense { get; set; }
        public int EvSpecialAttack { get; set; }
        public int EvSpecialDefense { get; set; }
        public int EvSpeed { get; set; }
        public int EvTotal { get; set; }
        
        // Battle stats
        public int BattlesWon { get; set; }
        public int BattlesLost { get; set; }
        public int TotalBattles { get; set; }
        public decimal WinRate { get; set; }
        
        // Gameplay
        public int Friendship { get; set; }
        public string FriendshipLevel { get; set; } = string.Empty; // "Low", "Medium", "High", "Max"
        public List<int>? CustomMoveIds { get; set; }
        public int? HeldItemId { get; set; }
        
        // Evolution
        public bool CanEvolve { get; set; }
        public int? EvolvedFromApiId { get; set; }
        public List<int>? EvolutionChain { get; set; }
        
        // Trading
        public bool IsTraded { get; set; }
        public string? OriginalTrainerName { get; set; }
        
        // From PokeAPI
        public string Name { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty; // Nickname or Name
        public string Type1 { get; set; } = string.Empty;
        public string? Type2 { get; set; }
        public int Height { get; set; }
        public int Weight { get; set; }
        public string SpriteUrl { get; set; } = string.Empty;
        public string? OfficialArtworkUrl { get; set; }
        public string? Category { get; set; }
        public List<string> Abilities { get; set; } = new();
        
        // Base stats from PokeAPI
        public int BaseHp { get; set; }
        public int BaseAttack { get; set; }
        public int BaseDefense { get; set; }
        public int BaseSpecialAttack { get; set; }
        public int BaseSpecialDefense { get; set; }
        public int BaseSpeed { get; set; }
        public int BaseStatTotal { get; set; }
        
        // Calculated stats (base + IVs + EVs)
        public int CalculatedHp { get; set; }
        public int CalculatedAttack { get; set; }
        public int CalculatedDefense { get; set; }
        public int CalculatedSpecialAttack { get; set; }
        public int CalculatedSpecialDefense { get; set; }
        public int CalculatedSpeed { get; set; }
        
        // Metadata
        public string? Notes { get; set; }
        public DateTime LastInteractionDate { get; set; }
        public TimeSpan TimeSinceCaught { get; set; }
    }

    /// <summary>
    /// DTO for updating user's Pokemon
    /// </summary>
    public class UpdateUserPokemonDto
    {
        public string? Nickname { get; set; }
        public bool? IsFavorite { get; set; }
        public List<int>? CustomMoveIds { get; set; }
        public int? HeldItemId { get; set; }
        public string? Notes { get; set; }
    }

    /// <summary>
    /// DTO for Pokemon battle result
    /// </summary>
    public class PokemonBattleResultDto
    {
        public int UserPokemonId { get; set; }
        public bool Won { get; set; }
        public int ExperienceGained { get; set; }
        public int EvHpGained { get; set; }
        public int EvAttackGained { get; set; }
        public int EvDefenseGained { get; set; }
        public int EvSpecialAttackGained { get; set; }
        public int EvSpecialDefenseGained { get; set; }
        public int EvSpeedGained { get; set; }
        public bool LeveledUp { get; set; }
        public int NewLevel { get; set; }
        public bool CanEvolve { get; set; }
    }

    /// <summary>
    /// DTO for Pokemon summary (for lists)
    /// </summary>
    public class UserPokemonSummaryDto
    {
        public int Id { get; set; }
        public int PokemonApiId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public string Type1 { get; set; } = string.Empty;
        public string? Type2 { get; set; }
        public string SpriteUrl { get; set; } = string.Empty;
        public int CurrentLevel { get; set; }
        public bool IsFavorite { get; set; }
        public bool IsShiny { get; set; }
        public int CurrentHp { get; set; }
        public int MaxHp { get; set; }
    }

    /// <summary>
    /// DTO for evolution
    /// </summary>
    public class EvolvePokemonDto
    {
        public int UserPokemonId { get; set; }
        public int EvolvesToApiId { get; set; }
    }

    /// <summary>
    /// DTO for trading Pokemon
    /// </summary>
    public class TradePokemonDto
    {
        public int UserPokemonId { get; set; }
        public string ToUserId { get; set; } = string.Empty;
        public int? ForUserPokemonId { get; set; } // Optional: trading for another Pokemon
    }
}
