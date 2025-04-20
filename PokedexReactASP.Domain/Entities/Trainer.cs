using System;
using System.Collections.Generic;

namespace PokedexReactASP.Domain.Entities
{
    public class Trainer
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime DateJoined { get; set; }
        public string PasswordHash { get; set; } = string.Empty; // Store a hash, not the plain password

        // Navigation property for the many-to-many relationship
        public ICollection<UserPokemon> UserPokemons { get; set; } = new List<UserPokemon>();
    }
}
