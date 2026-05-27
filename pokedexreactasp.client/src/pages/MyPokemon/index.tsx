import React, { createRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "@/contexts";
import { Button, Navbar, Text, Modal, Loading } from "@/components/ui";
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
  const [activeConfirmOption, setActiveConfirmOption] = useState<"release" | "back">("back");

  const { isAuthenticated } = useAuth();
  const navRef = createRef<HTMLDivElement>();

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
    setNavHeight(navRef.current?.clientHeight as number);
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
      if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        setActiveConfirmOption((prev) => (prev === "back" ? "release" : "back"));
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

  const normalizeName = (name: string) => name.replace(/_/g, " ");

  const getStatusText = (pokemon: DisplayPokemon) => {
    if (pokemon.isShiny) return "Shiny";
    if (pokemon.ivRating) return pokemon.ivRating;
    return "Good";
  };

  return (
    <>
      <Modal open={deleteConfirmation} overlay="dark-translucent">
        <T.DeleteConfirmationModal>
          <T.DialogContainer className="pxl-border" style={{ textAlign: "center" }}>
            <Text style={{ color: "#000", fontSize: "14px", lineHeight: "1.5" }}>
              ARE YOU SURE YOU WANT TO RELEASE {selectedPokemon?.nickname?.toUpperCase()}?
            </Text>
            <Text style={{ color: "#4b5563", fontSize: "11px", lineHeight: "1.5" }}>
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
                {activeConfirmOption === "release" && <T.RetroArrow>▶</T.RetroArrow>}
                RELEASE
              </T.RetroActionButton>
              <T.RetroActionButton
                isActive={activeConfirmOption === "back"}
                onMouseEnter={() => setActiveConfirmOption("back")}
                onClick={() => setDeleteConfirmation(false)}
              >
                {activeConfirmOption === "back" && <T.RetroArrow>▶</T.RetroArrow>}
                BACK
              </T.RetroActionButton>
            </T.DialogButtonGroup>
          </T.DialogContainer>
        </T.DeleteConfirmationModal>
      </Modal>

      <T.Page style={{ marginBottom: navHeight }}>
        <T.Header>
          <div>
            <Text as="h1" variant="darker" size="lg" style={{ color: "#000" }}>
              My Pokémon
            </Text>
            <Text as="span" variant="darker" size="sm" style={{ color: "#181818" }}>
              Total: {pokemons.length}
            </Text>
          </div>

          {isAuthenticated && pokemons.length > 0 && (
            <div style={{ display: "flex", gap: 8 }}>
              <Button
                variant={filter === "all" ? "dark" : "light"}
                size="sm"
                onClick={() => setFilter("all")}
              >
                All
              </Button>
              <Button
                variant={filter === "favorites" ? "dark" : "light"}
                size="sm"
                onClick={() => setFilter("favorites")}
              >
                Favorites
              </Button>
            </div>
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
                  <T.SlotCard
                    type="button"
                    onClick={() => {
                      if (pokemon.isFromApi) {
                        toggleFavorite(pokemon);
                      }
                    }}
                    title={
                      pokemon.isFavorite
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                  >
                    <T.SlotTop>
                      <T.BadgeRow>
                        <T.Badge>Lv.{pokemon.currentLevel ?? 1}</T.Badge>
                        <T.StatusBadge>{getStatusText(pokemon)}</T.StatusBadge>
                      </T.BadgeRow>

                      <T.ReleaseButton
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPokemon(pokemon);
                          setDeleteConfirmation(true);
                        }}
                        aria-label={`Release ${normalizeName(pokemon.nickname)}`}
                        title="Release"
                      >
                        X
                      </T.ReleaseButton>
                    </T.SlotTop>

                    <T.SpriteWrap>
                      <T.SpriteImage
                        src={pokemon.sprite || "/substitute.png"}
                        alt={normalizeName(pokemon.name)}
                        loading="lazy"
                      />
                    </T.SpriteWrap>

                    <T.SlotName>
                      {normalizeName(pokemon.nickname || pokemon.name)}
                    </T.SlotName>
                  </T.SlotCard>
                </T.WrapperCardList>
              ))}
          </T.Grid>
        ) : (
          <T.EmptyState>
            {filter === "favorites" ? (
              <>
                <T.EmptyStateText>No favorite Pokémon yet</T.EmptyStateText>
                <T.ShowAllButton type="button" onClick={() => setFilter("all")}>
                  SHOW ALL
                </T.ShowAllButton>
              </>
            ) : (
              <>
                <Text style={{ color: "#000" }}>You haven't caught any Pokémon</Text>
                <Link to="/pokemons">
                  <Button>Explore</Button>
                </Link>
              </>
            )}
          </T.EmptyState>
        )}

        {!isAuthenticated && (
          <div
            style={{
              textAlign: "center",
              padding: 24,
              border: "2px solid #000",
              borderRadius: 0,
              marginTop: 16,
              background: "#F0F8F8",
            }}
          >
            <Text size="lg" style={{ marginBottom: 12, color: "#000" }}>
              Login Required
            </Text>
            <Text size="sm" style={{ color: "#181818" }}>
              You need to log in to view and manage your Pokémon collection.
            </Text>
            <Link
              to="/login"
              style={{ display: "inline-block", marginTop: 12 }}
            >
              <Button variant="sky">Log In</Button>
            </Link>
          </div>
        )}
      </T.Page>

      <Navbar ref={navRef} />
    </>
  );
};

export default MyPokemon;
