using System;
using System.Collections.Generic;

namespace PokedexReactASP.Domain.Entities
{
    /// <summary>
    /// OBSOLETE: This entity is no longer used. Pokemon data is fetched from PokeAPI.
    /// Only UserPokemon entity is needed to track user-specific Pokemon data.
    /// Keep this file for backward compatibility during migration, but it can be removed after database migration.
    /// </summary>
    [Obsolete("Pokemon entity is deprecated. Use PokeAPI for Pokemon data and UserPokemon for user-specific data.")]
    public class Pokemon
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type1 { get; set; } = string.Empty;
        public string? Type2 { get; set; } = null;
        public int Height { get; set; }
        public int Weight { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int BaseExperience { get; set; } = 100;
        public string? Category { get; set; }
        public string? Abilities { get; set; }
        
        public int Hp { get; set; }
        public int Attack { get; set; }
        public int Defense { get; set; }
        public int SpecialAttack { get; set; }
        public int SpecialDefense { get; set; }
        public int Speed { get; set; }

        public ICollection<UserPokemon> UserPokemons { get; set; } = new List<UserPokemon>();
    }
}
