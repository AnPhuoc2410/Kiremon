import { TcgSort } from "@/types/tcg-card-collection.types";

export const PAGE_SIZE = 30;

export const RARITY_OPTIONS = [
  { value: "", label: "All Rarities" },
  { value: "Common", label: "Common" },
  { value: "Uncommon", label: "Uncommon" },
  { value: "Rare", label: "Rare" },
  { value: "HoloRare", label: "Holo Rare" },
  { value: "UltraRare", label: "Ultra Rare" },
  { value: "SecretRare", label: "Secret Rare" },
  { value: "Promo", label: "Promo" },
  { value: "Unknown", label: "Unknown" },
];

export const SORT_OPTIONS: { value: TcgSort; label: string }[] = [
  { value: "obtained-desc", label: "Newest first" },
  { value: "obtained-asc", label: "Oldest first" },
  { value: "rarity-desc", label: "Rarity ▼" },
  { value: "rarity-asc", label: "Rarity ▲" },
];
