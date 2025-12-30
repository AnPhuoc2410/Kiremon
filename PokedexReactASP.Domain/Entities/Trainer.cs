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

        /// <summary>
        /// Unique friend code for adding friends (like Pokemon GO)
        /// Format: XXXX-XXXX-XXXX (12 alphanumeric characters)
        /// </summary>
        public string FriendCode { get; set; } = GenerateFriendCode();

        /// <summary>
        /// Whether to allow friend requests
        /// </summary>
        public bool AllowFriendRequests { get; set; } = true;
        
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

        // Navigation properties
        public ICollection<UserPokemon> UserPokemons { get; set; } = new List<UserPokemon>();
        
        // Friendships where this user is User1
        public ICollection<Friendship> FriendshipsAsUser1 { get; set; } = new List<Friendship>();
        
        // Friendships where this user is User2
        public ICollection<Friendship> FriendshipsAsUser2 { get; set; } = new List<Friendship>();
        
        // Friend requests sent by this user
        public ICollection<FriendRequest> SentFriendRequests { get; set; } = new List<FriendRequest>();
        
        // Friend requests received by this user
        public ICollection<FriendRequest> ReceivedFriendRequests { get; set; } = new List<FriendRequest>();

        private static readonly Random _friendCodeRandom = new Random();
        private static readonly object _friendCodeRandomLock = new object();
        /// <summary>
        /// Generate a unique friend code
        /// </summary>
        private static string GenerateFriendCode()
        {
            const string chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Excluded confusing chars: I, O, 0, 1
            var code = new char[12];
            lock (_friendCodeRandomLock)
            {
                for (int i = 0; i < 12; i++)
                {
                    code[i] = chars[_friendCodeRandom.Next(chars.Length)];
                }
            }
            return $"{new string(code, 0, 4)}-{new string(code, 4, 4)}-{new string(code, 8, 4)}";
        }
    }
}
