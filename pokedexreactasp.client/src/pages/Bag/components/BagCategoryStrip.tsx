import React from "react";

import {
  getCategoryDisplayName,
  getInventoryCategoryMeta,
  ItemCategory,
} from "@/types/market.types";

import * as S from "../index.style";

interface BagCategoryStripProps {
  categories: ItemCategory[];
  selectedCategoryId: number | null;
  ownedCountByCategory: Map<string, number>;
  onSelectCategory: (id: number) => void;
}

export const BagCategoryStrip: React.FC<BagCategoryStripProps> = ({
  categories,
  selectedCategoryId,
  ownedCountByCategory,
  onSelectCategory,
}) => {
  return (
    <S.CategoryStrip>
      {categories.map((category) => {
        const ownedCount =
          ownedCountByCategory.get(category.name.toLowerCase()) ?? 0;
        const label = getCategoryDisplayName(category);
        const meta = getInventoryCategoryMeta(
          category.name,
          category.itempocket?.name,
        );
        const isActive = selectedCategoryId === category.id;

        return (
          <S.CategoryStripTab
            key={category.id}
            type="button"
            $active={isActive}
            $accent={meta.accent}
            onClick={() => onSelectCategory(category.id)}
            aria-pressed={isActive}
          >
            <span className="label">{label}</span>
            {ownedCount > 0 ? (
              <span className="count">({ownedCount})</span>
            ) : null}
          </S.CategoryStripTab>
        );
      })}
    </S.CategoryStrip>
  );
};

export default BagCategoryStrip;
