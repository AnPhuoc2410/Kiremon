import { useState, useEffect } from 'react';
import {
  pokemonService,
  speciesService,
  typesService,
  regionsService,
  pokedexService,
  generationsService
} from '../../services';

// Generic hook for fetching Pokemon data
export const usePokeAPI = <T>(
  fetchFunction: (...args: any[]) => Promise<T>,
  params: any[] = [],
  dependencies: any[] = [],
  initialData: T | null = null
) => {
  const [data, setData] = useState<T | null>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [isRefetching, setIsRefetching] = useState<boolean>(false);

  // Function to fetch data and update state
  const fetchData = async (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true);
    } else {
      setIsRefetching(true);
    }

    setError(null);

    try {
      const result = await fetchFunction(...params);
      setData(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return null;
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
  };

  // Refetch data function that can be called from components
  const refetch = async () => {
    return await fetchData(false);
  };

  // Fetch data on mount and when dependencies change
  useEffect(() => {
    fetchData();
  }, [...dependencies, ...params]);

  return { data, isLoading, isRefetching, error, refetch };
};

// Specific hooks for common Pokemon data fetching scenarios

export const useAllPokemon = (limit = 50, offset = 0) => {
  return usePokeAPI(
    pokemonService.getAllPokemon.bind(pokemonService),
    [limit, offset],
    [limit, offset],
    { count: 0, next: "", previous: "", results: [] }
  );
};

export const usePokemonDetails = (name: string) => {
  return usePokeAPI(
    pokemonService.getPokemonDetail.bind(pokemonService),
    [name],
    [name],
    null
  );
};

export const usePokemonWithTypes = (limit = 20, offset = 0) => {
  return usePokeAPI(
    pokemonService.getPokemonWithTypes.bind(pokemonService),
    [limit, offset],
    [limit, offset],
    { count: 0, next: "", previous: "", results: [] }
  );
};

export const usePokemonSpecies = (nameOrId: string | number) => {
  return usePokeAPI(
    speciesService.getPokemonSpecies.bind(speciesService),
    [nameOrId],
    [nameOrId],
    null
  );
};

export const useEvolutionChain = (url: string) => {
  return usePokeAPI(
    speciesService.getEvolutionChain.bind(speciesService),
    [url],
    [url],
    null
  );
};

export const useSpeciesWithEvolution = (nameOrId: string | number) => {
  return usePokeAPI(
    speciesService.getSpeciesWithEvolution.bind(speciesService),
    [nameOrId],
    [nameOrId],
    { species: null, evolution: null }
  );
};

export const useRelatedPokemonByType = (type: string) => {
  return usePokeAPI(
    typesService.getPokemonByType.bind(typesService),
    [type],
    [type],
    []
  );
};

export const usePokemonTypes = () => {
  return usePokeAPI(
    typesService.getAllTypesWithDetails.bind(typesService),
    [],
    [],
    []
  );
};

export const useRegions = () => {
  return usePokeAPI(
    regionsService.getAllRegions.bind(regionsService),
    [],
    [],
    []
  );
};

export const useRegionDetails = (regionName: string) => {
  return usePokeAPI(
    regionsService.getRegionDetails.bind(regionsService),
    [regionName],
    [regionName],
    null
  );
};

export const usePokemonByGeneration = (generation: string | number) => {
  return usePokeAPI(
    regionsService.getPokemonByGeneration.bind(regionsService),
    [generation],
    [generation],
    []
  );
};

export const usePokedexes = () => {
  return usePokeAPI(
    pokedexService.getAllPokedexes.bind(pokedexService),
    [],
    [],
    []
  );
};

export const usePokedexDetails = (pokedexName: string) => {
  return usePokeAPI(
    pokedexService.getPokedexDetails.bind(pokedexService),
    [pokedexName],
    [pokedexName],
    null
  );
};

// New generation hooks
export const useAllGenerations = () => {
  return usePokeAPI(
    generationsService.getAllGenerations.bind(generationsService),
    [],
    [],
    []
  );
};

export const useGenerationDetails = (idOrName: string | number) => {
  return usePokeAPI(
    generationsService.getGenerationDetails.bind(generationsService),
    [idOrName],
    [idOrName],
    null
  );
};

export const useGenerationWithDetails = (idOrName: string | number) => {
  return usePokeAPI(
    generationsService.getGenerationWithDetails.bind(generationsService),
    [idOrName],
    [idOrName],
    null
  );
};

// Hook to clear the cache if needed
export const clearPokeAPICache = (keyPattern?: string) => {
  import('../../services').then(({ pokeApiCache }) => {
    pokeApiCache.clear(keyPattern);
  });
};
