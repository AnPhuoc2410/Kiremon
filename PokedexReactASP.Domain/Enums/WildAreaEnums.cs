namespace PokedexReactASP.Domain.Enums
{
    public enum WildSpawnRarity
    {
        Common = 1,
        Uncommon = 2,
        Rare = 3,
        Epic = 4,
        Legendary = 5
    }

    public enum TcgCardRarityTier
    {
        Common = 1,
        Uncommon = 2,
        Rare = 3,
        HoloRare = 4,
        UltraRare = 5,
        SecretRare = 6,
        Promo = 7,
        Unknown = 99
    }

    public enum CardRewardSource
    {
        WildAreaCatch = 1,
        DailyReward = 2,
        EventReward = 3,
        AchievementReward = 4
    }
}
