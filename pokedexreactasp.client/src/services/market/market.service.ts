import { GRAPHQL_ENDPOINT } from '../../config/api.config';
import {
  CategoriesResponse,
  ItemsResponse,
  HeldItemDetailsResponse,
  ItemCategory,
  Item,
  ItemWithHeldPokemon,
} from '../../types/market.types';

// ============ GraphQL Queries ============

const GET_CATEGORIES_QUERY = `
  query getCategories {
    itemcategory {
      id
      name
      itemcategorynames(where: {language_id: {_eq: 9}}) {
        name
      }
    }
  }
`;

const GET_ITEMS_BY_CATEGORY_QUERY = `
  query getItemsByCategory($categoryId: Int!) {
    item(where: {item_category_id: {_eq: $categoryId}}) {
      id
      name
      cost
      itemnames(where: {language_id: {_eq: 9}}) {
        name
      }
      itemsprites {
        sprites
      }
    }
  }
`;

const GET_HELD_ITEM_DETAILS_QUERY = `
  query getHeldItemDetails($itemId: Int!) {
    item(where: {id: {_eq: $itemId}}) {
      id
      itemeffecttexts(where: {language_id: {_eq: 9}}, limit: 1) {
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

// ============ GraphQL Fetch Function ============

async function executeGraphQLQuery<T>(
  query: string,
  variables?: Record<string, unknown>
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
    throw new Error(`GraphQL request failed: ${response.status} ${response.statusText}`);
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
   */
  async getCategories(): Promise<ItemCategory[]> {
    const data = await executeGraphQLQuery<CategoriesResponse>(GET_CATEGORIES_QUERY);
    return data.itemcategory;
  },

  /**
   * Fetch items by category ID
   */
  async getItemsByCategory(categoryId: number): Promise<Item[]> {
    const data = await executeGraphQLQuery<ItemsResponse>(
      GET_ITEMS_BY_CATEGORY_QUERY,
      { categoryId }
    );
    return data.item;
  },

  /**
   * Fetch held item details including description and wild Pokemon
   */
  async getHeldItemDetails(itemId: number): Promise<ItemWithHeldPokemon | null> {
    const data = await executeGraphQLQuery<HeldItemDetailsResponse>(
      GET_HELD_ITEM_DETAILS_QUERY,
      { itemId }
    );
    
    return data.item && data.item.length > 0 ? data.item[0] : null;
  },
};
