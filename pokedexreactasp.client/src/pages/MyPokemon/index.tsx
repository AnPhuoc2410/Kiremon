import React, { useEffect, useRef, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { IconStar, IconStarFilled } from "@tabler/icons-react";

import { useAuth } from "@/contexts";
import { useMyTcgCards } from "@/hooks/queries";
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
  pokemonApiId?: number;
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

  const [cardsModalOpen, setCardsModalOpen] = useState<boolean>(false);
  const [selectedPokemonForCards, setSelectedPokemonForCards] =
    useState<DisplayPokemon | null>(null);

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
            pokemonApiId: p.pokemonApiId,
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
              {isAuthenticated && (
                <Link
                  to="/my-pokemon/pc"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "linear-gradient(135deg, #0ea5e9, #4f46e5)",
                    color: "#fff",
                    padding: "6px 14px",
                    borderRadius: "999px",
                    fontSize: "0.825rem",
                    fontWeight: "bold",
                    textDecoration: "none",
                    boxShadow: "0 4px 12px rgba(14, 165, 233, 0.3)",
                    transition: "all 0.2s ease",
                    marginLeft: "8px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 6px 16px rgba(14, 165, 233, 0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(14, 165, 233, 0.3)";
                  }}
                >
                  🖥️ Switch to PC Storage
                </Link>
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
                    pokemonId={pokemon.pokemonApiId}
                    onClick={() => {
                      setSelectedPokemonForCards(pokemon);
                      setCardsModalOpen(true);
                    }}
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
                          onClick={(e) => {
                            e.stopPropagation();
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

      <Modal open={cardsModalOpen} overlay="dark-translucent">
        <T.CardsModalContainer className="pxl-border">
          <T.ModalHeader>
            <div>
              <Text
                as="h2"
                size="lg"
                style={{
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: "12px",
                  color: "#000000",
                  margin: 0,
                }}
              >
                {selectedPokemonForCards?.nickname?.toUpperCase()}'S CARDS
              </Text>
              <Text size="sm" style={{ color: "#475569", marginTop: "4px" }}>
                API ID: {selectedPokemonForCards?.pokemonApiId}
              </Text>
            </div>
            <T.CloseButton
              onClick={() => {
                setCardsModalOpen(false);
                setSelectedPokemonForCards(null);
              }}
            >
              X
            </T.CloseButton>
          </T.ModalHeader>
          <MyPokemonCardsView
            pokemonApiId={selectedPokemonForCards?.pokemonApiId}
          />
        </T.CardsModalContainer>
      </Modal>

      <Navbar ref={navRef} />
    </>
  );
};

const MyPokemonCardsView: React.FC<{ pokemonApiId?: number }> = ({
  pokemonApiId,
}) => {
  const query = useMemo(
    () => ({
      page: 1,
      pageSize: 50,
      pokemonApiId: pokemonApiId,
      sort: "obtained-desc" as const,
    }),
    [pokemonApiId],
  );

  const myCardsQuery = useMyTcgCards(query, !!pokemonApiId);

  if (myCardsQuery.isLoading) {
    return <Loading label="Loading cards..." />;
  }

  if (myCardsQuery.isError) {
    return <Text>Failed to load card collection.</Text>;
  }

  const cards = myCardsQuery.data?.items ?? [];

  if (cards.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "32px 0" }}>
        <Text
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: "11px",
            lineHeight: "1.8",
            color: "#475569",
          }}
        >
          NO CARDS COLLECTED YET FOR THIS POKÉMON!
        </Text>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        gap: "16px",
        padding: "8px 0",
        maxHeight: "55vh",
        overflowY: "auto",
      }}
    >
      {cards.map((card) => (
        <div
          key={card.userCardId}
          className="pxl-border"
          style={{
            padding: "12px",
            background: "#ffffff",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            alignItems: "stretch",
          }}
        >
          <img
            src={card.imageSmall || card.imageLarge || "/substitute.png"}
            alt={card.name}
            style={{
              width: "100%",
              height: "230px",
              objectFit: "contain",
              background: "#1e293b",
              borderRadius: "4px",
              border: "2px solid #000000",
            }}
            loading="lazy"
          />
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <Text
              style={{ fontWeight: "bold", fontSize: "14px", color: "#000" }}
            >
              {card.name.toUpperCase()}
            </Text>
            <Text style={{ fontSize: "11px", color: "#475569" }}>
              {card.rarityTier.toUpperCase()}
            </Text>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#bae6fd",
                border: "2px solid #000000",
                padding: "4px 8px",
                marginTop: "4px",
              }}
            >
              <Text
                style={{
                  fontSize: "10px",
                  fontWeight: "bold",
                  fontFamily: '"Press Start 2P", monospace',
                  color: "#000000",
                }}
              >
                QTY: {card.quantity}
              </Text>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyPokemon;
