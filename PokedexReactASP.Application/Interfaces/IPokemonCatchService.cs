using PokedexReactASP.Application.DTOs.Pokemon;

namespace PokedexReactASP.Application.Interfaces
{
    /// <summary>
    /// Catch mechanics, Pokemon management (nickname, notes, favorite, interact, release).
    /// </summary>
    public interface IPokemonCatchService
    {
        /// <summary>
        /// Server-authoritative catch attempt with catch-rate calculation, shake animation data,
        /// and trainer EXP reward even on failure.
        /// </summary>
        Task<CatchAttemptResultDto> AttemptCatchPokemonAsync(string userId, CatchAttemptDto request);

        /// <summary>
        /// Legacy catch that always succeeds — used for testing/debug flows.
        /// Prefer <see cref="AttemptCatchPokemonAsync"/> in production.
        /// </summary>
        Task<CatchResultDto> CatchPokemonAsync(string userId, CatchPokemonDto catchPokemonDto);

        /// <summary>Removes a Pokemon from the collection and adjusts trainer counters.</summary>
        Task<bool> ReleasePokemonAsync(string userId, int userPokemonId);

        /// <summary>
        /// Sets or clears the Pokemon's nickname.
        /// Returns (Success, FinalName) where FinalName is the unique name actually stored.
        /// </summary>
        Task<(bool Success, string? ResultName)> UpdatePokemonNicknameAsync(string userId, int userPokemonId, string nickname);

        /// <summary>Toggles the favorite flag on a Pokemon.</summary>
        Task<bool> ToggleFavoritePokemonAsync(string userId, int userPokemonId);

        /// <summary>Persists free-text trainer notes on a Pokemon.</summary>
        Task<bool> UpdatePokemonNotesAsync(string userId, int userPokemonId, string notes);

        /// <summary>Daily interaction that increases friendship by 1 (max 255). Returns false if already interacted today.</summary>
        Task<bool> InteractWithPokemonAsync(string userId, int userPokemonId);
    }
}
