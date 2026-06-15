// ============ GraphQL Response Types ============

export interface ItemCategoryName {
  name: string;
}

export interface ItemPocket {
  id: number;
  name: string;
}

export interface ItemCategory {
  id: number;
  name: string;
  itemcategorynames: ItemCategoryName[];
  itempocket?: ItemPocket | null;
}

export interface CategoriesResponse {
  itemcategory: ItemCategory[];
}

// ============ Item Types ============

export interface ItemSprite {
  sprites:
  | {
    default: string;
  }
  | string; // API might return string or object
}

export interface ItemEffectText {
  effect: string;
}

export interface ItemName {
  name: string;
}

export interface PokemonBasic {
  id: number;
  name: string;
}

export interface PokemonItem {
  pokemon: PokemonBasic;
}

export interface Item {
  id: number;
  name: string;
  cost?: number;
  itemnames?: ItemName[];
  itemsprites: ItemSprite[];
  itemeffecttexts?: ItemEffectText[];
}

export interface ItemWithHeldPokemon extends Item {
  pokemonitems?: PokemonItem[];
}

export interface ItemsResponse {
  item: Item[];
}

export interface HeldItemDetailsResponse {
  item: ItemWithHeldPokemon[];
}

// ============ Purchase Types ============

export interface PurchaseItemPayload {
  itemApiId: number;
  quantity?: number;
  name?: string;
  spriteUrl?: string;
  description?: string;
  apiPocketName?: string;
  categoryName?: string;
  isHoldable?: boolean;
  isConsumable?: boolean;
  usableInBattle?: boolean;
}

export interface PurchaseResult {
  success: boolean;
  message: string;
  unitCost: number;
  quantity: number;
  totalCost: number;
  remainingCoins: number;
  item: {
    id: number;
    itemApiId: number;
    name: string;
    spriteUrl: string;
    quantity: number;
    pocketName: string;
    categoryName: string;
  } | null;
}

// ============ Helper Functions ============

/**
 * Parse item sprite URL from the API response
 * The API might return sprites as a string JSON or as an object
 */
export function getItemSpriteUrl(item: Item): string {
  if (!item.itemsprites || item.itemsprites.length === 0) {
    return "";
  }

  const sprite = item.itemsprites[0].sprites;

  // If it's already a string (URL), return it
  if (typeof sprite === "string") {
    try {
      // Try to parse it as JSON in case it's a stringified object
      const parsed = JSON.parse(sprite);
      return parsed.default || "";
    } catch {
      // It's a plain URL string
      return sprite;
    }
  }

  // If it's an object with default property
  if (sprite && typeof sprite === "object" && "default" in sprite) {
    return sprite.default || "";
  }

  return "";
}

/**
 * Get the effect/description text for an item
 */
export function getItemEffect(item: Item): string {
  if (!item.itemeffecttexts || item.itemeffecttexts.length === 0) {
    return "No description available.";
  }

  return item.itemeffecttexts[0].effect || "No description available.";
}

/**
 * Get the display name for a category
 */
export function getCategoryDisplayName(category: ItemCategory): string {
  if (category.itemcategorynames && category.itemcategorynames.length > 0) {
    return category.itemcategorynames[0].name;
  }

  // Fallback: format the name nicely (reuse item name formatting)
  return formatItemName(category.name);
}

/**
 * Format item name for display (replace hyphens with spaces, capitalize)
 */
export function formatItemName(name: string): string {
  return name
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Get localized display name for an item
 */
export function getItemDisplayName(item: Item): string {
  if (item.itemnames && item.itemnames.length > 0) {
    return item.itemnames[0].name;
  }
  return formatItemName(item.name);
}

/**
 * Check if category is a held items category
 */
export function isHeldItemCategory(categoryId: number): boolean {
  // Held items categories
  // 1: Stat Boosts
  // 12: Held Items
  // 17: In A Pinch
  // 18: Type Protection
  // 19: Type Enhancement
  // 42-46: Other held item categories
  const heldItemCategories = [1, 12, 17, 18, 19, 42, 43, 44, 45, 46];
  return heldItemCategories.includes(categoryId);
}

/** Visual metadata for bag category tabs (accent by item pocket). */
export interface InventoryCategoryMeta {
  accent: string;
}

const POCKET_ACCENT_BY_NAME: Record<string, string> = {
  medicine: "#f5a962",
  pokeballs: "#e8d5a3",
  "battle-items": "#6b9bd1",
  berries: "#7bc67e",
  miscellaneous: "#e879a8",
  machines: "#b8c97a",
  items: "#e879a8",
};

const CATEGORY_ACCENT_BY_SLUG: Record<string, string> = {
  healing: "#f5a962",
  "status-cures": "#f5a962",
  "medicine-flutes": "#f5a962",
  revives: "#f5a962",
  "pp-recovery": "#f5a962",
  pokeballs: "#e8d5a3",
  "special-balls": "#e8d5a3",
  "battle-items": "#6b9bd1",
  "stat-boosts": "#6b9bd1",
  flutes: "#6b9bd1",
  berries: "#7bc67e",
  other: "#e879a8",
  collectibles: "#e879a8",
  evolution: "#e879a8",
  spelunking: "#e879a8",
  mulch: "#e879a8",
  "all-machines": "#b8c97a",
  machines: "#b8c97a",
  treasure: "#f5d547",
  loot: "#f5d547",
  "curry-ingredients": "#c4785a",
  "plot-advancement": "#9b7fd4",
  unused: "#94a3b8",
};

const DEFAULT_CATEGORY_ACCENT = "#94a3b8";

export function getInventoryCategoryMeta(
  categorySlug: string,
  pocketName?: string,
): InventoryCategoryMeta {
  const pocketAccent = pocketName
    ? POCKET_ACCENT_BY_NAME[pocketName.toLowerCase()]
    : undefined;

  return {
    accent:
      pocketAccent ??
      CATEGORY_ACCENT_BY_SLUG[categorySlug.toLowerCase()] ??
      DEFAULT_CATEGORY_ACCENT,
  };
}

export function resolveCategoryDisplayName(
  categorySlug: string,
  categories: ItemCategory[],
): string {
  const match = categories.find(
    (c) => c.name.toLowerCase() === categorySlug.toLowerCase(),
  );
  if (match) {
    return getCategoryDisplayName(match);
  }
  return formatItemName(categorySlug);
}
