using System.ComponentModel.DataAnnotations;
using PokedexReactASP.Domain.Enums;

namespace PokedexReactASP.Application.DTOs.Pokemon
{
    /// <summary>
    /// Client request for catch attempt - MINIMAL data only!
    /// Server decides: IV, Shiny, Level, Gender, Nature
    /// </summary>
    public class CatchAttemptDto
    {
        /// <summary>
        /// Pokemon ID from PokeAPI (e.g., 25 for Pikachu)
        /// </summary>
        [Required]
        [Range(1, 10000)]
        public int PokemonApiId { get; set; }

        /// <summary>
        /// Where the Pokemon was encountered
        /// </summary>
        [StringLength(100)]
        public string? CaughtLocation { get; set; }

        /// <summary>
        /// Type of Pokeball used (affects catch rate)
        /// </summary>
        public PokeballType PokeballType { get; set; } = PokeballType.Pokeball;

        /// <summary>
        /// Optional: Nickname to give if caught
        /// </summary>
        [StringLength(50)]
        public string? Nickname { get; set; }
    }

    /// <summary>
    /// Result of a catch attempt - comprehensive response
    /// </summary>
    public class CatchAttemptResultDto
    {
        /// <summary>
        /// What happened with the catch attempt
        /// </summary>
        public CatchAttemptResult Result { get; set; }

        /// <summary>
        /// Human-readable message
        /// </summary>
        public string Message { get; set; } = string.Empty;

        /// <summary>
        /// How many times the ball shook (0-3, 3 = caught)
        /// </summary>
        public int ShakeCount { get; set; }

        /// <summary>
        /// If successful, the caught Pokemon details
        /// </summary>
        public CaughtPokemonDto? CaughtPokemon { get; set; }

        /// <summary>
        /// Experience gained by trainer (even on failure)
        /// </summary>
        public int TrainerExpGained { get; set; }

        /// <summary>
        /// Did trainer level up?
        /// </summary>
        public bool TrainerLeveledUp { get; set; }

        /// <summary>
        /// New trainer level (if leveled up)
        /// </summary>
        public int NewTrainerLevel { get; set; }

        /// <summary>
        /// Is this the first time catching this species?
        /// </summary>
        public bool IsNewSpecies { get; set; }

        /// <summary>
        /// Catch rate percentage that was calculated (for transparency)
        /// </summary>
        public double CatchRatePercent { get; set; }

        /// <summary>
        /// Pokeball consumed (for inventory management)
        /// </summary>
        public PokeballType PokeballUsed { get; set; }
    }

    /// <summary>
    /// Details of caught Pokemon - what client sees
    /// </summary>
    public class CaughtPokemonDto
    {
        public int Id { get; set; }
        public int PokemonApiId { get; set; }
        
        // Basic info
        public string Name { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public string? Nickname { get; set; }
        public string SpriteUrl { get; set; } = string.Empty;
        public string Type1 { get; set; } = string.Empty;
        public string? Type2 { get; set; }

        // Server-determined values (THE EXCITING REVEAL!)
        public bool IsShiny { get; set; }
        public int Level { get; set; }
        public Nature Nature { get; set; }
        public PokemonGender Gender { get; set; }

        // IV Summary (not raw values - creates excitement)
        public PokemonRank Rank { get; set; }
        public string RankDisplay { get; set; } = string.Empty;  // "S Rank!", "A Rank"
        public int IvTotal { get; set; }                         // 0-186
        public double IvPercent { get; set; }                    // 0-100%
        public string IvVerdict { get; set; } = string.Empty;    // "Perfect!", "Amazing", etc.
        
        // Best stat (creates excitement: "Best stat: Attack!")
        public string BestStatName { get; set; } = string.Empty;
        public int BestStatIv { get; set; }

        // Catch details
        public DateTime CaughtDate { get; set; }
        public string? CaughtLocation { get; set; }
        public PokeballType CaughtBall { get; set; }

        // Rarity indicators
        public bool IsLegendary { get; set; }
        public bool IsMythical { get; set; }
        public bool IsUltraBeast { get; set; }
    }
}

