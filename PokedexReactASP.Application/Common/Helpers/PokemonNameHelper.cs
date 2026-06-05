namespace PokedexReactASP.Application.Common.Helpers
{
    /// <summary>
    /// Shared string utilities for Pokemon name formatting.
    /// Centralizes logic previously duplicated in UserService, PokemonFactoryService, and PokemonEnricherService.
    /// </summary>
    public static class PokemonNameHelper
    {
        /// <summary>
        /// Capitalizes the first character of a string and returns the result.
        /// Returns the original string unchanged if it is null or empty.
        /// </summary>
        /// <param name="input">The string to capitalize.</param>
        /// <returns>String with the first character uppercased.</returns>
        public static string CapitalizeFirst(string input) =>
            string.IsNullOrEmpty(input) ? input : char.ToUpper(input[0]) + input[1..];
    }
}
