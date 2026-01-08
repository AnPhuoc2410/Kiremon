import { GRAPHQL_ENDPOINT } from "../../config/api.config";
import { cacheUtils } from "../cache/cache";

export interface PokemonTypeSlot {
  slot: number;
  type: {
    name: string;
    id: number;
    typenames: Array<{
      name: string;
      language_id: number;
    }>;
  };
}

export interface PokemonMove {
  move: {
    name: string;
    id: number;
    power: number | null;
    accuracy: number | null;
    pp: number | null;
    priority: number;
    type: {
      name: string;
    };
    movedamageclass: {
      name: string;
      id: number;
    } | null;
    generation: {
      name: string;
      id: number;
    } | null;
    movenames: Array<{
      name: string;
      language_id: number;
    }>;
    moveflavortexts: Array<{
      flavor_text: string;
    }>;
    movemeta: Array<{
      crit_rate: number;
      drain: number;
      flinch_chance: number;
      healing: number;
      min_hits: number | null;
      max_hits: number | null;
    }>;
  };
  level: number;
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    id: number;
    statnames: Array<{
      name: string;
      language_id: number;
    }>;
  };
}

export interface PokemonAbility {
  is_hidden: boolean;
  slot: number;
  ability: {
    name: string;
    id: number;
    abilitynames: Array<{
      name: string;
      language_id: number;
    }>;
    abilityflavortexts: Array<{
      flavor_text: string;
      language_id: number;
    }>;
  };
}

export interface PokemonHeldItem {
  rarity: number;
  item: {
    name: string;
    id: number;
    cost: number;
    itemnames: Array<{
      name: string;
      language_id: number;
    }>;
  };
  version: {
    name: string;
  };
}

export interface PokemonSpritesData {
  front_default: string | null;
  front_shiny: string | null;
  front_female: string | null;
  front_shiny_female: string | null;
  back_default: string | null;
  back_shiny: string | null;
  back_female: string | null;
  back_shiny_female: string | null;
  other?: {
    dream_world?: {
      front_default: string | null;
      front_female: string | null;
    };
    home?: {
      front_default: string | null;
      front_female: string | null;
      front_shiny: string | null;
      front_shiny_female: string | null;
    };
    "official-artwork"?: {
      front_default: string | null;
      front_shiny: string | null;
    };
    showdown?: {
      front_default: string | null;
      back_default: string | null;
      front_shiny: string | null;
      back_shiny: string | null;
    };
  };
  versions?: Record<string, Record<string, any>>;
}

export interface PokemonSpeciesGraphQL {
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
  growthrate: {
    name: string;
    id: number;
  };
  pokemoncolor: {
    name: string;
    id: number;
  };
  pokemonshape: {
    name: string;
    id: number;
  } | null;
  pokemonhabitat: {
    name: string;
    id: number;
  } | null;
  generation: {
    name: string;
    id: number;
    generationnames: Array<{
      name: string;
      language_id: number;
    }>;
  };
  evolution_chain_id: number | null;
  pokemonegggroups: Array<{
    egggroup: {
      name: string;
      id: number;
      egggroupnames: Array<{
        name: string;
        language_id: number;
      }>;
    };
  }>;
  pokemonspeciesnames: Array<{
    name: string;
    genus: string;
    language_id: number;
  }>;
  pokemonspeciesflavortexts: Array<{
    flavor_text: string;
    language_id: number;
    version: {
      name: string;
    };
  }>;
  pokemons: Array<{
    id: number;
    name: string;
    is_default: boolean;
  }>;
}

export interface EvolutionChainGraphQL {
  id: number;
  pokemonspecies: Array<{
    id: number;
    name: string;
    order: number;
    evolves_from_species_id: number | null;
    pokemonevolutions: Array<{
      min_level: number | null;
      min_happiness: number | null;
      min_beauty: number | null;
      min_affection: number | null;
      needs_overworld_rain: boolean;
      turn_upside_down: boolean;
      time_of_day: string;
      relative_physical_stats: number | null;
      gender_id: number | null;
      evolutiontrigger: {
        name: string;
        id: number;
      };
      item: {
        name: string;
        id: number;
      } | null;
      held_item: {
        name: string;
        id: number;
      } | null;
      location: {
        name: string;
        id: number;
      } | null;
      move: {
        name: string;
        id: number;
      } | null;
      type: {
        name: string;
        id: number;
      } | null;
      held_item_id: number | null;
      trade_species_id: number | null;
    }>;
    pokemons: Array<{
      id: number;
      name: string;
      pokemonsprites: Array<{
        sprites: string;
      }>;
    }>;
  }>;
}

export interface PokemonDetailGraphQL {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  order: number;
  is_default: boolean;
  pokemonsprites: Array<{
    sprites: string;
  }>;
  pokemontypes: PokemonTypeSlot[];
  pokemonmoves: PokemonMove[];
  pokemonstats: PokemonStat[];
  pokemonabilities: PokemonAbility[];
  pokemonhelditemsByPokemonId: PokemonHeldItem[];
  pokemonforms: Array<{
    id: number;
    name: string;
    is_default: boolean;
    pokemonformnames: Array<{
      name: string;
      language_id: number;
    }>;
  }>;
  pokemonspecy: {
    id: number;
    name: string;
    evolution_chain_id: number | null;
    generation: {
      id: number;
      name: string;
    };
  };
}

export interface RelatedPokemonGraphQL {
  id: number;
  name: string;
  pokemonspeciesnames: Array<{
    name: string;
    language_id: number;
  }>;
  pokemons: Array<{
    id: number;
    pokemonsprites: Array<{
      sprites: string;
    }>;
  }>;
}

// ============ GraphQL Queries ============

const GET_POKEMON_DETAIL_QUERY = `
  query getPokemonDetail($name: String!) {
    pokemon(where: {name: {_eq: $name}}) {
      id
      name
      height
      weight
      base_experience
      order
      is_default
      pokemonsprites {
        sprites
      }
      pokemontypes(order_by: {slot: asc}) {
        slot
        type {
          name
          id
          typenames {
            name
            language_id
          }
        }
      }
      pokemonmoves(distinct_on: move_id, order_by: {move_id: asc}) {
        level
        move {
          name
          id
          power
          accuracy
          pp
          priority
          type {
            name
          }
          movedamageclass {
            name
            id
          }
          generation {
            name
            id
          }
          movenames {
            name
            language_id
          }
          moveflavortexts(where: {language_id: {_eq: 9}}, limit: 1, order_by: {version_group_id: desc}) {
            flavor_text
          }
          movemeta {
            crit_rate
            drain
            flinch_chance
            healing
            min_hits
            max_hits
          }
        }
      }
      pokemonstats(order_by: {stat_id: asc}) {
        base_stat
        effort
        stat {
          name
          id
          statnames {
            name
            language_id
          }
        }
      }
      pokemonabilities(order_by: {slot: asc}) {
        is_hidden
        slot
        ability {
          name
          id
          abilitynames {
            name
            language_id
          }
          abilityflavortexts(where: {language_id: {_eq: 9}}, limit: 1) {
            flavor_text
            language_id
          }
        }
      }
      pokemonhelditemsByPokemonId: pokemonitems {
        rarity
        item {
          name
          id
          cost
          itemnames {
            name
            language_id
          }
        }
        version {
          name
        }
      }
      pokemonforms {
        id
        name
        is_default
        pokemonformnames {
          name
          language_id
        }
      }
      pokemonspecy {
        id
        name
        evolution_chain_id
        generation {
          id
          name
        }
      }
    }
  }
`;

const GET_POKEMON_SPECIES_QUERY = `
  query getPokemonSpecies($id: Int!) {
    pokemonspecies(where: {id: {_eq: $id}}) {
      id
      name
      order
      gender_rate
      capture_rate
      base_happiness
      is_baby
      is_legendary
      is_mythical
      hatch_counter
      has_gender_differences
      forms_switchable
      evolution_chain_id
      growthrate {
        name
        id
      }
      pokemoncolor {
        name
        id
      }
      pokemonshape {
        name
        id
      }
      pokemonhabitat {
        name
        id
      }
      generation {
        name
        id
        generationnames {
          name
          language_id
        }
      }
      pokemonegggroups {
        egggroup {
          name
          id
          egggroupnames {
            name
            language_id
          }
        }
      }
      pokemonspeciesnames {
        name
        genus
        language_id
      }
      pokemonspeciesflavortexts(order_by: {version_id: desc}) {
        flavor_text
        language_id
        version {
          name
        }
      }
      pokemons {
        id
        name
        is_default
      }
    }
  }
`;

const GET_EVOLUTION_CHAIN_QUERY = `
  query getEvolutionChain($chainId: Int!) {
    evolutionchain(where: {id: {_eq: $chainId}}) {
      id
      pokemonspecies(order_by: {order: asc}) {
        id
        name
        order
        evolves_from_species_id
        pokemonevolutions {
          min_level
          min_happiness
          min_beauty
          min_affection
          needs_overworld_rain
          turn_upside_down
          time_of_day
          relative_physical_stats
          gender_id
          held_item_id
          trade_species_id
          evolutiontrigger {
            name
            id
          }
          item {
            name
            id
          }
          location {
            name
            id
          }
          move {
            name
            id
          }
          type {
            name
            id
          }
        }
        pokemons(where: {is_default: {_eq: true}}, limit: 1) {
          id
          name
          pokemonsprites {
            sprites
          }
        }
      }
    }
  }
`;

const GET_RELATED_POKEMON_BY_GENERATION_QUERY = `
  query getRelatedPokemonByGeneration($generationId: Int!, $limit: Int!) {
    pokemonspecies(
      where: {
        generation_id: {_eq: $generationId}
      },
      order_by: {id: asc},
      limit: $limit
    ) {
      id
      name
      pokemonspeciesnames {
        name
        language_id
      }
      pokemons(where: {is_default: {_eq: true}}, limit: 1) {
        id
        pokemonsprites {
          sprites
        }
      }
    }
  }
`;

const GET_POKEMON_BY_ID_QUERY = `
  query getPokemonById($id: Int!) {
    pokemon(where: {id: {_eq: $id}}) {
      id
      name
      pokemonsprites {
        sprites
      }
    }
  }
`;

const GET_ITEMS_BY_IDS_QUERY = `
  query getItemsByIds($ids: [Int!]!) {
    item(where: {id: {_in: $ids}}) {
      id
      name
      itemnames(where: {language_id: {_eq: 9}}) {
        name
      }
    }
  }
`;

// ============ GraphQL Fetch Function ============

async function executeGraphQLQuery<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `GraphQL request failed: ${response.status} ${response.statusText}`,
    );
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(result.errors[0]?.message || "GraphQL Error");
  }

  return result.data;
}

// ============ Helper Functions ============

/** Parse sprites from GraphQL response (handles both object and JSON string) */
function parseSprites(
  input: string | object | undefined | null,
): PokemonSpritesData | null {
  if (!input) return null;
  if (typeof input === "object") return input as PokemonSpritesData;
  try {
    return JSON.parse(input);
  } catch {
    return null;
  }
}

/**
 * Get localized name based on language ID
 * Default: 9 = English, 1 = Japanese, 3 = Korean, etc.
 */
function getLocalizedName(
  names: Array<{ name: string; language_id: number }>,
  languageId: number = 9,
): string {
  const localizedName = names.find((n) => n.language_id === languageId);
  return localizedName?.name || names[0]?.name || "";
}

/**
 * Format flavor text by removing special characters
 */
function formatFlavorText(text: string): string {
  if (!text) return "";
  return text
    .replace(/\f/g, " ")
    .replace(/\u00ad\n/g, "")
    .replace(/\u00ad/g, "")
    .replace(/\n/g, " ")
    .trim();
}

// ============ Service Export ============

export const pokemonGraphQLService = {
  /**
   * Get detailed Pokemon information by name
   */
  async getPokemonDetail(
    name: string,
    languageId: number = 9,
  ): Promise<PokemonDetailGraphQL | null> {
    if (!name) return null;
    const cacheKey = `graphql:pokemon:detail:${name}:${languageId}`;

    try {
      return await cacheUtils.getOrSet(cacheKey, async () => {
        const data = await executeGraphQLQuery<{
          pokemon: PokemonDetailGraphQL[];
        }>(GET_POKEMON_DETAIL_QUERY, { name: name.toLowerCase() });

        return data.pokemon[0] || null;
      });
    } catch (error) {
      console.error(`Error fetching Pokemon detail for ${name}:`, error);
      return null;
    }
  },

  /**
   * Get Pokemon species data including evolution chain ID and flavor texts
   */
  async getPokemonSpecies(
    speciesId: number,
    languageId: number = 9,
  ): Promise<PokemonSpeciesGraphQL | null> {
    if (!speciesId) return null;
    const cacheKey = `graphql:pokemon:species:${speciesId}:${languageId}`;

    try {
      return await cacheUtils.getOrSet(cacheKey, async () => {
        const data = await executeGraphQLQuery<{
          pokemonspecies: PokemonSpeciesGraphQL[];
        }>(GET_POKEMON_SPECIES_QUERY, { id: speciesId });

        return data.pokemonspecies[0] || null;
      });
    } catch (error) {
      console.error(`Error fetching species ${speciesId}:`, error);
      return null;
    }
  },

  /**
   * Get evolution chain data by chain ID
   */
  async getEvolutionChain(
    chainId: number,
  ): Promise<EvolutionChainGraphQL | null> {
    if (!chainId) return null;
    const cacheKey = `graphql:pokemon:evolution:${chainId}`;

    try {
      return await cacheUtils.getOrSet(cacheKey, async () => {
        const data = await executeGraphQLQuery<{
          evolutionchain: EvolutionChainGraphQL[];
        }>(GET_EVOLUTION_CHAIN_QUERY, { chainId });

        return data.evolutionchain[0] || null;
      });
    } catch (error) {
      console.error(`Error fetching evolution chain ${chainId}:`, error);
      return null;
    }
  },

  /**
   * Get related Pokemon by generation
   */
  async getRelatedPokemonByGeneration(
    generationId: number,
    excludeName: string,
    limit: number = 6,
    languageId: number = 9,
  ): Promise<RelatedPokemonGraphQL[]> {
    if (!generationId) return [];
    // Cache key without excludeName to get all Pokemon in generation
    const cacheKey = `graphql:pokemon:related:gen:${generationId}:${languageId}`;

    try {
      const allPokemon = await cacheUtils.getOrSet(cacheKey, async () => {
        const data = await executeGraphQLQuery<{
          pokemonspecies: RelatedPokemonGraphQL[];
        }>(GET_RELATED_POKEMON_BY_GENERATION_QUERY, {
          generationId,
          limit: 50, // Get enough to shuffle from
        });

        return data.pokemonspecies;
      });

      // Filter out current Pokemon and shuffle AFTER cache retrieval
      const filtered = allPokemon.filter(
        (p) => p.name.toLowerCase() !== excludeName.toLowerCase(),
      );
      const shuffled = [...filtered].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, limit);
    } catch (error) {
      console.error(`Error fetching related Pokemon:`, error);
      return [];
    }
  },

  /**
   * Get Pokemon by ID (for evolution chain processing)
   */
  async getPokemonById(id: number): Promise<{
    id: number;
    name: string;
    sprites: PokemonSpritesData | null;
  } | null> {
    if (!id) return null;
    const cacheKey = `graphql:pokemon:byId:${id}`;

    try {
      return await cacheUtils.getOrSet(cacheKey, async () => {
        const data = await executeGraphQLQuery<{
          pokemon: Array<{
            id: number;
            name: string;
            pokemonsprites: Array<{ sprites: string }>;
          }>;
        }>(GET_POKEMON_BY_ID_QUERY, { id });

        const pokemon = data.pokemon[0];
        if (!pokemon) return null;

        return {
          id: pokemon.id,
          name: pokemon.name,
          sprites: parseSprites(pokemon.pokemonsprites[0]?.sprites),
        };
      });
    } catch (error) {
      console.error(`Error fetching Pokemon by ID ${id}:`, error);
      return null;
    }
  },

  /**
   * Get item names by IDs (for held items in evolution chain)
   */
  async getItemsByIds(ids: number[]): Promise<Map<number, string>> {
    if (!ids || ids.length === 0) return new Map();

    const uniqueIds = [...new Set(ids)];
    const cacheKey = `graphql:items:${uniqueIds.sort().join(",")}`;

    try {
      return await cacheUtils.getOrSet(cacheKey, async () => {
        const data = await executeGraphQLQuery<{
          item: Array<{
            id: number;
            name: string;
            itemnames: Array<{ name: string }>;
          }>;
        }>(GET_ITEMS_BY_IDS_QUERY, { ids: uniqueIds });

        const itemMap = new Map<number, string>();
        data.item.forEach((item) => {
          // Use localized name if available, otherwise use item.name
          const localizedName = item.itemnames[0]?.name || item.name;
          itemMap.set(item.id, localizedName);
        });
        return itemMap;
      });
    } catch (error) {
      console.error(`Error fetching items:`, error);
      return new Map();
    }
  },

  // Helper functions exposed for use in components
  parseSprites,
  getLocalizedName,
  formatFlavorText,
};
