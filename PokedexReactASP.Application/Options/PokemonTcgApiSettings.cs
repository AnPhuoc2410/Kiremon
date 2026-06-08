namespace PokedexReactASP.Application.Options
{
    public class PokemonTcgApiSettings
    {
        public const string SectionName = "PokemonTcgApi";

        public string BaseUrl { get; set; } = "https://api.pokemontcg.io/v2/";
        public string ApiKey { get; set; } = string.Empty;
        public int CacheDurationHours { get; set; } = 168;
    }
}
