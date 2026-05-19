import { useQuery } from "@tanstack/react-query";
import { tcgService } from "@/services/tcg/tcg.service";

export const tcgQueryKeys = {
  all: ["tcg"] as const,
  cards: (pokemonName: string, page: number, pageSize: number) =>
    [...tcgQueryKeys.all, "cards", pokemonName.toLowerCase(), page, pageSize] as const,
  cardDetail: (cardId: string) =>
    [...tcgQueryKeys.all, "card", cardId] as const,
};

export function useTcgCards(
  pokemonName: string,
  page: number,
  pageSize: number,
  enabled: boolean,
) {
  return useQuery({
    queryKey: tcgQueryKeys.cards(pokemonName, page, pageSize),
    queryFn: () => tcgService.searchCardsByPokemonName(pokemonName, page, pageSize),
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
