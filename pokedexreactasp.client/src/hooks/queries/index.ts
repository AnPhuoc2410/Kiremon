// TanStack Query based hooks for Pokemon data
export { usePokemonCore, LANGUAGE_IDS } from "./usePokemonCore";
export type { LanguageId, MoveDetailData } from "./usePokemonCore";

export { usePokemonEvolution } from "./usePokemonEvolution";
export { useRelatedPokemon } from "./useRelatedPokemon";
export { useTcgCards, useTcgCardDetail, tcgQueryKeys } from "./useTcgCards";

// TanStack Query based hooks for Market/Poké Mart
export {
  useMarketCategories,
  useMarketItems,
  useHeldItemDetails,
  useSearchItem,
  usePokeMartQuery,
  marketQueryKeys,
} from "./useMarket";
