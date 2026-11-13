import { GRAPHQL_ENDPOINT } from "@/config/api.config";
import { LANGUAGE_IDS } from "@/contexts";
import {
  CategoriesResponse,
  ItemsResponse,
  HeldItemDetailsResponse,
  ItemCategory,
  Item,
  ItemWithHeldPokemon,
} from "@/types/market.types";

// ============ GraphQL Queries ============

const GET_CATEGORIES_QUERY = `
  query getCategories($languageId: Int!) {
    itemcategory {
      id
      name
      itemcategorynames(where: {language_id: {_eq: $languageId}}) {
        name
      }
    }
  }
`;

const GET_ITEMS_BY_CATEGORY_QUERY = `
  query getItemsByCategory($categoryId: Int!, $languageId: Int!) {
    item(where: {item_category_id: {_eq: $categoryId}}) {
      id
      name
      itemprices {
        purchase_price
        sell_price
      }
      itemnames(where: {language_id: {_eq: $languageId}}) {
        name
      }
      itemsprites {
        sprites
      }
    }
  }
`;

const GET_HELD_ITEM_DETAILS_QUERY = `
  query getHeldItemDetails($itemId: Int!, $languageId: Int!) {
    item(where: {id: {_eq: $itemId}}) {
      id
      itemeffecttexts(where: {language_id: {_eq: $languageId}}, limit: 1) {
        effect
      }
      pokemonitems(
        distinct_on: [pokemon_id]
        order_by: {pokemon_id: asc}
      ) {
        pokemon {
          name
          id
        }
      }
    }
  }
`;

const SEARCH_ITEM_BY_NAME_QUERY = `
  query searchItemByName($name: String!, $languageId: Int!) {
    item(where: {name: {_eq: $name}}) {
      id
      name
      item_category_id
      itemprices {
        purchase_price
        sell_price
      }
      itemnames(where: {language_id: {_eq: $languageId}}) {
        name
      }
      itemsprites {
        sprites
      }
    }
  }
`;

// ============ GraphQL Fetch Function ============

async function executeGraphQLQuery<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `GraphQL request failed: ${response.status} ${response.statusText}`,
    );
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(result.errors[0]?.message || "GraphQL Error");
  }

  return result.data;
}

// Fallback prices for items when PokeAPI itemprices table is empty or missing
const DEFAULT_ITEM_PRICES: Record<string, number> = {
  "poke-ball": 200,
  "great-ball": 600,
  "ultra-ball": 1200,
  "master-ball": 0,
  "safari-ball": 0,
  "premier-ball": 200,
  "heal-ball": 300,
  "net-ball": 1000,
  "nest-ball": 1000,
  "dive-ball": 1000,
  "dusk-ball": 1000,
  "timer-ball": 1000,
  "quick-ball": 1000,
  "repeat-ball": 1000,
  "luxury-ball": 1000,
  potion: 200,
  "super-potion": 700,
  "hyper-potion": 1500,
  "max-potion": 2500,
  "full-restore": 3000,
  revive: 2000,
  "max-revive": 0,
  antidote: 200,
  "paralyze-heal": 300,
  awakening: 100,
  "burn-heal": 300,
  "ice-heal": 100,
  "full-heal": 400,
  "escape-rope": 1000,
  repel: 400,
  "super-repel": 700,
  "max-repel": 900,
  "guard-spec": 700,
  "dire-hit": 1000,
  "x-attack": 1000,
  "x-defense": 1000,
  "x-speed": 1000,
  "x-accuracy": 1000,
  "x-special": 1000,
  "x-sp-atk": 1000,
  "x-sp-def": 1000,
};

interface RawItemData extends Omit<Item, "cost"> {
  itemprices?: Array<{
    purchase_price: number | null;
    sell_price: number | null;
  }>;
}

export const resolveItemCost = (
  name: string,
  itemprices?: Array<{
    purchase_price: number | null;
    sell_price: number | null;
  }>,
): number => {
  if (itemprices && itemprices.length > 0) {
    const purchase = itemprices.find(
      (p) => p.purchase_price != null && p.purchase_price > 0,
    )?.purchase_price;
    if (purchase != null) return purchase;

    const sell = itemprices.find(
      (p) => p.sell_price != null && p.sell_price > 0,
    )?.sell_price;
    if (sell != null) return sell * 2;
  }
  return DEFAULT_ITEM_PRICES[name.toLowerCase()] ?? 0;
};

// ============ Market Service ============

export const marketService = {
  /**
   * Fetch all item categories
   * @param languageId - Language ID for localized names (default: English)
   */
  async getCategories(
    languageId: number = LANGUAGE_IDS.ENGLISH,
  ): Promise<ItemCategory[]> {
    const data = await executeGraphQLQuery<CategoriesResponse>(
      GET_CATEGORIES_QUERY,
      { languageId },
    );
    return data.itemcategory;
  },

  /**
   * Fetch items by category ID
   * @param categoryId - Category ID to fetch items for
   * @param languageId - Language ID for localized names (default: English)
   */
  async getItemsByCategory(
    categoryId: number,
    languageId: number = LANGUAGE_IDS.ENGLISH,
  ): Promise<Item[]> {
    const data = await executeGraphQLQuery<{ item: RawItemData[] }>(
      GET_ITEMS_BY_CATEGORY_QUERY,
      { categoryId, languageId },
    );
    return (data.item || []).map((raw) => {
      const { itemprices, ...item } = raw;
      return {
        ...item,
        cost: resolveItemCost(item.name, itemprices),
      };
    });
  },

  /**
   * Fetch held item details including description and wild Pokemon
   * @param itemId - Item ID to fetch details for
   * @param languageId - Language ID for localized text (default: English)
   */
  async getHeldItemDetails(
    itemId: number,
    languageId: number = LANGUAGE_IDS.ENGLISH,
  ): Promise<ItemWithHeldPokemon | null> {
    const data = await executeGraphQLQuery<HeldItemDetailsResponse>(
      GET_HELD_ITEM_DETAILS_QUERY,
      { itemId, languageId },
    );

    return data.item && data.item.length > 0 ? data.item[0] : null;
  },

  /**
   * Search item by exact name
   * @param name - Item name to search for
   * @param languageId - Language ID for localized names (default: English)
   */
  async searchItemByName(
    name: string,
    languageId: number = LANGUAGE_IDS.ENGLISH,
  ): Promise<{ item: Item; categoryId: number } | null> {
    const data = await executeGraphQLQuery<{
      item: Array<RawItemData & { item_category_id: number }>;
    }>(SEARCH_ITEM_BY_NAME_QUERY, { name, languageId });

    if (data.item && data.item.length > 0) {
      const itemData = data.item[0];
      const { item_category_id, itemprices, ...rawItem } = itemData;
      const item: Item = {
        ...rawItem,
        cost: resolveItemCost(rawItem.name, itemprices),
      };
      return { item, categoryId: item_category_id };
    }
    return null;
  },
};
