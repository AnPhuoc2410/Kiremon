import axios from "axios";

import { POKEMON_API } from "../config/api.config";
import { IAllPokemonResponse, IPokemon } from "../types/pokemon";

export const getAllPokemon = async (limit: number = 50, offset: number = 0) => {
  try {
    const response = await axios.get<IAllPokemonResponse>(POKEMON_API, {
      params: { limit: limit, offset: offset },
    });

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getDetailPokemon = async (name: string = "") => {
  try {
    const response = await axios.get(`${POKEMON_API}/${name}`);

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getPokemonWithTypes = async (limit: number = 20, offset: number = 0) => {
  try {
    // Get the list of pokemon
    const response = await axios.get<IAllPokemonResponse>(POKEMON_API, {
      params: { limit: limit, offset: offset },
    });

    const results = response.data.results;

    // Get detailed info for each pokemon to fetch types
    const detailedPokemon = await Promise.all(
      results.map(async (pokemon) => {
        try {
          const detailResponse = await axios.get(`${POKEMON_API}/${pokemon.name}`);
          const types = detailResponse.data.types.map((t: any) => t.type.name);

          return {
            ...pokemon,
            types: types,
            id: detailResponse.data.id
          };
        } catch (error) {
          console.error(`Error fetching details for ${pokemon.name}`, error);
          return { ...pokemon, types: [] };
        }
      })
    );

    return {
      ...response.data,
      results: detailedPokemon
    };
  } catch (error) {
    console.error("Error fetching pokemon with types:", error);
    return { count: 0, next: null, previous: null, results: [] };
  }
};

// Fetch Pokemon species data which includes evolution chain URL
export const getPokemonSpecies = async (nameOrId: string | number) => {
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${nameOrId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching Pokemon species:", error);
    return null;
  }
};

// Fetch evolution chain data
export const getEvolutionChain = async (url: string) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching evolution chain:", error);
    return null;
  }
};

// Fetch Pokemon forms (variants)
export const getPokemonForms = async (nameOrId: string = "") => {
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon-form/${nameOrId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching Pokemon forms:", error);
    return null;
  }
};

// Fetch related Pokemon (by type)
export const getRelatedPokemonByType = async (type: string) => {
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/type/${type}`);
    // Get up to 6 random Pokemon of the same type
    const pokemonList = response.data.pokemon || [];
    const shuffled = [...pokemonList].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 6).map((p: any) => p.pokemon);
  } catch (error) {
    console.error("Error fetching related Pokemon:", error);
    return [];
  }
};

// Fetch related Pokemon (by generation)
export const getRelatedPokemonByGen = async (gen: number | string) => {
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/generation/${gen}`);
    // Get up to 6 random Pokemon of the same generation
    const pokemonList = response.data.pokemon_species || [];
    const shuffled = [...pokemonList].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 6);
  } catch (error) {
    console.error("Error fetching related Pokemon by generation:", error);
    return [];
  }
};

// Fetch all Pokemon types
export const getAllPokemonTypes = async () => {
  try {
    const response = await axios.get('https://pokeapi.co/api/v2/type');

    // Fetch detailed information for each type including the number of Pokemon
    const typesWithDetails = await Promise.all(
      response.data.results
        // Filter out non-standard types like "unknown" and "shadow"
        .filter((type: any) => !["unknown", "shadow"].includes(type.name))
        .map(async (type: any) => {
          try {
            const typeDetail = await axios.get(type.url);
            return {
              name: type.name,
              id: typeDetail.data.id,
              pokemonCount: typeDetail.data.pokemon?.length || 0,
              damageRelations: typeDetail.data.damage_relations,
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
  } catch (error) {
    console.error("Error fetching Pokemon types:", error);
    return [];
  }
};

// Fetch all available regions
export const getAllRegions = async () => {
  try {
    const response = await axios.get('https://pokeapi.co/api/v2/region');
    return response.data.results;
  } catch (error) {
    console.error("Error fetching regions:", error);
    return [];
  }
};

// Fetch detailed region data including locations
export const getRegionDetails = async (regionName: string) => {
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/region/${regionName}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for ${regionName} region:`, error);
    return null;
  }
};

// Fetch all available pokedexes
export const getAllPokedexes = async () => {
  try {
    const response = await axios.get('https://pokeapi.co/api/v2/pokedex');
    return response.data.results;
  } catch (error) {
    console.error("Error fetching pokedexes:", error);
    return [];
  }
};

// Fetch detailed pokedex data including pokemon entries
export const getPokedexDetails = async (pokedexName: string) => {
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokedex/${pokedexName}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for ${pokedexName} pokedex:`, error);
    return null;
  }
};
