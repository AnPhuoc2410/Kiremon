export type TcgSort =
  | "obtained-desc"
  | "obtained-asc"
  | "rarity-desc"
  | "rarity-asc";

export interface MyTcgCardsQuery {
  page?: number;
  pageSize?: number;
  pokemonApiId?: number;
  rarityTier?: string;
  sort?: TcgSort;
}

export interface MyTcgCardItem {
  userCardId: number;
  tcgCardId: string;
  pokemonApiId: number;
  name: string;
  rarity?: string | null;
  rarityTier: string;
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
  rarityTier: string;
  imageSmall?: string | null;
  imageLarge?: string | null;
}
