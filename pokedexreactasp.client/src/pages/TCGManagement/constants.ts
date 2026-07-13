import { TcgSort } from "@/types/tcg-card-collection.types";

export const PAGE_SIZE = 30;

import { TcgCardRarityTier } from "@/types/pokemon.enums";

export const RARITY_OPTIONS = [
  { value: "", label: "All Rarities" },
  { value: TcgCardRarityTier.Common, label: "Common" },
  { value: TcgCardRarityTier.Uncommon, label: "Uncommon" },
  { value: TcgCardRarityTier.Rare, label: "Rare" },
  { value: TcgCardRarityTier.HoloRare, label: "Holo Rare" },
  { value: TcgCardRarityTier.UltraRare, label: "Ultra Rare" },
  { value: TcgCardRarityTier.SecretRare, label: "Secret Rare" },
  { value: TcgCardRarityTier.Promo, label: "Promo" },
  { value: TcgCardRarityTier.Unknown, label: "Unknown" },
];

export const SORT_OPTIONS: { value: TcgSort; label: string }[] = [
  { value: "obtained-desc", label: "Newest first" },
  { value: "obtained-asc", label: "Oldest first" },
  { value: "rarity-desc", label: "Rarity ▼" },
  { value: "rarity-asc", label: "Rarity ▲" },
];
