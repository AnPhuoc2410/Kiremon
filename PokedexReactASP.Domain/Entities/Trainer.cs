using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;

namespace PokedexReactASP.Domain.Entities
{

    public class ApplicationUser : IdentityUser
    {
        // Personal information
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public DateTime DateJoined { get; set; } = DateTime.UtcNow;
        public string? AvatarUrl { get; set; }
        public string? Bio { get; set; }
        public string? FavoriteType { get; set; }
        
        // Trainer progression
        public int TrainerLevel { get; set; } = 1;
        public int TotalExperience { get; set; } = 0;
        public int CurrentLevelExperience { get; set; } = 0;
        
        // Pokedex statistics
        public int PokemonCaught { get; set; } = 0;
        public int UniquePokemonCaught { get; set; } = 0; // Distinct Pokemon species
        public int ShinyPokemonCaught { get; set; } = 0;
        public int LegendaryPokemonCaught { get; set; } = 0;
        
        // Battle statistics
        public int TotalBattles { get; set; } = 0;
        public int BattlesWon { get; set; } = 0;
        public int BattlesLost { get; set; } = 0;
        public int WinStreak { get; set; } = 0;
        public int BestWinStreak { get; set; } = 0;
        
        // Game currency and resources
        public int Coins { get; set; } = 1000;
        public int PokeBalls { get; set; } = 10;
        public int GreatBalls { get; set; } = 0;
        public int UltraBalls { get; set; } = 0;
        public int MasterBalls { get; set; } = 0;
        
        public string? Achievements { get; set; }
        public string? Badges { get; set; }
        
        // Location and region
        public string? CurrentRegion { get; set; } // e.g., "Kanto", "Johto"
        public string? CurrentLocation { get; set; } // e.g., "Pallet Town"
        
        // Social features
        public int FriendsCount { get; set; } = 0;
        public int TradesCompleted { get; set; } = 0;
        
        // Activity tracking
        public DateTime LastActiveDate { get; set; } = DateTime.UtcNow;
        public int DaysPlayed { get; set; } = 0;
        public int HoursPlayed { get; set; } = 0;
        
        // Preferences
        public bool ShowOnlineStatus { get; set; } = true;
        public bool AllowTradeRequests { get; set; } = true;
        public bool AllowBattleRequests { get; set; } = true;

        // Navigation property
        public ICollection<UserPokemon> UserPokemons { get; set; } = new List<UserPokemon>();
    }
}
