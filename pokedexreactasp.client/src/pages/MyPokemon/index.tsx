import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { IconStar, IconStarFilled } from "@tabler/icons-react";

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
  const [activeConfirmOption, setActiveConfirmOption] = useState<
    "release" | "back"
  >("back");

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

  useEffect(() => {
    if (deleteConfirmation) {
      setActiveConfirmOption("back");
    }
  }, [deleteConfirmation]);

  useEffect(() => {
    if (!deleteConfirmation) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowDown"
      ) {
        e.preventDefault();
        setActiveConfirmOption((prev) =>
          prev === "back" ? "release" : "back",
        );
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (activeConfirmOption === "release") {
          if (selectedPokemon) {
            releasePokemon(selectedPokemon);
          }
        }
        setDeleteConfirmation(false);
      } else if (e.key === "Escape") {
        e.preventDefault();
        setDeleteConfirmation(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [deleteConfirmation, activeConfirmOption, selectedPokemon]);

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
      <Modal open={deleteConfirmation} overlay="dark-translucent">
        <T.DeleteConfirmationModal>
          <T.DialogContainer
            className="pxl-border"
            style={{ textAlign: "center" }}
          >
            <Text
              style={{ color: "#000", fontSize: "14px", lineHeight: "1.5" }}
            >
              ARE YOU SURE YOU WANT TO RELEASE{" "}
              {selectedPokemon?.nickname?.toUpperCase()}?
            </Text>
            <Text
              style={{ color: "#4b5563", fontSize: "11px", lineHeight: "1.5" }}
            >
              YOU'LL HAVE TO CATCH ANOTHER ONE AND CANNOT UNDO THIS ACTION
            </Text>

            <T.DialogButtonGroup>
              <T.RetroActionButton
                isDanger
                isActive={activeConfirmOption === "release"}
                onMouseEnter={() => setActiveConfirmOption("release")}
                onClick={() => {
                  if (selectedPokemon) {
                    releasePokemon(selectedPokemon);
                  }
                  setDeleteConfirmation(false);
                }}
              >
                {activeConfirmOption === "release" && (
                  <T.RetroArrow>▶</T.RetroArrow>
                )}
                RELEASE
              </T.RetroActionButton>
              <T.RetroActionButton
                isActive={activeConfirmOption === "back"}
                onMouseEnter={() => setActiveConfirmOption("back")}
                onClick={() => setDeleteConfirmation(false)}
              >
                {activeConfirmOption === "back" && (
                  <T.RetroArrow>▶</T.RetroArrow>
                )}
                BACK
              </T.RetroActionButton>
            </T.DialogButtonGroup>
          </T.DialogContainer>
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
                            {pokemon.isFavorite ? (
                              <IconStarFilled
                                size={22}
                                color="#f59e0b"
                                aria-hidden="true"
                              />
                            ) : (
                              <IconStar
                                size={22}
                                color="#475569"
                                stroke={2}
                                aria-hidden="true"
                              />
                            )}
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
