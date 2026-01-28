import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import { marketService } from "../../services/market";
import { useLanguage, LanguageId, LANGUAGE_IDS } from "../../contexts";
import {
  ItemCategory,
  Item,
  PokemonBasic,
  ItemWithHeldPokemon,
} from "../../types/market.types";

// ============ Query Keys ============

export const marketQueryKeys = {
  all: ["market"] as const,
  categories: (languageId: LanguageId) =>
    [...marketQueryKeys.all, "categories", languageId] as const,
  items: (categoryId: number, languageId: LanguageId) =>
    [...marketQueryKeys.all, "items", categoryId, languageId] as const,
  heldItemDetails: (itemId: number, languageId: LanguageId) =>
    [...marketQueryKeys.all, "heldItem", itemId, languageId] as const,
  searchItem: (name: string, languageId: LanguageId) =>
    [...marketQueryKeys.all, "search", name, languageId] as const,
};

// ============ Categories Hook ============

interface UseMarketCategoriesResult {
  categories: ItemCategory[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Fetch all item categories with TanStack Query caching
 * Categories are static and rarely change - uses long staleTime
 */
export function useMarketCategories(): UseMarketCategoriesResult {
  const { languageId } = useLanguage();

  const query = useQuery({
    queryKey: marketQueryKeys.categories(languageId),
    queryFn: () => marketService.getCategories(languageId),
    // Categories are very static - keep stale for 30 minutes
    staleTime: 30 * 60 * 1000,
    // Keep in cache for 1 hour
    gcTime: 60 * 60 * 1000,
  });

  return {
    categories: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

// ============ Items by Category Hook ============

interface UseMarketItemsResult {
  items: Item[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Fetch items by category with TanStack Query caching
 * Each category's items are cached separately for efficient navigation
 */
export function useMarketItems(
  categoryId: number | null,
): UseMarketItemsResult {
  const { languageId } = useLanguage();

  const query = useQuery({
    queryKey: marketQueryKeys.items(categoryId ?? 0, languageId),
    queryFn: () => marketService.getItemsByCategory(categoryId!, languageId),
    enabled: categoryId !== null,
    // Items change rarely - keep stale for 10 minutes
    staleTime: 10 * 60 * 1000,
    // Keep in cache for 30 minutes
    gcTime: 30 * 60 * 1000,
  });

  return {
    items: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

// ============ Held Item Details Hook ============

interface UseHeldItemDetailsResult {
  wildPokemon: PokemonBasic[];
  itemEffect: string;
  itemData: ItemWithHeldPokemon | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

/**
 * Fetch held item details (description + wild Pokemon)
 * Lazy-loaded when item is selected and category is held items type
 */
export function useHeldItemDetails(
  itemId: number | null,
  enabled: boolean = true,
): UseHeldItemDetailsResult {
  const { languageId } = useLanguage();

  const query = useQuery({
    queryKey: marketQueryKeys.heldItemDetails(itemId ?? 0, languageId),
    queryFn: () => marketService.getHeldItemDetails(itemId!, languageId),
    enabled: itemId !== null && enabled,
    // Item details are static
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  // Transform data for easy consumption
  const wildPokemon = useMemo(() => {
    if (!query.data?.pokemonitems) return [];
    return query.data.pokemonitems.map((pi) => pi.pokemon);
  }, [query.data]);

  const itemEffect = useMemo(() => {
    if (!query.data?.itemeffecttexts?.[0]) return "No description available.";
    return query.data.itemeffecttexts[0].effect;
  }, [query.data]);

  return {
    wildPokemon,
    itemEffect,
    itemData: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

// ============ Search Item Hook ============

interface UseSearchItemResult {
  searchResult: { item: Item; categoryId: number } | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

/**
 * Search item by name - used for URL navigation
 */
export function useSearchItem(
  name: string | null,
  enabled: boolean = true,
): UseSearchItemResult {
  const { languageId } = useLanguage();

  const query = useQuery({
    queryKey: marketQueryKeys.searchItem(name ?? "", languageId),
    queryFn: () => marketService.searchItemByName(name!, languageId),
    enabled: !!name && enabled,
    staleTime: 10 * 60 * 1000,
  });

  return {
    searchResult: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

// ============ Combined Hook ============

interface UsePokeMartQueryResult {
  // Categories
  categories: ItemCategory[];
  categoriesLoading: boolean;
  categoriesError: string | null;
  refetchCategories: () => void;

  // Selected category state
  selectedCategory: number | null;
  setSelectedCategory: (id: number | null) => void;

  // Items
  items: Item[];
  itemsLoading: boolean;
  itemsError: string | null;
  refetchItems: () => void;
}

/**
 * Combined PokeMart hook using TanStack Query
 * Provides categories and items with efficient caching
 */
export function usePokeMartQuery(): UsePokeMartQueryResult {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Fetch categories
  const {
    categories,
    isLoading: categoriesLoading,
    isError: categoriesIsError,
    error: categoriesErrorObj,
    refetch: refetchCategories,
  } = useMarketCategories();

  // Fetch items for selected category
  const {
    items,
    isLoading: itemsLoading,
    isError: itemsIsError,
    error: itemsErrorObj,
    refetch: refetchItems,
  } = useMarketItems(selectedCategory);

  // Auto-select first category when categories load
  useEffect(() => {
    if (categories.length > 0 && selectedCategory === null) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, selectedCategory]);

  return {
    categories,
    categoriesLoading,
    categoriesError: categoriesIsError
      ? (categoriesErrorObj?.message ?? "Failed to fetch categories")
      : null,
    refetchCategories,

    selectedCategory,
    setSelectedCategory,

    items,
    itemsLoading,
    itemsError: itemsIsError
      ? (itemsErrorObj?.message ?? "Failed to fetch items")
      : null,
    refetchItems,
  };
}
