import { CatchAttemptResult, Nature, PokemonGender, PokemonRank, PokeballType } from "./pokemon.enums";

export interface UserPokemonDto {
  id: number;
  userId: string;
  pokemonApiId: number;
  nickname: string | null;
  isFavorite: boolean;
  isShiny: boolean;

  nature: Nature;
  natureDisplay: string;
  gender: PokemonGender;
  genderDisplay: string;
  rank: PokemonRank;
  rankDisplay: string;

  // Catch info
  caughtDate: string;
  caughtLocation: string | null;
  caughtLevel: number;
  caughtBall: PokeballType;

  // Current stats
  currentLevel: number;
  currentExperience: number;
  experienceToNextLevel: number;
  currentHp: number;
  maxHp: number;

  // IVs (server-generated)
  ivHp: number | null;
  ivAttack: number | null;
  ivDefense: number | null;
  ivSpecialAttack: number | null;
  ivSpecialDefense: number | null;
  ivSpeed: number | null;
  ivTotal: number | null;
  ivRating: string | null;

  // EVs
  evHp: number;
  evAttack: number;
  evDefense: number;
  evSpecialAttack: number;
  evSpecialDefense: number;
  evSpeed: number;
  evTotal: number;

  // Battle
  battlesWon: number;
  battlesLost: number;
  totalBattles: number;
  winRate: number;

  // Gameplay
  friendship: number;
  friendshipLevel: string;
  canEvolve: boolean;
  isTraded: boolean;
  originalTrainerName: string | null;

  // From PokeAPI
  name: string;
  displayName: string;
  type1: string;
  type2: string | null;
  height: number;
  weight: number;
  spriteUrl: string;
  officialArtworkUrl: string | null;
  abilities: string[];

  // Base stats
  baseHp: number;
  baseAttack: number;
  baseDefense: number;
  baseSpecialAttack: number;
  baseSpecialDefense: number;
  baseSpeed: number;
  baseStatTotal: number;

  // Calculated stats
  calculatedHp: number;
  calculatedAttack: number;
  calculatedDefense: number;
  calculatedSpecialAttack: number;
  calculatedSpecialDefense: number;
  calculatedSpeed: number;
  notes: string | null;
}


export interface CatchPokemonRequest {
  pokemonApiId: number;
  nickname?: string;
  caughtLocation?: string;
}

/**
 * Request for catch attempt with Game Mechanics
 */
export interface CatchAttemptRequest {
  pokemonApiId: number;
  caughtLocation?: string;
  pokeballType?: PokeballType;
  nickname?: string;
}

/**
 * Caught Pokemon details from server
 */
export interface CaughtPokemonDto {
  id: number;
  pokemonApiId: number;
  name: string;
  displayName: string;
  nickname: string | null;
  spriteUrl: string;
  type1: string;
  type2: string | null;
  isShiny: boolean;
  level: number;
  nature: Nature;
  gender: PokemonGender;
  rank: PokemonRank;
  rankDisplay: string;
  ivTotal: number;
  ivPercent: number;
  ivVerdict: string;
  bestStatName: string;
  bestStatIv: number;
  caughtDate: string;
  caughtLocation: string | null;
  caughtBall: PokeballType;
  isLegendary: boolean;
  isMythical: boolean;
  isUltraBeast: boolean;
}

/**
 * Result of catch attempt with Game Mechanics
 */
export interface CatchAttemptResultDto {
  result: CatchAttemptResult;
  message: string;
  shakeCount: number; // 0-3, 3 = caught
  caughtPokemon: CaughtPokemonDto | null;
  trainerExpGained: number;
  trainerLeveledUp: boolean;
  newTrainerLevel: number;
  isNewSpecies: boolean;
  catchRatePercent: number;
  pokeballUsed: PokeballType;
}

/**
 * Result of catching a Pokemon (legacy)
 */
export interface CatchResultDto {
  success: boolean;
  message: string;
  caughtPokemon: UserPokemonDto | null;
  experienceGained: number;
  isNewSpecies: boolean;
  trainerLeveledUp: boolean;
  newTrainerLevel: number;
  ivTotal: number;
  ivRating: string;
}

export interface CollectionStatsDto {
  totalCaught: number;
  uniqueCaught: number;
  shinyCount: number;
  favoriteCount: number;
  totalBattles: number;
  totalBattlesWon: number;
  highestLevel: number;
  averageLevel: number;
  typeDistribution: Record<string, number>;
}

// Optimized Pokemon summary for captured status display
export interface PokeSummaryDto {
  name: string;
  captured: number;
}

export interface PokeSummaryResponseDto {
  summary: PokeSummaryDto[];
  totalCaptured: number;
  uniqueSpecies: number;
}

// Summary for list view
export interface UserPokemonSummaryDto {
  id: number;
  pokemonApiId: number;
  name: string;
  displayName: string;
  type1: string;
  type2: string | null;
  spriteUrl: string;
  currentLevel: number;
  isFavorite: boolean;
  isShiny: boolean;
  currentHp: number;
  maxHp: number;
}
