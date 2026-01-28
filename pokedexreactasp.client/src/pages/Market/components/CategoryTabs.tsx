import React from "react";
import {
  CategorySidebar,
  CategoryTabsContainer,
  CategoryTab,
  SidebarTitle,
  LoadingContainer,
  LoadingSpinner,
  LoadingText,
  ErrorContainer,
  ErrorText,
  RetryButton,
} from "../Market.styles";
import {
  ItemCategory,
  getCategoryDisplayName,
} from "../../../types/market.types";
import { useLanguage } from "../../../contexts";
import { t } from "../../../utils/uiI18n";

interface CategoryTabsProps {
  categories: ItemCategory[];
  loading: boolean;
  error: string | null;
  selectedCategory: number | null;
  onSelectCategory: (id: number) => void;
  onRetry: () => void;
  isOpen?: boolean;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  loading,
  error,
  selectedCategory,
  onSelectCategory,
  onRetry,
  isOpen = false,
}) => {
  const { languageId } = useLanguage();

  if (loading) {
    return (
      <CategorySidebar $isOpen={isOpen}>
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>{t("common.loading", languageId)}</LoadingText>
        </LoadingContainer>
      </CategorySidebar>
    );
  }

  if (error) {
    return (
      <CategorySidebar $isOpen={isOpen}>
        <ErrorContainer>
          <ErrorText>⚠️ {error}</ErrorText>
          <RetryButton onClick={onRetry}>
            {t("common.retry", languageId)}
          </RetryButton>
        </ErrorContainer>
      </CategorySidebar>
    );
  }

  return (
    <CategorySidebar $isOpen={isOpen}>
      <SidebarTitle>{t("market.categories", languageId)}</SidebarTitle>
      <CategoryTabsContainer>
        {categories.map((category) => (
          <CategoryTab
            key={category.id}
            $active={selectedCategory === category.id}
            onClick={() => onSelectCategory(category.id)}
            title={getCategoryDisplayName(category)}
          >
            {getCategoryDisplayName(category)}
          </CategoryTab>
        ))}
      </CategoryTabsContainer>
    </CategorySidebar>
  );
};

export default CategoryTabs;
