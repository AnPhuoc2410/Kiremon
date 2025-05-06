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
  damageRelations?: any;
}

/* Poke API response */

export interface IAllPokemonResponse {
  count: number;
  next?: string;
  previous?: string;
  results: IPokemon[];
}

export interface IPokemonDetailResponse {
  name: string;
  abilities: Array<{
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }>;
  moves: {
    move?: {
      name?: string;
      [other: string]: unknown;
    };
    [other: string]: unknown;
  }[];
  types: {
    type?: {
      name?: string;
      [other: string]: unknown;
    };
    [other: string]: unknown;
  }[];
  sprites: {
    front_default: string;
    versions?: {
      "generation-v"?: {
        "black-white"?: {
          animated?: {
            front_default: string;
          };
          [other: string]: unknown;
        };
      };
      [other: string]: unknown;
    };
    [other: string]: unknown;
  };
  stats: Array<{
    base_stat: number;
    effort?: number;
    stat: {
      name?: string;
      url: string;
    };
  }>;
  [other: string]: unknown;
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
