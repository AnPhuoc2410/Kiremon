using PokedexReactASP.Domain.Enums;

namespace PokedexReactASP.Domain.Entities
{
    /// <summary>
    /// Represents a Pokemon caught by a user.
    /// </summary>
    public class UserPokemon
    {
        #region Identity

        public int Id { get; set; }

        public string UserId { get; set; } = string.Empty;
        public ApplicationUser User { get; set; } = null!;

        public int PokemonApiId { get; set; }

        #endregion

        #region Server-Determined Values

        /// <summary>
        /// Shiny status - rolled server-side with trainer level bonus
        /// </summary>
        public bool IsShiny { get; set; } = false;

        /// <summary>
        /// Nature affects stats by +10%/-10%
        /// </summary>
        public Nature Nature { get; set; } = Nature.Hardy;

        /// <summary>
        /// Gender - determined by species gender_rate from PokeAPI
        /// </summary>
        public PokemonGender Gender { get; set; } = PokemonGender.Genderless;

        /// <summary>
        /// Level when caught - scales with trainer level
        /// </summary>
        public int CaughtLevel { get; set; } = 5;

        /// <summary>
        /// Individual Values (0-31)
        /// </summary>
        public int IvHp { get; set; }
        public int IvAttack { get; set; }
        public int IvDefense { get; set; }
        public int IvSpecialAttack { get; set; }
        public int IvSpecialDefense { get; set; }
        public int IvSpeed { get; set; }

        #endregion

        #region Catch Information

        public DateTime CaughtDate { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Location where Pokemon was caught (e.g., "Route 1", "Viridian Forest")
        /// </summary>
        public string? CaughtLocation { get; set; }

        /// <summary>
        /// Type of Pokeball used to catch
        /// </summary>
        public PokeballType CaughtBall { get; set; } = PokeballType.Pokeball;

        #endregion

        #region User Customization

        public string? Nickname { get; set; }

        public bool IsFavorite { get; set; } = false;

        public string? Notes { get; set; }

        #endregion

        #region Current Stats (Mutable)

        /// <summary>
        /// Current level (can increase through battles/training)
        /// </summary>
        public int CurrentLevel { get; set; } = 5;

        /// <summary>
        /// Experience points towards next level
        /// </summary>
        public int CurrentExperience { get; set; } = 0;

        /// <summary>
        /// Current HP (for battle system)
        /// </summary>
        public int CurrentHp { get; set; } = 100;

        /// <summary>
        /// Friendship/Happiness (0-255) - affects evolution and moves
        /// </summary>
        public int Friendship { get; set; } = 70;

        #endregion

        #region Effort Values (Training)

        /// <summary>
        /// EVs gained from training/battles (0-252 each, 510 total max)
        /// </summary>
        public int EvHp { get; set; } = 0;
        public int EvAttack { get; set; } = 0;
        public int EvDefense { get; set; } = 0;
        public int EvSpecialAttack { get; set; } = 0;
        public int EvSpecialDefense { get; set; } = 0;
        public int EvSpeed { get; set; } = 0;

        #endregion

        #region Battle Stats

        public int BattlesWon { get; set; } = 0;
        public int BattlesLost { get; set; } = 0;
        public int TotalBattles { get; set; } = 0;

        #endregion

        #region Moves & Items

        /// <summary>
        /// Custom moves (store move IDs from PokeAPI, comma-separated)
        /// </summary>
        public string? CustomMoveIds { get; set; }

        /// <summary>
        /// Held item (item ID from PokeAPI)
        /// </summary>
        public int? HeldItemId { get; set; }

        #endregion

        #region Evolution & Trading

        /// <summary>
        /// Whether Pokemon is ready to evolve
        /// </summary>
        public bool CanEvolve { get; set; } = false;

        /// <summary>
        /// Track evolution chain (previous form's API ID)
        /// </summary>
        public int? EvolvedFromApiId { get; set; }

        /// <summary>
        /// Was this Pokemon received via trade?
        /// </summary>
        public bool IsTraded { get; set; } = false;

        /// <summary>
        /// Original trainer's ID (if traded)
        /// </summary>
        public string? OriginalTrainerId { get; set; }

        /// <summary>
        /// Original trainer's name (if traded)
        /// </summary>
        public string? OriginalTrainerName { get; set; }

        #endregion

        #region Metadata

        /// <summary>
        /// Last time user interacted with this Pokemon
        /// </summary>
        public DateTime LastInteractionDate { get; set; } = DateTime.UtcNow;

        #endregion

        #region Computed Properties

        /// <summary>
        /// Total IV sum (0-186)
        /// </summary>
        public int IvTotal => IvHp + IvAttack + IvDefense + IvSpecialAttack + IvSpecialDefense + IvSpeed;

        /// <summary>
        /// IV percentage (0-100%)
        /// </summary>
        public double IvPercentage => IvTotal / 186.0 * 100;

        /// <summary>
        /// Total EV sum (max 510)
        /// </summary>
        public int EvTotal => EvHp + EvAttack + EvDefense + EvSpecialAttack + EvSpecialDefense + EvSpeed;

        /// <summary>
        /// Win rate percentage
        /// </summary>
        public double WinRate => TotalBattles > 0 ? (double)BattlesWon / TotalBattles * 100 : 0;

        #endregion

        #region Location Management

        /// <summary>
        /// Verifies if the Pokemon is in the Party or in a Box
        /// </summary>
        public bool IsInParty { get; set; } = false;

        /// <summary>
        /// Slot index within Party or Box
        /// - If in Party: 0 to 5
        /// - If in Box: 0 to 29 (6x5 grid)
        /// </summary>
        public int SlotIndex { get; set; } = 0;

        /// <summary>
        /// Box's ID where this Pokemon is stored (null if IsInParty = true)
        /// </summary>
        public int? BoxId { get; set; }
        public virtual UserBox? Box { get; set; }

        /// <summary>
        /// Held item API ID for easy reference to PokeAPI data
        /// </summary>
        public int? HeldItemApiId { get; set; }

        #endregion
    }
}
