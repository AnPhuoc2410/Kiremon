using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PokedexReactASP.Domain.Entities
{
    /// <summary>Card reward rarity weight configuration stored in the database.</summary>
    public class CardRewardGlobalSetting
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        /// <summary>JSON map of rarity tier name → weight value. E.g. {"Common":55,"Rare":12}.</summary>
        [Column(TypeName = "jsonb")]
        public Dictionary<string, double> RarityWeights { get; set; } = new();
    }
}
