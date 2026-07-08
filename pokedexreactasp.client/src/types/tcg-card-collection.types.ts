export type TcgSort =
  | "obtained-desc"
  | "obtained-asc"
  | "rarity-desc"
  | "rarity-asc";

import { TcgCardRarityTier } from "./pokemon.enums";

export interface MyTcgCardsQuery {
  page?: number;
  pageSize?: number;
  pokemonApiId?: number;
  rarityTier?: TcgCardRarityTier;
  sort?: TcgSort;
}

export interface MyTcgCardItem {
  userCardId: number;
  tcgCardId: string;
  pokemonApiId: number;
  name: string;
  rarity?: string | null;
  rarityTier: TcgCardRarityTier;
  quantity: number;
  imageSmall?: string | null;
  imageLarge?: string | null;
}

export interface PagedTcgCardsResponse {
  items: MyTcgCardItem[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface PokemonTcgPreviewCard {
  tcgCardId: string;
  pokemonApiId: number;
  name: string;
  rarity?: string | null;
  rarityTier: TcgCardRarityTier;
  imageSmall?: string | null;
  imageLarge?: string | null;
}
