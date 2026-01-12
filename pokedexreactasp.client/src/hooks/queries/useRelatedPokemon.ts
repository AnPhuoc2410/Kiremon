import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  pokemonGraphQLService,
  RelatedPokemonGraphQL,
} from "../../services/pokemon/pokemon-graphql.service";
import { RelatedPokemonItem } from "../../types/pokemon.d";
import { LANGUAGE_IDS, LanguageId } from "./usePokemonCore";

/**
 * Transform related Pokemon data to UI-friendly format
 */
function transformRelatedPokemon(
  data: RelatedPokemonGraphQL[],
  languageId: LanguageId,
): RelatedPokemonItem[] {
  return data.map((p: RelatedPokemonGraphQL) => {
    const sprites = pokemonGraphQLService.parseSprites(
      p.pokemons[0]?.pokemonsprites[0]?.sprites,
    );

    return {
      name:
        pokemonGraphQLService.getLocalizedName(
          p.pokemonspeciesnames,
          languageId,
        ) || p.name,
      url: "",
      id: p.pokemons[0]?.id || p.id,
      sprite: sprites?.front_default || undefined,
      slug: p.name,
    };
  });
}

/**
 * Lazy-loaded related Pokemon hook
 * Only fetches when enabled is true (e.g., when About tab is visible)
 */
export function useRelatedPokemon(
  generationId: number,
  excludeName: string,
  languageId: LanguageId = LANGUAGE_IDS.ENGLISH,
  enabled: boolean = true,
  limit: number = 6,
) {
  const relatedQuery = useQuery({
    queryKey: [
      "pokemon",
      "related",
      generationId,
      excludeName,
      languageId,
      limit,
    ],
    queryFn: async () => {
      if (!generationId) return [];
      const data = await pokemonGraphQLService.getRelatedPokemonByGeneration(
        generationId,
        excludeName,
        limit,
        languageId,
      );
      return transformRelatedPokemon(data, languageId);
    },
    enabled: !!generationId && enabled,
  });

  // Memoize the related Pokemon data
  const relatedPokemon = useMemo(() => {
    return relatedQuery.data ?? [];
  }, [relatedQuery.data]);

  return {
    relatedQuery,
    relatedPokemon,
    isLoading: relatedQuery.isLoading,
    isError: relatedQuery.isError,
    error: relatedQuery.error,
  };
}
