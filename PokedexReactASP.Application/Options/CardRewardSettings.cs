using PokedexReactASP.Domain.Enums;

namespace PokedexReactASP.Application.Options
{
    public class CardRewardSettings
    {
        public const string SectionName = "CardReward";
        public Dictionary<string, double> RarityWeights { get; set; } = new();

        public Dictionary<TcgCardRarityTier, double> BuildWeights()
        {
            var result = new Dictionary<TcgCardRarityTier, double>();
            foreach (var kv in RarityWeights)
            {
                if (Enum.TryParse<TcgCardRarityTier>(kv.Key, true, out var tier) && kv.Value > 0)
                {
                    result[tier] = kv.Value;
                }
            }

            if (result.Count == 0)
            {
                result[TcgCardRarityTier.Common] = 1;
            }

            return result;
        }
    }
}
