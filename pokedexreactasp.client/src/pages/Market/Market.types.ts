// ============ GraphQL Response Types ============

export interface ItemCategoryName {
  name: string;
}

export interface ItemCategory {
  id: number;
  name: string;
  itemcategorynames: ItemCategoryName[];
}

export interface CategoriesResponse {
  itemcategory: ItemCategory[];
}

// ============ Item Types ============

export interface ItemSprite {
  sprites: {
    default: string;
  } | string; // API might return string or object
}

export interface ItemEffectText {
  effect: string;
}

export interface Item {
  id: number;
  name: string;
  cost?: number;
  itemsprites: ItemSprite[];
  itemeffecttexts: ItemEffectText[];
}

export interface ItemsResponse {
  item: Item[];
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
  
  // Fallback: format the name nicely
  return category.name.replace(/-/g, " ");
}

/**
 * Format item name for display (replace hyphens with spaces, capitalize)
 */
export function formatItemName(name: string): string {
  return name
    .replace(/-/g, " ")
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
