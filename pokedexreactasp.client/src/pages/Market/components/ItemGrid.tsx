import React from "react";
import {
  ItemsSection,
  ItemsGrid,
  ItemCard,
  ItemSprite,
  ItemName,
  ItemPrice,
  LoadingContainer,
  LoadingSpinner,
  LoadingText,
  ErrorContainer,
  ErrorText,
  RetryButton,
  EmptyState,
} from "../Market.styles";
import {
  Item,
  getItemSpriteUrl,
  getItemDisplayName,
} from "../../../types/market.types";
import { useLanguage } from "../../../contexts";
import { t } from "../../../utils/uiI18n";

interface ItemGridProps {
  items: Item[];
  loading: boolean;
  error: string | null;
  selectedItemId: number | null;
  onSelectItem?: (item: Item) => void;
  onRetry: () => void;
}

export const ItemGrid: React.FC<ItemGridProps> = ({
  items,
  loading,
  error,
  selectedItemId,
  onSelectItem,
  onRetry,
}) => {
  const { languageId } = useLanguage();

  if (loading) {
    return (
      <ItemsSection>
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>{t("common.loadingItems", languageId)}</LoadingText>
        </LoadingContainer>
      </ItemsSection>
    );
  }

  if (error) {
    return (
      <ItemsSection>
        <ErrorContainer>
          <ErrorText>⚠️ {error}</ErrorText>
          <RetryButton onClick={onRetry}>
            {t("common.retry", languageId)}
          </RetryButton>
        </ErrorContainer>
      </ItemsSection>
    );
  }

  if (items.length === 0) {
    return (
      <ItemsSection>
        <EmptyState>
          <span>📦</span>
          <span>{t("market.noItems", languageId)}</span>
          <span>{t("market.selectCategory", languageId)}</span>
        </EmptyState>
      </ItemsSection>
    );
  }

  return (
    <ItemsSection>
      <ItemsGrid>
        {items.map((item) => {
          const spriteUrl = getItemSpriteUrl(item);
          const displayName = getItemDisplayName(item);

          return (
            <ItemCard
              key={item.id}
              $selected={selectedItemId === item.id}
              onClick={() => onSelectItem?.(item)}
              tabIndex={0}
              role="button"
              aria-label={`${displayName} - ${item.cost || 0} Pokédollars`}
            >
              <ItemSprite>
                {spriteUrl ? (
                  <img
                    src={spriteUrl}
                    alt={item.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <span style={{ fontSize: "32px" }}>📦</span>
                )}
              </ItemSprite>
              <ItemName>{displayName}</ItemName>
              {item.cost !== undefined && item.cost > 0 && (
                <ItemPrice>{item.cost.toLocaleString()}</ItemPrice>
              )}
            </ItemCard>
          );
        })}
      </ItemsGrid>
    </ItemsSection>
  );
};

export default ItemGrid;
