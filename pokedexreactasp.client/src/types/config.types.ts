export interface WildAreaConfig {
  code: string;
  name: string;
  spawnCount?: number | null;
  resetIntervalMinutes?: number | null;
  allowedTypes: string[];
  preferredTypes: string[];
  bannedTypes: string[];
  allowedHabitats: string[];
  preferredHabitats: string[];
  requiredAnyTags: string[];
  preferredTags: string[];
  allowedTags: string[];
  bannedTags: string[];
  requiredAnyTypes: string[];
  secondaryAllowedTypes: string[];
  safeFallbackPokemonIds: number[];
  minGeneration?: number | null;
  maxGeneration?: number | null;
  allowLegendary?: boolean | null;
  allowMythical?: boolean | null;
  allowBaby?: boolean | null;
  rarityWeights: Record<string, number>;
}

export interface WildAreaSettings {
  resetIntervalMinutes: number;
  spawnCount: number;
  maxAttemptsPerSpawn: number;
  maxGeneration: number;
  allowLegendarySpawn: boolean;
  spawnWeights: Record<string, number>;
  wildAreas: WildAreaConfig[];
}

export interface CardRewardSettings {
  rarityWeights: Record<string, number>;
}
