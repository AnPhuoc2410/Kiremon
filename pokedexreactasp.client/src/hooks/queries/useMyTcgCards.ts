import { useQuery } from "@tanstack/react-query";
import { tcgCardCollectionService } from "@/services/tcg-card-collection/tcg-card-collection.service";
import { MyTcgCardsQuery, TcgSort } from "@/types/tcg-card-collection.types";

export const myTcgCardsQueryKeys = {
  all: ["tcg-cards"] as const,
  myCards: (query: NormalizedMyTcgCardsQuery) =>
    [
      ...myTcgCardsQueryKeys.all,
      "my-cards",
      query.page,
      query.pageSize,
      query.pokemonApiId ?? "",
      query.rarityTier ?? "",
      query.sort ?? "obtained-desc",
    ] as const,
};

interface NormalizedMyTcgCardsQuery {
  page: number;
  pageSize: number;
  sort: TcgSort;
  pokemonApiId?: number;
  rarityTier?: string;
}

const sanitizeQuery = (query: MyTcgCardsQuery): NormalizedMyTcgCardsQuery => ({
  page: Math.max(1, query.page ?? 1),
  pageSize: Math.min(100, Math.max(1, query.pageSize ?? 30)),
  pokemonApiId: query.pokemonApiId,
  rarityTier: query.rarityTier,
  sort: query.sort ?? "obtained-desc",
});

export const useMyTcgCards = (query: MyTcgCardsQuery, enabled = true) => {
  const normalized = sanitizeQuery(query);

  return useQuery({
    queryKey: myTcgCardsQueryKeys.myCards(normalized),
    queryFn: () => tcgCardCollectionService.getMyCards(normalized),
    enabled,
    staleTime: 30_000,
  });
};
