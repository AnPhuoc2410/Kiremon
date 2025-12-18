using PokedexReactASP.Domain.Enums;

namespace PokedexReactASP.Application.Models.GameMechanics
{
    /// <summary>
    /// Context for catch calculation
    /// </summary>
    public record CatchCalculationContext(
        // From PokeAPI Species
        int BaseCaptureRate,    // capture_rate: 3-255
        bool IsLegendary,       // is_legendary
        bool IsMythical,        // is_mythical
        bool IsBaby,            // is_baby (easier to catch)
        
        // Pokemon state
        int PokemonLevel,
        int CurrentHp,          // Current HP
        int MaxHp,              // Max HP
        string? StatusCondition, // sleep, freeze, paralysis, etc.
        
        // Player factors
        int TrainerLevel,
        PokeballType PokeballUsed,
        bool HasCaughtBefore,   // For Repeat Ball
        
        // Environment
        TimeOfDay TimeOfDay,
        LocationType LocationType,
        int TurnCount = 1);
}
