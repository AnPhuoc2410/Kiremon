import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  DialogBox,
  DialogOverlay,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogPlaceholder,
  CloseButton,
  WildPokemonSection,
  WildPokemonTitle,
  WildPokemonList,
  WildPokemonItem,
  BuySection,
  QuantityInput,
  BuyButton,
} from "../Market.styles";
import {
  Item,
  PokemonBasic,
  getItemDisplayName,
  getItemSpriteUrl,
} from "@/types/market.types";
import { useHeldItemDetails, useBuyItem } from "@/hooks/queries";
import { useAuth, useLanguage } from "@/contexts";
import { t } from "@/utils/uiI18n";

interface ItemDescriptionBoxProps {
  item: Item | null;
  categoryId?: number | null;
  categoryName?: string;
  onClose?: () => void;
}

const getPokemonSprite = (pokemonId: number): string => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
};

export const ItemDescriptionBox: React.FC<ItemDescriptionBoxProps> = ({
  item,
  categoryId,
  categoryName,
  onClose,
}) => {
  const { languageId } = useLanguage();
  const { isAuthenticated } = useAuth();
  const buyItem = useBuyItem();
  const [quantity, setQuantity] = useState(1);
  const {
    wildPokemon,
    itemEffect,
    isLoading: wildPokemonLoading,
  } = useHeldItemDetails(item?.id ?? null, !!item);

  const handleBuy = async () => {
    if (!item) return;

    if (!isAuthenticated) {
      toast.error(t("market.loginToBuy", languageId));
      return;
    }

    try {
      const result = await buyItem.mutateAsync({
        itemApiId: item.id,
        quantity,
        name: item.name,
        spriteUrl: getItemSpriteUrl(item),
        description: itemEffect !== "No description available." ? itemEffect : undefined,
        categoryName: categoryName || undefined,
      });

      toast.success(
        `${result.message} (₽${result.remainingCoins.toLocaleString()} ${t(
          "market.remaining",
          languageId,
        )})`,
      );
    } catch (error: unknown) {
      // Business failures (not enough coins, not for sale...) come back as 4xx
      // with a PurchaseResult body carrying the server message.
      const serverMessage = (
        error as { response?: { data?: { message?: string } } }
      )?.response?.data?.message;
      toast.error(serverMessage || t("market.buyFailed", languageId));
    }
  };

  if (!item) {
    return (
      <DialogBox $visible={false} id="tour-market-description">
        <DialogContent>
          <DialogPlaceholder>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>{t("market.clickItem", languageId)}</div>
          </DialogPlaceholder>
        </DialogContent>
      </DialogBox>
    );
  }

  const displayName = getItemDisplayName(item);

  return (
    <>
      <DialogOverlay $visible={!!item} onClick={onClose} />
      <DialogBox $visible={!!item} id="tour-market-description">
        <DialogHeader>
          <DialogTitle>{displayName}</DialogTitle>
          <CloseButton onClick={onClose} aria-label="Close">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </CloseButton>
        </DialogHeader>
        <DialogContent>
          {wildPokemonLoading ? (
            <DialogPlaceholder>
              <div style={{ fontSize: "14px", color: "#6b7280" }}>
                {t("common.loadingDetails", languageId)}
              </div>
            </DialogPlaceholder>
          ) : (
            <>
              <DialogDescription>
                {itemEffect || t("market.noDescription", languageId)}
              </DialogDescription>
              {item.cost !== undefined && item.cost > 0 && (
                <>
                  <DialogDescription
                    style={{
                      marginTop: "16px",
                      color: "#B45309",
                      fontWeight: "600",
                      fontSize: "16px",
                    }}
                  >
                    {t("market.price", languageId)}: ₽
                    {item.cost.toLocaleString()}
                  </DialogDescription>

                  <BuySection>
                    <QuantityInput
                      type="number"
                      min={1}
                      max={999}
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(
                          Math.max(
                            1,
                            Math.min(999, Number(e.target.value) || 1),
                          ),
                        )
                      }
                    />
                    <BuyButton
                      onClick={handleBuy}
                      disabled={buyItem.isPending}
                    >
                      {buyItem.isPending
                        ? t("market.buying", languageId)
                        : `${t("market.buy", languageId)} · ₽${(
                          item.cost * quantity
                        ).toLocaleString()}`}
                    </BuyButton>
                  </BuySection>
                </>
              )}

              {/* Wild Pokemon Section - Only show when data is loaded */}
              {wildPokemon.length > 0 && (
                <WildPokemonSection>
                  <WildPokemonTitle>
                    {t("market.wildPokemon", languageId)} ({wildPokemon.length})
                  </WildPokemonTitle>

                  <WildPokemonList $isExpanded={true}>
                    {wildPokemon.map((pokemon: PokemonBasic) => (
                      <WildPokemonItem
                        key={pokemon.id}
                        href={`/pokemon/${pokemon.name}`}
                        title={`View ${pokemon.name}`}
                      >
                        <img
                          src={getPokemonSprite(pokemon.id)}
                          alt={pokemon.name}
                          loading="lazy"
                        />
                        <span>{pokemon.name.replace(/-/g, " ")}</span>
                      </WildPokemonItem>
                    ))}
                  </WildPokemonList>
                </WildPokemonSection>
              )}
            </>
          )}
        </DialogContent>
      </DialogBox>
    </>
  );
};

export default ItemDescriptionBox;
