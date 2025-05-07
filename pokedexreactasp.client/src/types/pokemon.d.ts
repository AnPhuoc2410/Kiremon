// Basic Pokemon interfaces
export interface IMyPokemon {
  name: string;
  nickname: string;
  sprite?: string;
}

export interface IPokemon {
  name: string;
  captured?: number;
  url?: string;
  sprite?: string;
  id?: number;
  types?: string[];
}

export interface IPokeSummary {
  name: string;
  captured: number;
}

export interface IPokemonType {
  id: number;
  name: string;
  pokemonCount: number;
  url: string;
  damageRelations?: IDamageRelations;
}

/* Poke API response */

export interface IAllPokemonResponse {
  count: number;
  next?: string;
  previous?: string;
  results: IPokemon[];
}

// Generation interfaces
export interface IGeneration {
  id: number;
  name: string;
  abilities: INameUrlPair[];
  main_region: INameUrlPair;
  moves: INameUrlPair[];
  names: IName[];
  pokemon_species: INameUrlPair[];
  types: INameUrlPair[];
  version_groups: INameUrlPair[];
}

export interface IGenerationDetail {
  id: number;
  name: string;
  main_region: INameUrlPair;
  names: IName[];
  pokemon_species: IPokemonSpeciesDetail[];
  moves: IMoveDetail[];
  version_groups: INameUrlPair[];
}

export interface IPokemonSpeciesDetail {
  name: string;
  url: string;
  id?: number;
  sprite?: string | null;
}

export interface IMoveDetail {
  name: string;
  id?: number;
  url: string;
  type?: string;
  power?: number;
  accuracy?: number;
  pp?: number;
}

export interface IPokemonDetailResponse {
  id: number;
  name: string;
  abilities: IAbility[];
  moves: IMove[];
  types: IType[];
  sprites: ISprites;
  stats: IStat[];
  height: number;
  weight: number;
  base_experience: number;
  species: INameUrlPair;
  forms: INameUrlPair[];
  game_indices: IGameIndex[];
  held_items: IHeldItem[];
  location_area_encounters: string;
  order: number;
  past_types: IPastType[];
  is_default: boolean;
}

export interface IAbility {
  ability: INameUrlPair;
  is_hidden: boolean;
  slot: number;
}

export interface IMove {
  move: INameUrlPair;
  version_group_details: IVersionGroupDetail[];
}

export interface IVersionGroupDetail {
  level_learned_at: number;
  move_learn_method: INameUrlPair;
  version_group: INameUrlPair;
}

export interface IType {
  slot: number;
  type: INameUrlPair;
}

export interface ISprites {
  front_default: string;
  front_shiny: string;
  front_female: string | null;
  front_shiny_female: string | null;
  back_default: string;
  back_shiny: string;
  back_female: string | null;
  back_shiny_female: string | null;
  other: IOtherSprites;
  versions: IVersionSprites;
}

export interface IOtherSprites {
  dream_world: {
    front_default: string | null;
    front_female: string | null;
  };
  home: {
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
  };
  "official-artwork": {
    front_default: string;
    front_shiny: string | null;
  };
  showdown: {
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
    back_default: string | null;
    back_female: string | null;
    back_shiny: string | null;
    back_shiny_female: string | null;
  };
}

export interface IVersionSprites {
  "generation-i": IGenerationSprites;
  "generation-ii": IGenerationSprites;
  "generation-iii": IGenerationSprites;
  "generation-iv": IGenerationSprites;
  "generation-v": {
    "black-white": {
      animated: {
        front_default: string | null;
        front_female: string | null;
        front_shiny: string | null;
        front_shiny_female: string | null;
        back_default: string | null;
        back_female: string | null;
        back_shiny: string | null;
        back_shiny_female: string | null;
      };
      front_default: string | null;
      front_female: string | null;
      front_shiny: string | null;
      front_shiny_female: string | null;
      back_default: string | null;
      back_female: string | null;
      back_shiny: string | null;
      back_shiny_female: string | null;
    };
  };
  "generation-vi": IGenerationSprites;
  "generation-vii": IGenerationSprites;
  "generation-viii": IGenerationSprites;
}

// Generic interface for generation sprites since they share a similar structure
export interface IGenerationSprites {
  [version: string]: {
    front_default: string | null;
    front_female?: string | null;
    front_shiny?: string | null;
    front_shiny_female?: string | null;
    back_default?: string | null;
    back_female?: string | null;
    back_shiny?: string | null;
    back_shiny_female?: string | null;
  };
}

export interface IStat {
  base_stat: number;
  effort: number;
  stat: INameUrlPair;
}

export interface IGameIndex {
  game_index: number;
  version: INameUrlPair;
}

export interface IHeldItem {
  item: INameUrlPair;
  version_details: {
    rarity: number;
    version: INameUrlPair;
  }[];
}

export interface IPastType {
  generation: INameUrlPair;
  types: IType[];
}

export interface IRegion {
  id?: number;
  name: string;
  url?: string;
  locations?: INameUrlPair[];
  main_generation?: INameUrlPair;
  pokedexes?: INameUrlPair[];
  version_groups?: INameUrlPair[];
  image?: string; // We'll add custom images
  description?: string; // We'll add custom descriptions
  pokemonCount?: number;
}

export interface IPokedex {
  id?: number;
  name: string;
  url?: string;
  descriptions?: Array<{
    description: string;
    language: INameUrlPair;
  }>;
  is_main_series?: boolean;
  pokemon_entries?: Array<{
    entry_number: number;
    pokemon_species: INameUrlPair;
  }>;
  region?: INameUrlPair;
  version_groups?: INameUrlPair[];
}

export interface INameUrlPair {
  name: string;
  url: string;
}

export interface ILocation {
  id?: number;
  name: string;
  url?: string;
  region?: INameUrlPair;
  areas?: INameUrlPair[];
}

// Species and Evolution interfaces
export interface IPokemonSpecies {
  id: number;
  name: string;
  order: number;
  gender_rate: number;
  capture_rate: number;
  base_happiness: number;
  is_baby: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
  hatch_counter: number;
  has_gender_differences: boolean;
  forms_switchable: boolean;
  growth_rate: INameUrlPair;
  pokedex_numbers: IPokedexNumber[];
  egg_groups: INameUrlPair[];
  color: INameUrlPair;
  shape: INameUrlPair;
  evolves_from_species: INameUrlPair | null;
  evolution_chain: { url: string };
  habitat: INameUrlPair | null;
  generation: INameUrlPair;
  names: IName[];
  flavor_text_entries: IFlavorTextEntry[];
  form_descriptions: IFormDescription[];
  genera: IGenus[];
  varieties: IVariety[];
}

export interface IPokedexNumber {
  entry_number: number;
  pokedex: INameUrlPair;
}

export interface IName {
  name: string;
  language: INameUrlPair;
}

export interface IFlavorTextEntry {
  flavor_text: string;
  language: INameUrlPair;
  version: INameUrlPair;
}

export interface IFormDescription {
  description: string;
  language: INameUrlPair;
}

export interface IGenus {
  genus: string;
  language: INameUrlPair;
}

export interface IVariety {
  is_default: boolean;
  pokemon: INameUrlPair;
}

// Evolution Chain interfaces
export interface IEvolutionChain {
  id: number;
  baby_trigger_item: INameUrlPair | null;
  chain: IChainLink;
}

export interface IChainLink {
  is_baby: boolean;
  species: INameUrlPair;
  evolution_details: IEvolutionDetail[];
  evolves_to: IChainLink[];
}

export interface IEvolutionDetail {
  item: INameUrlPair | null;
  trigger: INameUrlPair;
  gender: number | null;
  held_item: INameUrlPair | null;
  known_move: INameUrlPair | null;
  known_move_type: INameUrlPair | null;
  location: INameUrlPair | null;
  min_level: number | null;
  min_happiness: number | null;
  min_beauty: number | null;
  min_affection: number | null;
  needs_overworld_rain: boolean;
  party_species: INameUrlPair | null;
  party_type: INameUrlPair | null;
  relative_physical_stats: number | null;
  time_of_day: string;
  trade_species: INameUrlPair | null;
  turn_upside_down: boolean;
}

// Type details interfaces
export interface ITypeDetails {
  id: number;
  name: string;
  damage_relations: IDamageRelations;
  past_damage_relations: IPastDamageRelations[];
  game_indices: IGameIndex[];
  generation: INameUrlPair;
  move_damage_class: INameUrlPair;
  names: IName[];
  pokemon: IPokemonType[];
  moves: INameUrlPair[];
}

export interface IDamageRelations {
  no_damage_to: INameUrlPair[];
  half_damage_to: INameUrlPair[];
  double_damage_to: INameUrlPair[];
  no_damage_from: INameUrlPair[];
  half_damage_from: INameUrlPair[];
  double_damage_from: INameUrlPair[];
}

export interface IPastDamageRelations {
  generation: INameUrlPair;
  damage_relations: IDamageRelations;
}

// Additional API response interfaces
export interface IAPIResourceList {
  count: number;
  next: string | null;
  previous: string | null;
  results: INameUrlPair[];
}

// Generic API response wrapper
export interface IAPIResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: any;
  request?: any;
}

// Error response
export interface IErrorResponse {
  message: string;
  status?: number;
  error?: any;
}
