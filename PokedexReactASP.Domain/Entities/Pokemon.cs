using System.Collections.Generic;

namespace PokedexReactASP.Domain.Entities
{
    public class Pokemon
    {
        public int Id { get; set; } // This could be the Pokedex ID
        public string Name { get; set; } = string.Empty;
        public string Type1 { get; set; } = string.Empty;
        public string? Type2 { get; set; } = null; // Nullable for dual-type Pokemon
        public int Height { get; set; } // Height in decimetres (e.g., 7 for 0.7m)
        public int Weight { get; set; } // Weight in hectograms (e.g., 60 for 6.0kg)
        public string ImageUrl { get; set; } = string.Empty; // URL to the Pokemon's image
        public string? Description { get; set; }
        public int BaseExperience { get; set; } = 100;
        public string? Category { get; set; }
        public string? Abilities { get; set; } // JSON string or comma-separated
        
        // Base stats
        public int Hp { get; set; }
        public int Attack { get; set; }
        public int Defense { get; set; }
        public int SpecialAttack { get; set; }
        public int SpecialDefense { get; set; }
        public int Speed { get; set; }

        // Navigation property for the many-to-many relationship
        public ICollection<UserPokemon> UserPokemons { get; set; } = new List<UserPokemon>();
    }
}
