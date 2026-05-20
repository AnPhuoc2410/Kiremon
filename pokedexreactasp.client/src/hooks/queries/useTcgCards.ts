import { useQuery } from "@tanstack/react-query";
import { tcgService } from "@/services/tcg/tcg.service";
import { TcgCardFilters } from "@/types/tcg.types";

export const tcgQueryKeys = {
  all: ["tcg"] as const,
  cards: (
    pokemonName: string,
    page: number,
    pageSize: number,
    filters: TcgCardFilters,
  ) =>
    [
      ...tcgQueryKeys.all,
      "cards",
      pokemonName.toLowerCase(),
      page,
      pageSize,
      filters.rarity || "",
      filters.regulationMark || "",
      filters.subtype || "",
    ] as const,
  cardDetail: (cardId: string) =>
    [...tcgQueryKeys.all, "card", cardId] as const,
  facets: (pokemonName: string) =>
    [...tcgQueryKeys.all, "facets", pokemonName.toLowerCase()] as const,
};

export function useTcgCards(
  pokemonName: string,
  page: number,
  pageSize: number,
  filters: TcgCardFilters,
  enabled: boolean,
) {
  return useQuery({
    queryKey: tcgQueryKeys.cards(pokemonName, page, pageSize, filters),
    queryFn: () =>
      tcgService.searchCardsByPokemonName(pokemonName, page, pageSize, filters),
    enabled: enabled && !!pokemonName,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useTcgCardDetail(cardId: string | null, enabled: boolean) {
  return useQuery({
    queryKey: tcgQueryKeys.cardDetail(cardId || ""),
    queryFn: () => tcgService.getCardById(cardId!),
    enabled: enabled && !!cardId,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useTcgFacets(pokemonName: string, enabled: boolean) {
  return useQuery({
    queryKey: tcgQueryKeys.facets(pokemonName),
    queryFn: () => tcgService.preloadFacetsByPokemonName(pokemonName),
    enabled: enabled && !!pokemonName,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}
