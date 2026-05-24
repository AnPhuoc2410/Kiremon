export type WildSpawnRarity =
  | "Common"
  | "Uncommon"
  | "Rare"
  | "Epic"
  | "Legendary";

export interface WildPokemonSummary {
  id: number;
  pokemonApiId: number;
  nickname?: string | null;
  isShiny?: boolean;
  nature?: string;
  caughtLevel?: number;
}

export interface WildCardReward {
  userCardId: number;
  tcgCardId: string;
  name: string;
  rarity?: string | null;
  rarityTier: string;
  imageSmall?: string | null;
  imageLarge?: string | null;
}

export interface WildCatchResult {
  success: boolean;
  pokemonCaught: boolean;
  shakeCount: number;
  message: string;
  attemptsLeft: number;
  spawnConsumed: boolean;
  userPokemon?: WildPokemonSummary;
  cardReward?: WildCardReward | null;
}

export interface WildPokemonSpawn {
  spawnId: number;
  pokemonApiId: number;
  pokemonName: string;
  spriteUrl: string;
  slotIndex: number;
  spawnRarity: WildSpawnRarity;
  attemptsLeft: number;
  isCaught: boolean;
  isConsumed: boolean;
}

export interface WildAreaResponse {
  areaCode: string;
  areaName: string;
  resetAt: string;
  secondsUntilReset: number;
  spawns: WildPokemonSpawn[];
}

export interface WildCatchAttemptRequest {
  pokeballType: string;
  nickname?: string;
}
