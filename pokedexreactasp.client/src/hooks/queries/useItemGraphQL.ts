import { useQuery } from "@tanstack/react-query";

import { useLanguage } from "@/contexts";
import { pokemonGraphQLService } from "@/services/pokemon/pokemon-graphql.service";
import { ItemCategory } from "@/types/market.types";

export const itemGraphQLQueryKeys = {
  all: ["item-graphql"] as const,
  categories: (languageId: number) =>
    [...itemGraphQLQueryKeys.all, "categories", languageId] as const,
  effect: (itemId: number, languageId: number) =>
    [...itemGraphQLQueryKeys.all, "effect", itemId, languageId] as const,
};

export function useItemCategories() {
  const { languageId } = useLanguage();

  const query = useQuery({
    queryKey: itemGraphQLQueryKeys.categories(languageId),
    queryFn: () => pokemonGraphQLService.getItemCategories(languageId),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });

  return {
    categories: (query.data ?? []) as ItemCategory[],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useItemEffectDetails(
  itemApiId: number | null,
  enabled = true,
) {
  const { languageId } = useLanguage();

  const query = useQuery({
    queryKey: itemGraphQLQueryKeys.effect(itemApiId ?? 0, languageId),
    queryFn: () => pokemonGraphQLService.getItemEffectDetails(itemApiId!, languageId),
    enabled: itemApiId != null && enabled,
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const itemEffect =
    query.data?.itemeffecttexts?.[0]?.effect?.trim() ||
    "No description available.";

  const wildPokemon =
    query.data?.pokemonitems?.map((entry) => entry.pokemon) ?? [];

  return {
    itemEffect,
    wildPokemon,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
