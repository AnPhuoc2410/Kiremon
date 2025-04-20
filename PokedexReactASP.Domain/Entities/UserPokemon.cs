namespace PokedexReactASP.Domain.Entities
{
    // Join entity for the many-to-many relationship between User and Pokemon
    public class UserPokemon
    {
        public int TrainerId { get; set; }
        public Trainer Trainer { get; set; } = null!; // Navigation property

        public int PokemonId { get; set; }
        public Pokemon Pokemon { get; set; } = null!; // Navigation property

        // You could add additional properties specific to the relationship, e.g.:
        public DateTime CaughtDate { get; set; }
        // public string? Nickname { get; set; }
    }
}
