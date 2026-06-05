// TanStack Query based hooks for Pokemon data
export { usePokemonCore, LANGUAGE_IDS } from "./usePokemonCore";
export type { LanguageId, MoveDetailData } from "./usePokemonCore";

export { usePokemonEvolution } from "./usePokemonEvolution";
export { useRelatedPokemon } from "./useRelatedPokemon";
export {
  useTcgCards,
  useTcgCardDetail,
  useTcgFacets,
  tcgQueryKeys,
} from "./useTcgCards";
export { useWildArea, useWildAreas, wildAreaQueryKeys } from "./useWildArea";
export { useMyTcgCards, myTcgCardsQueryKeys } from "./useMyTcgCards";
export {
  usePokemonTcgPreview,
  pokemonTcgPreviewQueryKeys,
} from "./usePokemonTcgPreview";

// TanStack Query based hooks for Market/Poké Mart
export {
  useMarketCategories,
  useMarketItems,
  useHeldItemDetails,
  useSearchItem,
  usePokeMartQuery,
  marketQueryKeys,
} from "./useMarket";
