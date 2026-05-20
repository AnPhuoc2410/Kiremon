import { TCG_API, TCG_API_KEY } from "@/config/api.config";
import {
  TcgCardFilters,
  TcgCardFacets,
  TcgCardDetail,
  TcgCardListItem,
} from "@/types/tcg.types";

interface RawCardSearchResponse {
  data: any[];
  page: number;
  pageSize: number;
  count: number;
  totalCount: number;
}

interface RawCardDetailResponse {
  data: any;
}

interface SearchCardsResult {
  data: TcgCardListItem[];
  page: number;
  pageSize: number;
  totalCount: number;
}

const DEFAULT_PAGE_SIZE = 12;
const FACET_PAGE_SIZE = 250;

class TcgService {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor() {
    this.baseUrl = TCG_API;
    this.apiKey = TCG_API_KEY;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (this.apiKey) {
      headers["X-Api-Key"] = this.apiKey;
    }

    return headers;
  }

  private ensureConfigured() {
    if (!this.baseUrl) {
      throw new Error(
        "TCG API URL is missing. Please set VITE_TCG_API in frontend env.",
      );
    }
  }

  private mapCard(raw: any): TcgCardListItem {
    return {
      id: raw.id,
      name: raw.name,
      number: raw.number,
      rarity: raw.rarity,
      regulationMark: raw.regulationMark,
      supertype: raw.supertype,
      subtypes: raw.subtypes,
      images: raw.images,
      set: {
        id: raw.set?.id ?? "",
        name: raw.set?.name ?? "",
        series: raw.set?.series ?? "",
        releaseDate: raw.set?.releaseDate ?? "",
        images: raw.set?.images,
      },
    };
  }

  private unwrapCard(payload: any): any {
    if (payload && typeof payload === "object" && "data" in payload) {
      return payload.data;
    }
    return payload;
  }

  async searchCardsByPokemonName(
    pokemonName: string,
    page: number = 1,
    pageSize: number = DEFAULT_PAGE_SIZE,
    filters?: TcgCardFilters,
  ): Promise<SearchCardsResult> {
    this.ensureConfigured();

    const searchTerm = pokemonName.trim().replace(/"/g, '\\"');
    const queryParts = [`name:"${searchTerm}"`];
    if (filters?.rarity) queryParts.push(`rarity:"${filters.rarity}"`);
    if (filters?.regulationMark) {
      queryParts.push(`regulationMark:"${filters.regulationMark}"`);
    }
    if (filters?.subtype) queryParts.push(`subtypes:"${filters.subtype}"`);

    const query = encodeURIComponent(queryParts.join(" "));
    const url = `${this.baseUrl}cards?q=${query}&page=${page}&pageSize=${pageSize}&orderBy=set.releaseDate,number`;

    const response = await fetch(url, {
      method: "GET",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || "Failed to fetch TCG cards");
    }

    const payload: RawCardSearchResponse = await response.json();
    const mappedData = (payload.data || []).map((card) => this.mapCard(card));

    return {
      data: mappedData,
      page: payload.page ?? page,
      pageSize: payload.pageSize ?? pageSize,
      totalCount: payload.totalCount ?? 0,
    };
  }

  async getCardById(cardId: string): Promise<TcgCardDetail> {
    this.ensureConfigured();

    const encodedId = encodeURIComponent(cardId);
    const response = await fetch(`${this.baseUrl}cards/${encodedId}`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || "Failed to fetch TCG card detail");
    }

    const payload: RawCardDetailResponse | any = await response.json();
    const raw = this.unwrapCard(payload);

    if (!raw || !raw.id) {
      throw new Error("Invalid TCG card detail response");
    }

    return {
      ...this.mapCard(raw),
      hp: raw.hp,
      types: raw.types,
      evolvesFrom: raw.evolvesFrom,
      abilities: raw.abilities,
      attacks: raw.attacks,
      weaknesses: raw.weaknesses,
      resistances: raw.resistances,
      retreatCost: raw.retreatCost,
      convertedRetreatCost: raw.convertedRetreatCost,
      artist: raw.artist,
      flavorText: raw.flavorText,
      nationalPokedexNumbers: raw.nationalPokedexNumbers,
      legalities: raw.legalities,
    };
  }

  async preloadFacetsByPokemonName(pokemonName: string): Promise<TcgCardFacets> {
    this.ensureConfigured();

    const searchTerm = pokemonName.trim().replace(/"/g, '\\"');
    const query = encodeURIComponent(`name:"${searchTerm}"`);

    let page = 1;
    let totalCount = 0;
    const raritySet = new Set<string>();
    const regulationSet = new Set<string>();
    const subtypeSet = new Set<string>();

    do {
      const url = `${this.baseUrl}cards?q=${query}&page=${page}&pageSize=${FACET_PAGE_SIZE}`;
      const response = await fetch(url, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to preload TCG facets");
      }

      const payload: RawCardSearchResponse = await response.json();
      const cards = payload.data || [];
      totalCount = payload.totalCount || 0;

      cards.forEach((card) => {
        if (card.rarity) raritySet.add(card.rarity);
        if (card.regulationMark) regulationSet.add(card.regulationMark);
        (card.subtypes || []).forEach((subtype: string) => {
          if (subtype) subtypeSet.add(subtype);
        });
      });

      page += 1;
      if (cards.length === 0) break;
    } while ((page - 1) * FACET_PAGE_SIZE < totalCount);

    return {
      rarities: Array.from(raritySet).sort(),
      regulationMarks: Array.from(regulationSet).sort(),
      subtypes: Array.from(subtypeSet).sort(),
    };
  }
}

export const tcgService = new TcgService();
export type { SearchCardsResult };
