/**
 * Pokemon Nature - affects stats by +10%/-10%
 */
export enum Nature {
  Hardy = 0,
  Docile = 1,
  Serious = 2,
  Bashful = 3,
  Quirky = 4,
  Lonely = 5,
  Brave = 6,
  Adamant = 7,
  Naughty = 8,
  Bold = 9,
  Relaxed = 10,
  Impish = 11,
  Lax = 12,
  Timid = 13,
  Hasty = 14,
  Jolly = 15,
  Naive = 16,
  Modest = 17,
  Mild = 18,
  Quiet = 19,
  Rash = 20,
  Calm = 21,
  Gentle = 22,
  Sassy = 23,
  Careful = 24,
}

/**
 * Pokemon Gender
 */
export enum PokemonGender {
  Male = 0,
  Female = 1,
  Genderless = 2,
}

/**
 * Pokemon Rank based on IVs
 */
export enum PokemonRank {
  D = 0,
  C = 1,
  B = 2,
  A = 3,
  S = 4,
  SS = 5,
}

/**
 * Pokeball types
 */
export enum PokeballType {
  Pokeball = 0,
  GreatBall = 1,
  UltraBall = 2,
  MasterBall = 3,
  QuickBall = 10,
  TimerBall = 11,
  DuskBall = 12,
  NetBall = 13,
  DiveBall = 14,
  NestBall = 15,
  RepeatBall = 16,
  LuxuryBall = 17,
  PremierBall = 18,
  HealBall = 19,
}

/**
 * Get nature display name
 */
export function getNatureDisplay(nature: Nature): string {
  const natureEffects: Record<Nature, string> = {
    [Nature.Hardy]: "Hardy (Neutral)",
    [Nature.Docile]: "Docile (Neutral)",
    [Nature.Serious]: "Serious (Neutral)",
    [Nature.Bashful]: "Bashful (Neutral)",
    [Nature.Quirky]: "Quirky (Neutral)",
    [Nature.Lonely]: "Lonely (+Atk, -Def)",
    [Nature.Brave]: "Brave (+Atk, -Spd)",
    [Nature.Adamant]: "Adamant (+Atk, -SpA)",
    [Nature.Naughty]: "Naughty (+Atk, -SpD)",
    [Nature.Bold]: "Bold (+Def, -Atk)",
    [Nature.Relaxed]: "Relaxed (+Def, -Spd)",
    [Nature.Impish]: "Impish (+Def, -SpA)",
    [Nature.Lax]: "Lax (+Def, -SpD)",
    [Nature.Timid]: "Timid (+Spd, -Atk)",
    [Nature.Hasty]: "Hasty (+Spd, -Def)",
    [Nature.Jolly]: "Jolly (+Spd, -SpA)",
    [Nature.Naive]: "Naive (+Spd, -SpD)",
    [Nature.Modest]: "Modest (+SpA, -Atk)",
    [Nature.Mild]: "Mild (+SpA, -Def)",
    [Nature.Quiet]: "Quiet (+SpA, -Spd)",
    [Nature.Rash]: "Rash (+SpA, -SpD)",
    [Nature.Calm]: "Calm (+SpD, -Atk)",
    [Nature.Gentle]: "Gentle (+SpD, -Def)",
    [Nature.Sassy]: "Sassy (+SpD, -Spd)",
    [Nature.Careful]: "Careful (+SpD, -SpA)",
  };
  return natureEffects[nature] || "Unknown";
}

/**
 * Get gender symbol
 */
export function getGenderSymbol(gender: PokemonGender): string {
  switch (gender) {
    case PokemonGender.Male:
      return "♂";
    case PokemonGender.Female:
      return "♀";
    default:
      return "⚲";
  }
}

/**
 * Get rank display
 */
export function getRankDisplay(rank: PokemonRank): string {
  switch (rank) {
    case PokemonRank.SS:
      return "✨ SS Rank! ✨";
    case PokemonRank.S:
      return "⭐ S Rank!";
    case PokemonRank.A:
      return "A Rank";
    case PokemonRank.B:
      return "B Rank";
    case PokemonRank.C:
      return "C Rank";
    default:
      return "D Rank";
  }
}

/**
 * Catch attempt result - matches backend CatchAttemptResult enum
 */
export enum CatchAttemptResult {
  Success = 0,
  Escaped = 1,
  Fled = 2,
}

/**
 * Get pokeball name
 */
export function getPokeballName(ball: PokeballType): string {
  const names: Record<PokeballType, string> = {
    [PokeballType.Pokeball]: "Poké Ball",
    [PokeballType.GreatBall]: "Great Ball",
    [PokeballType.UltraBall]: "Ultra Ball",
    [PokeballType.MasterBall]: "Master Ball",
    [PokeballType.QuickBall]: "Quick Ball",
    [PokeballType.TimerBall]: "Timer Ball",
    [PokeballType.DuskBall]: "Dusk Ball",
    [PokeballType.NetBall]: "Net Ball",
    [PokeballType.DiveBall]: "Dive Ball",
    [PokeballType.NestBall]: "Nest Ball",
    [PokeballType.RepeatBall]: "Repeat Ball",
    [PokeballType.LuxuryBall]: "Luxury Ball",
    [PokeballType.PremierBall]: "Premier Ball",
    [PokeballType.HealBall]: "Heal Ball",
  };
  return names[ball] || "Poké Ball";
}
