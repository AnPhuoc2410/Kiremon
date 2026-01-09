import axios from "axios";

const TCG_API_URL = import.meta.env.VITE_TCG_API;
const TCG_API_KEY = import.meta.env.VITE_TCG_IMAGE;

export interface ITCGCard {
  id: string;
  name: string;
  supertype: string;
  subtypes: string[];
  hp?: string;
  types?: string[];
  evolvesFrom?: string;
  rules?: string[];
  attacks?: {
    name: string;
    cost: string[];
    convertedEnergyCost: number;
    damage: string;
    text: string;
  }[];
  weaknesses?: {
    type: string;
    value: string;
  }[];
  resistances?: {
    type: string;
    value: string;
  }[];
  retreatCost?: string[];
  convertedRetreatCost?: number;
  set: {
    id: string;
    name: string;
    series: string;
    printedTotal: number;
    total: number;
    legalities: {
      unlimited: string;
    };
    ptcgoCode?: string;
    releaseDate: string;
    updatedAt: string;
    images: {
      symbol: string;
      logo: string;
    };
  };
  number: string;
  artist?: string;
  rarity?: string;
  flavorText?: string;
  nationalPokedexNumbers?: number[];
  legalities: {
    unlimited: string;
  };
  images: {
    small: string;
    large: string;
  };
  tcgplayer?: {
    url: string;
    updatedAt: string;
    prices: {
      holofoil?: {
        low: number;
        mid: number;
        high: number;
        market: number;
        directLow?: number;
      };
      reverseHolofoil?: {
        low: number;
        mid: number;
        high: number;
        market: number;
        directLow?: number;
      };
    };
  };
  cardmarket?: {
    url: string;
    updatedAt: string;
    prices: {
      averageSellPrice: number;
      lowPrice: number;
      trendPrice: number;
      germanProLow: number;
      suggestedPrice: number;
      reverseHoloSell: number;
      reverseHoloLow: number;
      reverseHoloTrend: number;
      lowPriceExPlus: number;
      avg1: number;
      avg7: number;
      avg30: number;
      reverseHoloAvg1: number;
      reverseHoloAvg7: number;
      reverseHoloAvg30: number;
    };
  };
}

export interface ITCGResponse {
  data: ITCGCard[];
  page: number;
  pageSize: number;
  count: number;
  totalCount: number;
}

export const getCardsByPokemonName = async (name: string): Promise<ITCGCard[]> => {
  try {
    const sanitizedName = name.replace(/-/g, " ");
    const query = `name:"${sanitizedName}"`; 
    
    console.log(`[TCG] Fetching cards for: ${name} (query: ${query})`);

    const response = await axios.get<ITCGResponse>(`${TCG_API_URL}cards`, {
      headers: {
        "X-Api-Key": TCG_API_KEY,
      },
      params: {
        q: query,
        orderBy: "-set.releaseDate", // Show newest cards first
        pageSize: 50, // Limit to 50 cards for now to avoid overwhelming UI
      },
    });
    
    console.log(`[TCG] Found ${response.data.data.length} cards`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching TCG cards:", error);
    return [];
  }
};
