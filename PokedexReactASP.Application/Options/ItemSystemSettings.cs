using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PokedexReactASP.Application.Options
{
    public class ItemSystemSettings
    {
        public const string SectionName = "ItemSystem";

        /// <summary>
        /// Stores overrides for item pockets and their categories.
        /// Key: Pocket name (e.g., "Treasures", "Medicine")
        /// Value: List of Categories under that Pocket
        /// </summary>
        public Dictionary<string, List<string>> PocketOverrides { get; set; } = new();

        public int DefaultBoxesCount { get; set; }
        public int BoxSlotsMax { get; set; }
    }
}
