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
    // Simplified strategy: Fetch ALL cards for the base name and filter in memory.
    // This avoids complex API queries that cause 504 Timeouts.
    
    let baseName = name.toLowerCase();
    let variantType: "normal" | "mega" | "gmax" | "alola" | "galar" | "hisui" = "normal";

    if (baseName.endsWith("-mega")) {
      baseName = baseName.replace("-mega", "");
      variantType = "mega";
    } else if (baseName.endsWith("-gmax")) {
      baseName = baseName.replace("-gmax", "");
      variantType = "gmax";
    } else if (baseName.endsWith("-alola")) {
      baseName = baseName.replace("-alola", "");
      variantType = "alola";
    } else if (baseName.endsWith("-galar")) {
      baseName = baseName.replace("-galar", "");
      variantType = "galar";
    } else if (baseName.endsWith("-hisui")) {
      baseName = baseName.replace("-hisui", "");
      variantType = "hisui";
    }
    
    // Sanitize base name
    baseName = baseName.replace(/-/g, " ");

    // Standard query: name:"<baseName>"
    // Wildcards (*) and large page sizes can cause timeouts.
    const simpleQuery = `name:"${baseName}"`;
    
    console.log(`[TCG] Fetching all cards for: ${baseName} (query: ${simpleQuery})`);

    // Use local proxy endpoint
    const response = await axios.get<ITCGResponse>("/api/tcg/cards", {
      params: {
        q: simpleQuery,
        orderBy: "-set.releaseDate",
        pageSize: 100, // Reduced from 250 to avoid timeouts
      },
    });
    
    const allCards = response.data.data;
    console.log(`[TCG] Fetched ${allCards.length} cards raw. Filtering for ${variantType}...`);

    // Client-side filtering
    const filteredCards = allCards.filter(card => {
      const cardName = card.name.toLowerCase();
      
      // Helper to check if card is a specific variant
      const isMega = cardName.includes("mega ") || cardName.startsWith("m ") || card.subtypes?.includes("MEGA");
      const isVMAX = cardName.includes("vmax") || card.subtypes?.includes("VMAX");
      const isVSTAR = cardName.includes("vstar") || card.subtypes?.includes("VSTAR");
      const isAlolan = cardName.includes("alolan");
      const isGalarian = cardName.includes("galarian");
      const isHisuian = cardName.includes("hisuian");
      const isSpecial = isMega || isVMAX || isVSTAR || isAlolan || isGalarian || isHisuian;

      switch (variantType) {
        case "mega":
          return isMega;
        case "gmax":
          return isVMAX;
        case "alola":
          return isAlolan;
        case "galar":
          return isGalarian;
        case "hisui":
          return isHisuian;
        case "normal":
        default:
          // For normal, exclude all special variants
          // BUT: Venusaur EX, Venusaur V are NOT considered "special variants" in this context 
          // (user wants base form + typical powerful cards, but not DIFFERENT forms like Mega)
          return !isSpecial; 
      }
    });

    console.log(`[TCG] Found ${filteredCards.length} cards after filtering.`);
    return filteredCards;
  } catch (error) {
    console.error("Error fetching TCG cards:", error);
    return [];
  }
};
