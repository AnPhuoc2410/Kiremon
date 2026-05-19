export interface TcgPaginationMeta {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface TcgCardSetInfo {
  id: string;
  name: string;
  series: string;
  releaseDate: string;
  images?: {
    symbol?: string;
    logo?: string;
  };
}

export interface TcgCardListItem {
  id: string;
  name: string;
  number: string;
  rarity?: string;
  regulationMark?: string;
  supertype?: string;
  subtypes?: string[];
  images?: {
    small?: string;
    large?: string;
  };
  set: TcgCardSetInfo;
}

export interface TcgAttack {
  name: string;
  cost?: string[];
  convertedEnergyCost?: number;
  damage?: string;
  text?: string;
}

export interface TcgAbility {
  name: string;
  type?: string;
  text?: string;
}

export interface TcgWeaknessResistance {
  type: string;
  value: string;
}

export interface TcgLegality {
  unlimited?: string;
  expanded?: string;
  standard?: string;
}

export interface TcgCardDetail extends TcgCardListItem {
  hp?: string;
  types?: string[];
  evolvesFrom?: string;
  abilities?: TcgAbility[];
  attacks?: TcgAttack[];
  weaknesses?: TcgWeaknessResistance[];
  resistances?: TcgWeaknessResistance[];
  retreatCost?: string[];
  convertedRetreatCost?: number;
  artist?: string;
  flavorText?: string;
  nationalPokedexNumbers?: number[];
  legalities?: TcgLegality;
}

export interface TcgCardSearchResponse {
  data: TcgCardListItem[];
  page: number;
  pageSize: number;
  count: number;
  totalCount: number;
}
