namespace PokedexReactASP.Domain.Entities
{
    public class PokemonBiomeTag
    {
        public int Id { get; set; }

        public int PokemonApiId { get; set; }

        public string Tag { get; set; } = string.Empty;

        public double Weight { get; set; } = 1.0;

        public bool IsManual { get; set; } = false;

        public string? Source { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
