import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "@/contexts";
import {
  Button,
  Navbar,
  Text,
  Modal,
  PokeCard,
  DeleteButton,
  Loading,
} from "@/components/ui";
import { collectionService } from "@/services";

import * as T from "./index.style";
import { UserPokemonDto } from "@/types/userspokemon.types";

interface DisplayPokemon {
  id?: number;
  name: string;
  nickname: string;
  sprite?: string;
  isFavorite?: boolean;
  ivRating?: string;
  currentLevel?: number;
  isShiny?: boolean;
  isFromApi?: boolean;
}

const MyPokemon: React.FC = () => {
  const [pokemons, setPokemons] = useState<DisplayPokemon[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deleteConfirmation, setDeleteConfirmation] = useState<boolean>(false);
  const [selectedPokemon, setSelectedPokemon] = useState<DisplayPokemon | null>(
    null,
  );
  const [navHeight, setNavHeight] = useState<number>(0);
  const [filter, setFilter] = useState<"all" | "favorites">("all");

  const { isAuthenticated } = useAuth();
  const navRef = useRef<HTMLDivElement>(null);

  async function loadMyPokemon() {
    setIsLoading(true);

    try {
      if (isAuthenticated) {
        const apiPokemon = await collectionService.getCollection();
        const displayPokemon: DisplayPokemon[] = apiPokemon.map(
          (p: UserPokemonDto) => ({
            id: p.id,
            name: p.name.toUpperCase(),
            nickname: p.displayName,
            sprite: p.spriteUrl || p.officialArtworkUrl || undefined,
            isFavorite: p.isFavorite,
            ivRating: p.ivRating || undefined,
            currentLevel: p.currentLevel,
            isShiny: p.isShiny,
            isFromApi: true,
          }),
        );
        setPokemons(displayPokemon);
      } else {
        setPokemons([]);
      }
    } catch (error) {
      console.error("Error loading Pokemon:", error);
      toast.error("Failed to load collection");
      setPokemons([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setNavHeight(navRef.current?.clientHeight ?? 0);
    loadMyPokemon();
  }, [isAuthenticated]);

  async function releasePokemon(pokemon: DisplayPokemon) {
    try {
      if (!pokemon.isFromApi || !pokemon.id) {
        toast.error("Cannot release this Pokemon");
        return;
      }

      await collectionService.releasePokemon(pokemon.id);
      toast.success(`${pokemon.nickname} was released!`);
      loadMyPokemon();
    } catch (error) {
      console.error("Error releasing Pokemon:", error);
      toast.error("Failed to release Pokemon");
    }
  }

  async function toggleFavorite(pokemon: DisplayPokemon) {
    if (!pokemon.isFromApi || !pokemon.id) {
      toast.error("Log in to use favorites!");
      return;
    }

    try {
      await collectionService.toggleFavorite(pokemon.id);
      setPokemons((prev) =>
        prev.map((p) =>
          p.id === pokemon.id ? { ...p, isFavorite: !p.isFavorite } : p,
        ),
      );
      toast.success(
        pokemon.isFavorite ? "Removed from favorites" : "Added to favorites",
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorite");
    }
  }

  const filteredPokemon =
    filter === "favorites" ? pokemons.filter((p) => p.isFavorite) : pokemons;
  const favoriteCount = pokemons.filter((pokemon) => pokemon.isFavorite).length;

  return (
    <>
      <Modal open={deleteConfirmation} overlay="light">
        <T.DeleteConfirmationModal>
          <div className="pxl-border" style={{ textAlign: "left" }}>
            <Text>
              Are you sure you want to release {selectedPokemon?.nickname}?
            </Text>
            <br />
            <Text>
              You'll have to catch another one and cannot undo this action
            </Text>
          </div>

          <div>
            <Button
              variant="light"
              onClick={() => {
                if (selectedPokemon) {
                  releasePokemon(selectedPokemon);
                }
                setDeleteConfirmation(false);
              }}
            >
              Release
            </Button>
            <Button onClick={() => setDeleteConfirmation(false)}>Back</Button>
          </div>
        </T.DeleteConfirmationModal>
      </Modal>

      <T.Page style={{ marginBottom: navHeight }}>
        <T.Header>
          <T.HeaderCopy>
            <Text as="h1" variant="darker" size="lg">
              My Pokémon
            </Text>
            <Text as="span" variant="darker" size="sm">
              A cleaner collection view for the Pokémon you have actually
              caught.
            </Text>
            <T.StatsRow>
              <T.StatChip>Total: {pokemons.length}</T.StatChip>
              {isAuthenticated && favoriteCount > 0 && (
                <T.StatChip>Favorites: {favoriteCount}</T.StatChip>
              )}
              {isAuthenticated && pokemons.length > 0 && (
                <T.StatChip>Showing: {filteredPokemon.length}</T.StatChip>
              )}
            </T.StatsRow>
          </T.HeaderCopy>

          {isAuthenticated && pokemons.length > 0 && (
            <T.FilterBar aria-label="Collection filters">
              <T.FilterButton
                type="button"
                active={filter === "all"}
                onClick={() => setFilter("all")}
              >
                All
              </T.FilterButton>
              <T.FilterButton
                type="button"
                active={filter === "favorites"}
                onClick={() => setFilter("favorites")}
              >
                Favorites
              </T.FilterButton>
            </T.FilterBar>
          )}
        </T.Header>

        {isLoading ? (
          <div
            style={{ display: "flex", justifyContent: "center", padding: 48 }}
          >
            <Loading />
          </div>
        ) : filteredPokemon.length ? (
          <T.Grid>
            {[...filteredPokemon]
              .reverse()
              .map((pokemon: DisplayPokemon, index) => (
                <T.WrapperCardList key={pokemon.id || pokemon.nickname + index}>
                  <PokeCard
                    name={pokemon.name}
                    nickname={pokemon.nickname}
                    sprite={pokemon.sprite}
                  >
                    <T.CardChrome>
                      <T.CardMeta>
                        {pokemon.isShiny && (
                          <T.Badge tone="gold">Shiny</T.Badge>
                        )}
                        {pokemon.currentLevel && (
                          <T.Badge tone="blue">
                            Lv. {pokemon.currentLevel}
                          </T.Badge>
                        )}
                        {pokemon.ivRating && (
                          <T.Badge
                            tone={
                              pokemon.ivRating === "Perfect"
                                ? "green"
                                : "violet"
                            }
                          >
                            {pokemon.ivRating}
                          </T.Badge>
                        )}
                      </T.CardMeta>

                      <T.CardActions>
                        {pokemon.isFromApi ? (
                          <T.FavoriteButton
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(pokemon);
                            }}
                            style={{
                              position: "relative",
                              top: "auto",
                              right: "auto",
                            }}
                            title={
                              pokemon.isFavorite
                                ? "Remove from favorites"
                                : "Add to favorites"
                            }
                          >
                            {pokemon.isFavorite ? "⭐" : "☆"}
                          </T.FavoriteButton>
                        ) : (
                          <span />
                        )}

                        <DeleteButton
                          style={{
                            position: "relative",
                            top: "auto",
                            right: "auto",
                          }}
                          onClick={() => {
                            setSelectedPokemon(pokemon);
                            setDeleteConfirmation(true);
                          }}
                        />
                      </T.CardActions>
                    </T.CardChrome>
                  </PokeCard>
                </T.WrapperCardList>
              ))}
          </T.Grid>
        ) : (
          <T.EmptyState>
            <T.EmptyPanel>
              <T.EmptyStateInner>
                {filter === "favorites" ? (
                  <>
                    <Text as="h2" variant="darker" size="lg">
                      No favorite Pokémon yet
                    </Text>
                    <Text variant="darker" size="sm">
                      Favorite a few Pokémon to bring them into this view.
                    </Text>
                  </>
                ) : (
                  <>
                    <Text as="h2" variant="darker" size="lg">
                      You have not caught any Pokémon yet
                    </Text>
                    <Text variant="darker" size="sm">
                      Explore the Pokédex, catch your first Pokémon, and come
                      back here to manage the collection.
                    </Text>
                  </>
                )}
              </T.EmptyStateInner>

              <T.EmptyActions>
                {filter === "favorites" ? (
                  <Button onClick={() => setFilter("all")}>Show all</Button>
                ) : (
                  <Link to="/pokemons">
                    <Button>Explore Pokédex</Button>
                  </Link>
                )}
              </T.EmptyActions>
            </T.EmptyPanel>
          </T.EmptyState>
        )}
      </T.Page>

      <Navbar ref={navRef} />
    </>
  );
};

export default MyPokemon;
