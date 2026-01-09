using PokedexReactASP.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PokedexReactASP.Domain.Entities
{
    public class UserItem
    {
        public int Id { get; set; }
        public string UserId { get; set; } = null!;
        public virtual ApplicationUser User { get; set; } = null!;

        #region PokeAPI Info
        public int ItemApiId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string SpriteUrl { get; set; } = string.Empty;
        public string? Description { get; set; }
        #endregion

        #region Classificationg
        public string PocketName { get; set; } = "misc";
        public string CategoryName { get; set; } = string.Empty;
        public int Quantity { get; set; } = 1;
        #endregion

        #region Logic Flags
        public bool IsHoldable { get; set; }   // Can be held by a Pokemon
        public bool IsConsumable { get; set; } // Can be discarded after use
        public bool UsableInBattle { get; set; } // Used during battles
        #endregion

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
