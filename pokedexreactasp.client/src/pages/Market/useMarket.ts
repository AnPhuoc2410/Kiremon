import { useState, useEffect, useCallback } from "react";
import {
  ItemCategory,
  Item,
  CategoriesResponse,
  ItemsResponse,
} from "./Market.types";

// PokeAPI GraphQL endpoint (beta)
const POKEAPI_GRAPHQL_URL = "https://beta.pokeapi.co/graphql/v1beta";

// ============ GraphQL Queries ============

const GET_CATEGORIES_QUERY = `
  query getCategories {
    itemcategory: pokemon_v2_itemcategory {
      id
      name
      itemcategorynames: pokemon_v2_itemcategorynames(where: {language_id: {_eq: 9}}) {
        name
      }
    }
  }
`;

const GET_ITEMS_BY_CATEGORY_QUERY = `
  query getItemsByCategory($categoryId: Int!) {
    item: pokemon_v2_item(where: {item_category_id: {_eq: $categoryId}}) {
      id
      name
      cost
      itemsprites: pokemon_v2_itemsprites {
        sprites
      }
      itemeffecttexts: pokemon_v2_itemflavortexts(where: {language_id: {_eq: 9}}, limit: 1) {
        effect: flavor_text
      }
    }
  }
`;

// ============ GraphQL Fetch Function ============

async function fetchGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const response = await fetch(POKEAPI_GRAPHQL_URL, {
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
    throw new Error(`GraphQL request failed: ${response.status}`);
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(result.errors[0]?.message || "GraphQL Error");
  }

  return result.data;
}

// ============ Cache Configuration ============

const CACHE_KEYS = {
  CATEGORIES: 'pokemart_categories',
} as const;

// ============ Hooks ============

interface UseCategoriesResult {
  categories: ItemCategory[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCategories(): UseCategoriesResult {
  const [categories, setCategories] = useState<ItemCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    try {
      // Check cache first (unless force refresh)
      if (!forceRefresh) {
        const cachedData = sessionStorage.getItem(CACHE_KEYS.CATEGORIES);
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          setCategories(parsed);
          setLoading(false);
          return;
        }
      }

      // Fetch from API if no cache or force refresh
      const data = await fetchGraphQL<CategoriesResponse>(GET_CATEGORIES_QUERY);
      setCategories(data.itemcategory);
      
      // Cache the result
      sessionStorage.setItem(CACHE_KEYS.CATEGORIES, JSON.stringify(data.itemcategory));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { 
    categories, 
    loading, 
    error, 
    refetch: () => fetchCategories(true) // Force refresh when manually refetching
  };
}

interface UseItemsResult {
  items: Item[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useItems(categoryId: number | null): UseItemsResult {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    if (categoryId === null) {
      setItems([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchGraphQL<ItemsResponse>(
        GET_ITEMS_BY_CATEGORY_QUERY,
        { categoryId }
      );
      setItems(data.item);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch items");
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return { items, loading, error, refetch: fetchItems };
}

// ============ Combined Hook ============

interface UsePokeMartResult {
  categories: ItemCategory[];
  categoriesLoading: boolean;
  categoriesError: string | null;
  refetchCategories: () => void;
  
  selectedCategory: number | null;
  setSelectedCategory: (id: number | null) => void;
  
  items: Item[];
  itemsLoading: boolean;
  itemsError: string | null;
  refetchItems: () => void;
  
  hoveredItem: Item | null;
  setHoveredItem: (item: Item | null) => void;
}

export function usePokeMart(): UsePokeMartResult {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [hoveredItem, setHoveredItem] = useState<Item | null>(null);
  
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useCategories();

  const {
    items,
    loading: itemsLoading,
    error: itemsError,
    refetch: refetchItems,
  } = useItems(selectedCategory);

  // Auto-select first category when categories load
  useEffect(() => {
    if (categories.length > 0 && selectedCategory === null) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, selectedCategory]);

  return {
    categories,
    categoriesLoading,
    categoriesError,
    refetchCategories,
    
    selectedCategory,
    setSelectedCategory,
    
    items,
    itemsLoading,
    itemsError,
    refetchItems,
    
    hoveredItem,
    setHoveredItem,
  };
}
