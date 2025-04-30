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
export const getPokemonSpecies = async (nameOrId: string = "") => {
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
