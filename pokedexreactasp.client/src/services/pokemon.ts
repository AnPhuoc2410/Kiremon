import axios from "axios";

import { POKEMON_API, buildEndpointUrl } from "../config/api.config";
import { IAllPokemonResponse, IPokemon } from "../types/pokemon";

// Simple cache implementation
interface Cache {
  [key: string]: {
    data: any;
    timestamp: number;
    expiresIn: number;
  };
}

const cache: Cache = {};
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

// Helper function to get or set cache
const getOrSetCache = async <T>(
  key: string,
  fetchFn: () => Promise<T>,
  expiresIn: number = CACHE_DURATION
): Promise<T> => {
  const now = Date.now();

  if (cache[key] && now < cache[key].timestamp + cache[key].expiresIn) {
    return cache[key].data;
  }

  const data = await fetchFn();

  cache[key] = {
    data,
    timestamp: now,
    expiresIn
  };

  return data;
};

export const getAllPokemon = async (limit: number = 50, offset: number = 0) => {
  const cacheKey = `allPokemon-${limit}-${offset}`;

  try {
    return await getOrSetCache(cacheKey, async () => {
      const response = await axios.get<IAllPokemonResponse>(POKEMON_API, {
        params: { limit: limit, offset: offset },
      });
      return response.data;
    });
  } catch (error) {
    console.error("Error fetching all Pokemon:", error);
    return { count: 0, next: null, previous: null, results: [] };
  }
};

export const getDetailPokemon = async (name: string = "") => {
  if (!name) return null;
  const cacheKey = `detailPokemon-${name}`;

  try {
    return await getOrSetCache(cacheKey, async () => {
      const response = await axios.get(`${POKEMON_API}/${name}`);
      return response.data;
    });
  } catch (error) {
    console.error(`Error fetching details for Pokemon ${name}:`, error);
    return null;
  }
};

export const getPokemonWithTypes = async (limit: number = 20, offset: number = 0) => {
  const cacheKey = `pokemonWithTypes-${limit}-${offset}`;

  try {
    return await getOrSetCache(cacheKey, async () => {
      // Get the list of pokemon
      const response = await axios.get<IAllPokemonResponse>(POKEMON_API, {
        params: { limit: limit, offset: offset },
      });

      const results = response.data.results;

      // Get detailed info for each pokemon to fetch types
      const detailedPokemon = await Promise.all(
        results.map(async (pokemon) => {
          // Use the existing cache mechanism for individual Pokemon details
          const details = await getDetailPokemon(pokemon.name);

          if (details) {
            const types = details.types.map((t: any) => t.type.name);
            return {
              ...pokemon,
              types: types,
              id: details.id
            };
          }

          return { ...pokemon, types: [], id: 0 };
        })
      );

      return {
        ...response.data,
        results: detailedPokemon
      };
    });
  } catch (error) {
    console.error("Error fetching pokemon with types:", error);
    return { count: 0, next: null, previous: null, results: [] };
  }
};

// Fetch Pokemon species data which includes evolution chain URL
export const getPokemonSpecies = async (nameOrId: string | number) => {
  if (!nameOrId) return null;
  const cacheKey = `pokemonSpecies-${nameOrId}`;

  try {
    return await getOrSetCache(cacheKey, async () => {
      const url = buildEndpointUrl("species");
      const response = await axios.get(url + `/${nameOrId}`);
      return response.data;
    });
  } catch (error) {
    console.error("Error fetching Pokemon species:", error);
    return null;
  }
};

// Fetch evolution chain data
export const getEvolutionChain = async (url: string) => {
  if (!url) return null;
  const cacheKey = `evolutionChain-${url}`;

  try {
    return await getOrSetCache(cacheKey, async () => {
      const response = await axios.get(url);
      return response.data;
    });
  } catch (error) {
    console.error("Error fetching evolution chain:", error);
    return null;
  }
};

// Fetch Pokemon forms (variants)
export const getPokemonForms = async (nameOrId: string = "") => {
  if (!nameOrId) return null;
  const cacheKey = `pokemonForms-${nameOrId}`;

  try {
    return await getOrSetCache(cacheKey, async () => {
      const url = buildEndpointUrl("forms");
      const response = await axios.get(url + `/${nameOrId}`);
      return response.data;
    });
  } catch (error) {
    console.error("Error fetching Pokemon forms:", error);
    return null;
  }
};

// Fetch related Pokemon (by type)
export const getRelatedPokemonByType = async (type: string) => {
  if (!type) return [];
  const cacheKey = `relatedByType-${type}`;

  try {
    return await getOrSetCache(cacheKey, async () => {
      const url = buildEndpointUrl("types");
      const response = await axios.get(url + `/${type}`);
      // Get all Pokemon of the specified type
      const pokemonList = response.data.pokemon || [];
      return pokemonList.map((p: any) => p.pokemon);
    });
  } catch (error) {
    console.error("Error fetching related Pokemon:", error);
    return [];
  }
};

// Fetch related Pokemon (by generation)
export const getRelatedPokemonByGen = async (gen: number | string) => {
  if (!gen) return [];
  const cacheKey = `relatedByGen-${gen}`;

  try {
    return await getOrSetCache(cacheKey, async () => {
      const url = buildEndpointUrl("generations");
      const response = await axios.get(url + `/${gen}`);
      // Get up to 6 random Pokemon of the same generation
      const pokemonList = response.data.pokemon_species || [];
      const shuffled = [...pokemonList].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 6);
    });
  } catch (error) {
    console.error("Error fetching related Pokemon by generation:", error);
    return [];
  }
};

// Fetch all Pokemon types
export const getAllPokemonTypes = async () => {
  const cacheKey = 'allPokemonTypes';

  try {
    return await getOrSetCache(cacheKey, async () => {
      const response = await axios.get(buildEndpointUrl("types"));

      // Fetch detailed information for each type including the number of Pokemon
      const typesWithDetails = await Promise.all(
        response.data.results
          // Filter out non-standard types like "unknown" and "shadow"
          .filter((type: any) => !["unknown", "shadow"].includes(type.name))
          .map(async (type: any) => {
            try {
              // Use a longer cache duration for type details since they rarely change
              const typeDetail = await getOrSetCache(`typeDetail-${type.name}`, async () => {
                const typeResponse = await axios.get(type.url);
                return typeResponse.data;
              }, 24 * 60 * 60 * 1000); // 24 hours cache for type details

              return {
                name: type.name,
                id: typeDetail.id,
                pokemonCount: typeDetail.pokemon?.length || 0,
                damageRelations: typeDetail.damage_relations,
                url: type.url
              };
            } catch (error) {
              console.error(`Error fetching details for ${type.name} type:`, error);
              return {
                name: type.name,
                id: 0,
                pokemonCount: 0,
                url: type.url
              };
            }
          })
      );

      return typesWithDetails;
    }, 60 * 60 * 1000); // 1 hour cache for all types
  } catch (error) {
    console.error("Error fetching Pokemon types:", error);
    return [];
  }
};

// Fetch all available regions
export const getAllRegions = async () => {
  const cacheKey = 'allRegions';

  try {
    return await getOrSetCache(cacheKey, async () => {
      const response = await axios.get(buildEndpointUrl("regions"));
      return response.data.results;
    }, 24 * 60 * 60 * 1000); // 24 hours cache for regions
  } catch (error) {
    console.error("Error fetching regions:", error);
    return [];
  }
};

// Fetch detailed region data including locations
export const getRegionDetails = async (regionName: string) => {
  if (!regionName) return null;
  const cacheKey = `regionDetails-${regionName}`;

  try {
    return await getOrSetCache(cacheKey, async () => {
      const url = buildEndpointUrl("regions");
      const response = await axios.get(url + `/${regionName}`);
      return response.data;
    }, 24 * 60 * 60 * 1000); // 24 hours cache for region details
  } catch (error) {
    console.error(`Error fetching details for ${regionName} region:`, error);
    return null;
  }
};

// Fetch all available pokedexes
export const getAllPokedexes = async () => {
  const cacheKey = 'allPokedexes';

  try {
    return await getOrSetCache(cacheKey, async () => {
      const response = await axios.get(buildEndpointUrl("pokedexes"));
      return response.data.results;
    }, 24 * 60 * 60 * 1000); // 24 hours cache for pokedex list
  } catch (error) {
    console.error("Error fetching pokedexes:", error);
    return [];
  }
};

// Fetch detailed pokedex data including pokemon entries
export const getPokedexDetails = async (pokedexName: string) => {
  if (!pokedexName) return null;
  const cacheKey = `pokedexDetails-${pokedexName}`;

  try {
    return await getOrSetCache(cacheKey, async () => {
      const url = buildEndpointUrl("pokedexes");
      const response = await axios.get(url + `/${pokedexName}`);
      return response.data;
    });
  } catch (error) {
    console.error(`Error fetching details for ${pokedexName} pokedex:`, error);
    return null;
  }
};

// Method to clear cache if needed
export const clearCache = (keyPattern?: string) => {
  if (keyPattern) {
    // Clear specific cache entries matching the pattern
    Object.keys(cache).forEach(key => {
      if (key.includes(keyPattern)) {
        delete cache[key];
      }
    });
  } else {
    // Clear all cache
    Object.keys(cache).forEach(key => {
      delete cache[key];
    });
  }
};
