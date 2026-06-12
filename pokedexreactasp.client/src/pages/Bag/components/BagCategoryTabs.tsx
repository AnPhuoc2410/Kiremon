import React from "react";

import {
  CategorySidebar,
  CategoryTab,
  CategoryTabsContainer,
  SidebarTitle,
} from "@/pages/Market/Market.styles";
import { getCategoryDisplayName, ItemCategory } from "@/types/market.types";

interface BagCategoryTabsProps {
  categories: ItemCategory[];
  selectedCategoryId: number | null;
  ownedCountByCategory: Map<string, number>;
  onSelectCategory: (id: number) => void;
  isOpen?: boolean;
}

export const BagCategoryTabs: React.FC<BagCategoryTabsProps> = ({
  categories,
  selectedCategoryId,
  ownedCountByCategory,
  onSelectCategory,
  isOpen = false,
}) => {
  return (
    <CategorySidebar $isOpen={isOpen}>
      <SidebarTitle>Categories</SidebarTitle>
      <CategoryTabsContainer>
        {categories.map((category) => {
          const ownedCount =
            ownedCountByCategory.get(category.name.toLowerCase()) ?? 0;
          const label = getCategoryDisplayName(category);

          return (
            <CategoryTab
              key={category.id}
              $active={selectedCategoryId === category.id}
              onClick={() => onSelectCategory(category.id)}
              title={label}
            >
              {label}
              {ownedCount > 0 ? ` (${ownedCount})` : ""}
            </CategoryTab>
          );
        })}
      </CategoryTabsContainer>
    </CategorySidebar>
  );
};

export default BagCategoryTabs;
