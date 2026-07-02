using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PokedexReactASP.Domain.Entities
{
    public class WildAreaEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Code { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        public int? SpawnCount { get; set; }
        public int? ResetIntervalMinutes { get; set; }

        public List<string> AllowedTypes { get; set; } = new();
        public List<string> PreferredTypes { get; set; } = new();
        public List<string> BannedTypes { get; set; } = new();

        public List<string> AllowedHabitats { get; set; } = new();
        public List<string> PreferredHabitats { get; set; } = new();

        public List<string> RequiredAnyTags { get; set; } = new();
        public List<string> PreferredTags { get; set; } = new();
        public List<string> AllowedTags { get; set; } = new();
        public List<string> BannedTags { get; set; } = new();

        public List<string> RequiredAnyTypes { get; set; } = new();
        public List<string> SecondaryAllowedTypes { get; set; } = new();
        
        public List<int> SafeFallbackPokemonIds { get; set; } = new();

        public int? MinGeneration { get; set; }
        public int? MaxGeneration { get; set; }
        public bool? AllowLegendary { get; set; }
        public bool? AllowMythical { get; set; }
        public bool? AllowBaby { get; set; }

        [Column(TypeName = "jsonb")]
        public Dictionary<string, double> RarityWeights { get; set; } = new();
    }
}
