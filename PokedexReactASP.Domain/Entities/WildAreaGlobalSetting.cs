using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PokedexReactASP.Domain.Entities
{
    public class WildAreaGlobalSetting
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        
        public int ResetIntervalMinutes { get; set; } = 60;
        public int SpawnCount { get; set; } = 10;
        public int MaxAttemptsPerSpawn { get; set; } = 3;
        public int MaxGeneration { get; set; } = 9;
        public bool AllowLegendarySpawn { get; set; } = false;
        
        [Column(TypeName = "jsonb")]
        public Dictionary<string, double> SpawnWeights { get; set; } = new();
    }
}
