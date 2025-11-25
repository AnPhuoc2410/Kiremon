using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;

namespace PokedexReactASP.Domain.Entities
{
    public class ApplicationUser : IdentityUser
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public DateTime DateJoined { get; set; } = DateTime.UtcNow;
        public string? AvatarUrl { get; set; }
        public int PokemonCaught { get; set; } = 0;
        public int Level { get; set; } = 1;
        public int Experience { get; set; } = 0;

        // Navigation property for the many-to-many relationship
        public ICollection<UserPokemon> UserPokemons { get; set; } = new List<UserPokemon>();
    }
}
