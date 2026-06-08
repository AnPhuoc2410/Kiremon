import { useQuery } from "@tanstack/react-query";
import { tcgCardCollectionService } from "@/services/tcg-card-collection/tcg-card-collection.service";

export const pokemonTcgPreviewQueryKeys = {
  all: ["tcg-cards", "pokemon-preview"] as const,
  byPokemon: (pokemonApiId: number) =>
    [...pokemonTcgPreviewQueryKeys.all, pokemonApiId] as const,
};

export const usePokemonTcgPreview = (pokemonApiId?: number, enabled = true) => {
  const hasValidId = !!pokemonApiId && pokemonApiId > 0;

  return useQuery({
    queryKey: pokemonTcgPreviewQueryKeys.byPokemon(pokemonApiId ?? 0),
    queryFn: () =>
      tcgCardCollectionService.getPokemonPreviewCards(pokemonApiId!),
    enabled: enabled && hasValidId,
    staleTime: 60_000,
  });
};
