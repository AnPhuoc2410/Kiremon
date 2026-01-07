import React, { useEffect } from "react";
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
  WildPokemonLoading,
  WildPokemonEmpty,
} from "../Market.styles";
import {
  Item,
  PokemonBasic,
  getItemDisplayName,
} from "../Market.types";
import { useHeldItemDetails } from "../useMarket";

interface ItemDescriptionBoxProps {
  item: Item | null;
  categoryId?: number | null;
  onClose?: () => void;
}

const getPokemonSprite = (pokemonId: number): string => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
};

export const ItemDescriptionBox: React.FC<ItemDescriptionBoxProps> = ({ item, categoryId, onClose }) => {
  const { 
    wildPokemon,
    itemEffect, 
    loading: wildPokemonLoading, 
    fetchHeldItemDetails, 
    clearHeldItemDetails 
  } = useHeldItemDetails();

  // Always fetch held item details when item changes to check if it has wild Pokemon
  useEffect(() => {
    if (item) {
      fetchHeldItemDetails(item.id);
    } else {
      clearHeldItemDetails();
    }
  }, [item, fetchHeldItemDetails, clearHeldItemDetails]);

  if (!item) {
    return (
      <DialogBox $visible={false}>
        <DialogContent>
          <DialogPlaceholder>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>Click an item to see details</div>
          </DialogPlaceholder>
        </DialogContent>
      </DialogBox>
    );
  }

  const displayName = getItemDisplayName(item);

  return (
    <>
      <DialogOverlay $visible={!!item} onClick={onClose} />
      <DialogBox $visible={!!item}>
        <DialogHeader>
          <DialogTitle>{displayName}</DialogTitle>
          <CloseButton onClick={onClose} aria-label="Close">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </CloseButton>
        </DialogHeader>
        <DialogContent>
          {wildPokemonLoading ? (
            <DialogPlaceholder>
              <div style={{ fontSize: "14px", color: "#6b7280" }}>Loading details...</div>
            </DialogPlaceholder>
          ) : (
            <>
              <DialogDescription>
                {itemEffect || "No description available."}
              </DialogDescription>
              {item.cost !== undefined && item.cost > 0 && (
                <DialogDescription style={{ marginTop: "16px", color: "#B45309", fontWeight: "600", fontSize: "16px" }}>
                  Price: ₽{item.cost.toLocaleString()}
                </DialogDescription>
              )}
              
              {/* Wild Pokemon Section - Only show when data is loaded */}
              {wildPokemon.length > 0 && (
                <WildPokemonSection>
                  <WildPokemonTitle>
                    Wild Pokémon ({wildPokemon.length})
                  </WildPokemonTitle>
                  
                  <WildPokemonList $isExpanded={true}>
                    {wildPokemon.map((pokemon: PokemonBasic) => (
                      <WildPokemonItem 
                        key={pokemon.id} 
                        href={`/pokemon/${pokemon.id}`}
                        title={`View ${pokemon.name}`}
                      >
                        <img 
                          src={getPokemonSprite(pokemon.id)} 
                          alt={pokemon.name}
                          loading="lazy"
                        />
                        <span>{pokemon.name.replace(/-/g, ' ')}</span>
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
