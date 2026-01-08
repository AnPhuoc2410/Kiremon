import { useState, useEffect, useCallback } from "react";
import { marketService } from "../../services/market";
import { ItemCategory, Item, PokemonBasic } from "../../types/market.types";

// ============ Cache Configuration ============

const CACHE_KEYS = {
  CATEGORIES: "pokemart_categories",
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
      const categories = await marketService.getCategories();
      setCategories(categories);

      // Cache the result
      sessionStorage.setItem(CACHE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch categories",
      );
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
    refetch: () => fetchCategories(true), // Force refresh when manually refetching
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
      const items = await marketService.getItemsByCategory(categoryId);
      setItems(items);
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

// ============ Held Item Details Hook ============

interface UseHeldItemDetailsResult {
  wildPokemon: PokemonBasic[];
  itemEffect: string;
  loading: boolean;
  error: string | null;
  fetchHeldItemDetails: (itemId: number) => Promise<void>;
  clearHeldItemDetails: () => void;
}

export function useHeldItemDetails(): UseHeldItemDetailsResult {
  const [wildPokemon, setWildPokemon] = useState<PokemonBasic[]>([]);
  const [itemEffect, setItemEffect] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHeldItemDetails = useCallback(async (itemId: number) => {
    setLoading(true);
    setError(null);

    try {
      const itemData = await marketService.getHeldItemDetails(itemId);

      if (itemData) {
        // Extract pokemon list from pokemonitems
        const pokemonList =
          itemData.pokemonitems?.map((pi) => pi.pokemon) || [];
        setWildPokemon(pokemonList);

        // Extract effect text
        const effect =
          itemData.itemeffecttexts?.[0]?.effect || "No description available.";
        setItemEffect(effect);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch held item details",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const clearHeldItemDetails = useCallback(() => {
    setWildPokemon([]);
    setItemEffect("");
    setError(null);
  }, []);

  return {
    wildPokemon,
    itemEffect,
    loading,
    error,
    fetchHeldItemDetails,
    clearHeldItemDetails,
  };
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
