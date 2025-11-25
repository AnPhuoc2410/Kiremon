namespace PokedexReactASP.Domain.Entities
{
    /// <summary>
    /// Represents a Pokemon caught by a user. Pokemon data is fetched from PokeAPI using PokemonApiId.
    /// This entity stores only user-specific data and customizations.
    /// </summary>
    public class UserPokemon
    {
        // Primary key
        public int Id { get; set; }

        // Foreign key to User
        public string UserId { get; set; } = string.Empty;
        public ApplicationUser User { get; set; } = null!;

        // Reference to PokeAPI Pokemon (e.g., 25 for Pikachu)
        public int PokemonApiId { get; set; }

        // User customization
        public string? Nickname { get; set; }
        public bool IsFavorite { get; set; } = false;
        public bool IsShiny { get; set; } = false;
        
        // Catch information
        public DateTime CaughtDate { get; set; } = DateTime.UtcNow;
        public string? CaughtLocation { get; set; } // e.g., "Pallet Town", "Route 1"
        public int CaughtLevel { get; set; } = 5;

        // Current stats
        public int CurrentLevel { get; set; } = 5;
        public int CurrentExperience { get; set; } = 0;
        public int CurrentHp { get; set; } = 100; // For battle system
        
        // Individual Values (IVs) - for competitive features (0-31)
        public int? IvHp { get; set; }
        public int? IvAttack { get; set; }
        public int? IvDefense { get; set; }
        public int? IvSpecialAttack { get; set; }
        public int? IvSpecialDefense { get; set; }
        public int? IvSpeed { get; set; }

        // Effort Values (EVs) - for training system (0-252)
        public int EvHp { get; set; } = 0;
        public int EvAttack { get; set; } = 0;
        public int EvDefense { get; set; } = 0;
        public int EvSpecialAttack { get; set; } = 0;
        public int EvSpecialDefense { get; set; } = 0;
        public int EvSpeed { get; set; } = 0;

        // Battle and gameplay stats
        public int BattlesWon { get; set; } = 0;
        public int BattlesLost { get; set; } = 0;
        public int TotalBattles { get; set; } = 0;
        
        // Friendship/Happiness (0-255)
        public int Friendship { get; set; } = 70;
        
        // Custom moves (store move IDs from PokeAPI, comma-separated or JSON)
        public string? CustomMoveIds { get; set; } // e.g., "1,2,3,4" for 4 moves
        
        // Held item (item ID from PokeAPI)
        public int? HeldItemId { get; set; }
        
        // Evolution tracking
        public bool CanEvolve { get; set; } = false;
        public int? EvolvedFromApiId { get; set; } // Track evolution chain
        
        // Trading
        public bool IsTraded { get; set; } = false;
        public string? OriginalTrainerId { get; set; }
        public string? OriginalTrainerName { get; set; }
        
        // Additional metadata
        public string? Notes { get; set; } // User notes about this Pokemon
        public DateTime LastInteractionDate { get; set; } = DateTime.UtcNow;
    }
}
