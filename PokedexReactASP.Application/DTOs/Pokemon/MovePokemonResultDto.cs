namespace PokedexReactASP.Application.DTOs.Pokemon
{
    public class MovePokemonResultDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public int? SwappedPokemonId { get; set; } // null if no swap
        public int? SourceBoxId { get; set; }
        public int? TargetBoxId { get; set; }
    }
}
