import { TCG_API, TCG_API_KEY } from "@/config/api.config";
import {
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

interface SearchCardsResult {
  data: TcgCardListItem[];
  page: number;
  pageSize: number;
  totalCount: number;
}

const DEFAULT_PAGE_SIZE = 12;

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

  async searchCardsByPokemonName(
    pokemonName: string,
    page: number = 1,
    pageSize: number = DEFAULT_PAGE_SIZE,
  ): Promise<SearchCardsResult> {
    this.ensureConfigured();

    const searchTerm = pokemonName.trim().replace(/"/g, '\\"');
    const query = encodeURIComponent(`name:"${searchTerm}"`);
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

    const response = await fetch(`${this.baseUrl}cards/${cardId}`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || "Failed to fetch TCG card detail");
    }

    const raw = await response.json();
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
}

export const tcgService = new TcgService();
export type { SearchCardsResult };
