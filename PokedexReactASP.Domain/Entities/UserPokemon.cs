namespace PokedexReactASP.Domain.Entities
{
    // Join entity for the many-to-many relationship between User and Pokemon
    public class UserPokemon
    {
        public string UserId { get; set; } = string.Empty;
        public ApplicationUser User { get; set; } = null!; // Navigation property

        public int PokemonId { get; set; }
        public Pokemon Pokemon { get; set; } = null!; // Navigation property

        // Additional properties specific to the relationship
        public DateTime CaughtDate { get; set; } = DateTime.UtcNow;
        public string? Nickname { get; set; }
        public int Level { get; set; } = 5;
        public int Experience { get; set; } = 0;
        public bool IsFavorite { get; set; } = false;
    }
}
