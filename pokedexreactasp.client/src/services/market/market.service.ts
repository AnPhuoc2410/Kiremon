import { GRAPHQL_ENDPOINT } from "../../config/api.config";
import { LANGUAGE_IDS } from "../../contexts";
import {
  CategoriesResponse,
  ItemsResponse,
  HeldItemDetailsResponse,
  ItemCategory,
  Item,
  ItemWithHeldPokemon,
} from "../../types/market.types";

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
      cost
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
      cost
      item_category_id
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
    const data = await executeGraphQLQuery<ItemsResponse>(
      GET_ITEMS_BY_CATEGORY_QUERY,
      { categoryId, languageId },
    );
    return data.item;
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
      item: Array<Item & { item_category_id: number }>;
    }>(SEARCH_ITEM_BY_NAME_QUERY, { name, languageId });

    if (data.item && data.item.length > 0) {
      const itemData = data.item[0];
      const { item_category_id, ...item } = itemData;
      return { item, categoryId: item_category_id };
    }
    return null;
  },
};
