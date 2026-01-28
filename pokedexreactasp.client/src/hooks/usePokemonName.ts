import { useState, useEffect } from "react";
import { GRAPHQL_ENDPOINT } from "../config/api.config";
import { LanguageId, LANGUAGE_IDS } from "../contexts";
import { cacheUtils } from "../services/cache/cache";

interface PokemonSpeciesName {
  name: string;
  language_id: number;
}

interface PokemonNameCache {
  [key: string]: string; // key: `${pokemonId}_${languageId}`
}

// In-memory cache for quick access
const localNameCache: PokemonNameCache = {};

// GraphQL query to fetch localized Pokemon names
const GET_POKEMON_NAME_QUERY = `
  query getPokemonName($id: Int!) {
    pokemonspecies(where: {id: {_eq: $id}}) {
      id
      name
      pokemonspeciesnames {
        name
        language_id
      }
    }
  }
`;

// Batch query for multiple Pokemon
const GET_POKEMON_NAMES_BATCH_QUERY = `
  query getPokemonNamesBatch($ids: [Int!]!) {
    pokemonspecies(where: {id: {_in: $ids}}) {
      id
      name
      pokemonspeciesnames {
        name
        language_id
      }
    }
  }
`;

async function fetchPokemonName(
  pokemonId: number,
  languageId: LanguageId,
): Promise<string> {
  const cacheKey = `pokemonName:${pokemonId}:${languageId}`;

  // Check local cache first
  if (localNameCache[cacheKey]) {
    return localNameCache[cacheKey];
  }

  try {
    const result = await cacheUtils.getOrSet(cacheKey, async () => {
      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: GET_POKEMON_NAME_QUERY,
          variables: { id: pokemonId },
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch Pokemon name: ${response.status}`);
      }

      const data = await response.json();
      const species = data.data?.pokemonspecies?.[0];

      if (!species) {
        return null;
      }

      // Find the localized name
      const localizedName = species.pokemonspeciesnames?.find(
        (n: PokemonSpeciesName) => n.language_id === languageId,
      )?.name;

      // Fallback to English, then to species name
      const englishName = species.pokemonspeciesnames?.find(
        (n: PokemonSpeciesName) => n.language_id === LANGUAGE_IDS.ENGLISH,
      )?.name;

      return localizedName || englishName || species.name;
    });

    if (result) {
      localNameCache[cacheKey] = result;
      return result;
    }

    return "";
  } catch (error) {
    console.error(`Error fetching Pokemon name for ID ${pokemonId}:`, error);
    return "";
  }
}

/**
 * Fetch multiple Pokemon names in a single batch request
 */
export async function fetchPokemonNamesBatch(
  pokemonIds: number[],
  languageId: LanguageId,
): Promise<Map<number, string>> {
  const results = new Map<number, string>();
  const idsToFetch: number[] = [];

  // Check cache first
  for (const id of pokemonIds) {
    const cacheKey = `pokemonName:${id}:${languageId}`;
    if (localNameCache[cacheKey]) {
      results.set(id, localNameCache[cacheKey]);
    } else {
      idsToFetch.push(id);
    }
  }

  // If all names are cached, return early
  if (idsToFetch.length === 0) {
    return results;
  }

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: GET_POKEMON_NAMES_BATCH_QUERY,
        variables: { ids: idsToFetch },
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon names: ${response.status}`);
    }

    const data = await response.json();
    const speciesList = data.data?.pokemonspecies || [];

    for (const species of speciesList) {
      const localizedName = species.pokemonspeciesnames?.find(
        (n: PokemonSpeciesName) => n.language_id === languageId,
      )?.name;

      const englishName = species.pokemonspeciesnames?.find(
        (n: PokemonSpeciesName) => n.language_id === LANGUAGE_IDS.ENGLISH,
      )?.name;

      const name = localizedName || englishName || species.name;
      const cacheKey = `pokemonName:${species.id}:${languageId}`;

      localNameCache[cacheKey] = name;
      results.set(species.id, name);
    }
  } catch (error) {
    console.error("Error fetching Pokemon names batch:", error);
  }

  return results;
}

/**
 * Hook to get localized Pokemon name
 * @param pokemonId - Pokemon ID (species ID)
 * @param englishName - Fallback English name
 * @param languageId - Target language ID
 * @returns Localized Pokemon name
 */
export function usePokemonName(
  pokemonId: number | undefined,
  englishName: string,
  languageId: LanguageId,
): string {
  const [localizedName, setLocalizedName] = useState<string>(englishName);

  useEffect(() => {
    // If language is English, just use the English name
    if (languageId === LANGUAGE_IDS.ENGLISH || !pokemonId) {
      setLocalizedName(englishName);
      return;
    }

    // Check local cache first
    const cacheKey = `pokemonName:${pokemonId}:${languageId}`;
    if (localNameCache[cacheKey]) {
      setLocalizedName(localNameCache[cacheKey]);
      return;
    }

    // Fetch localized name
    let isMounted = true;
    fetchPokemonName(pokemonId, languageId).then((name) => {
      if (isMounted && name) {
        setLocalizedName(name);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [pokemonId, englishName, languageId]);

  return localizedName;
}

/**
 * Utility to capitalize Pokemon name properly
 */
export function formatPokemonName(name: string): string {
  if (!name) return "";
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}
