using PokedexReactASP.Domain.Enums;

namespace PokedexReactASP.Application.Models.GameMechanics
{
    /// <summary>
    /// Context for creating a new Pokemon
    /// </summary>
    public record PokemonCreationContext(
        string UserId,
        int PokemonApiId,
        string PokemonName,
        string? Nickname,
        string? CaughtLocation,
        PokeballType CaughtBall,
        int TrainerLevel,
        int TotalPokemonCaught,
        int CatchStreak,
        bool HasShinyCharm,
        bool IsLegendary,
        bool IsMythical,
        bool IsBaby,
        int BaseCaptureRate,
        int BaseExperience,
        string Type1,
        string? Type2,
        string SpriteUrl,
        string? ShinySpriteUrl,
        int GenderRate);
}
