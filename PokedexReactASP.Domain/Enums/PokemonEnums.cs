namespace PokedexReactASP.Domain.Enums
{
    /// <summary>
    /// Pokemon Nature - affects stats by +10%/-10%
    /// Reference: https://bulbapedia.bulbagarden.net/wiki/Nature
    /// </summary>
    public enum Nature
    {
        // Neutral (no effect)
        Hardy = 0,      // Atk/Atk
        Docile = 1,     // Def/Def
        Serious = 2,    // Spd/Spd
        Bashful = 3,    // SpAtk/SpAtk
        Quirky = 4,     // SpDef/SpDef

        // Attack+
        Lonely = 5,     // +Atk, -Def
        Brave = 6,      // +Atk, -Spd
        Adamant = 7,    // +Atk, -SpAtk
        Naughty = 8,    // +Atk, -SpDef

        // Defense+
        Bold = 9,       // +Def, -Atk
        Relaxed = 10,   // +Def, -Spd
        Impish = 11,    // +Def, -SpAtk
        Lax = 12,       // +Def, -SpDef

        // Speed+
        Timid = 13,     // +Spd, -Atk
        Hasty = 14,     // +Spd, -Def
        Jolly = 15,     // +Spd, -SpAtk
        Naive = 16,     // +Spd, -SpDef

        // Sp. Attack+
        Modest = 17,    // +SpAtk, -Atk
        Mild = 18,      // +SpAtk, -Def
        Quiet = 19,     // +SpAtk, -Spd
        Rash = 20,      // +SpAtk, -SpDef

        // Sp. Defense+
        Calm = 21,      // +SpDef, -Atk
        Gentle = 22,    // +SpDef, -Def
        Sassy = 23,     // +SpDef, -Spd
        Careful = 24    // +SpDef, -SpAtk
    }

    /// <summary>
    /// Pokeball types with different catch rate multipliers
    /// </summary>
    public enum PokeballType
    {
        Pokeball = 0,       // 1.0x
        GreatBall = 1,      // 1.5x
        UltraBall = 2,      // 2.0x
        MasterBall = 3,     // Guaranteed catch
        
        // Special balls
        QuickBall = 10,     // 5.0x first turn, 1.0x after
        TimerBall = 11,     // Up to 4.0x based on turns
        DuskBall = 12,      // 3.0x at night/cave
        NetBall = 13,       // 3.5x for Water/Bug types
        DiveBall = 14,      // 3.5x underwater
        NestBall = 15,      // Better for low level
        RepeatBall = 16,    // 3.5x if already caught species
        LuxuryBall = 17,    // 1.0x but +1 friendship per catch
        PremierBall = 18,   // 1.0x (cosmetic)
        HealBall = 19,      // 1.0x but heals on catch
        
        // Rare balls
        SafariBall = 30,
        SportBall = 31,
        DreamBall = 32,
        BeastBall = 33      // 5.0x for Ultra Beasts, 0.1x otherwise
    }

    /// <summary>
    /// Pokemon overall rating based on IVs, Nature, and potential
    /// </summary>
    public enum PokemonRank
    {
        D = 0,      // < 50% potential
        C = 1,      // 50-65% potential
        B = 2,      // 65-80% potential
        A = 3,      // 80-90% potential
        S = 4,      // 90-95% potential
        SS = 5      // 95%+ potential (near perfect)
    }

    /// <summary>
    /// Result of a catch attempt
    /// </summary>
    public enum CatchAttemptResult
    {
        Success = 0,        // Pokemon caught!
        Escaped = 1,        // Ball shook but escaped
        Fled = 2,           // Pokemon ran away (rare)
        BallBroke = 3,      // Ball broke immediately
        AlreadyOwned = 4,   // For special event Pokemon
        InventoryFull = 5   // PC box full
    }

    /// <summary>
    /// Pokemon gender
    /// </summary>
    public enum PokemonGender
    {
        Male = 0,
        Female = 1,
        Genderless = 2
    }

    /// <summary>
    /// Time of day - affects certain catch rates and encounters
    /// </summary>
    public enum TimeOfDay
    {
        Morning = 0,    // 6:00 - 10:00
        Day = 1,        // 10:00 - 17:00
        Evening = 2,    // 17:00 - 20:00
        Night = 3       // 20:00 - 6:00
    }

    /// <summary>
    /// Location type - affects certain catch rates
    /// </summary>
    public enum LocationType
    {
        Grassland = 0,
        Forest = 1,
        Cave = 2,
        Water = 3,
        Mountain = 4,
        Desert = 5,
        Snow = 6,
        Urban = 7,
        Safari = 8
    }
}

