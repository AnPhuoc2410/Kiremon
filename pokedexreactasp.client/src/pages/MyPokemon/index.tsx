import React, { createRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { useGlobalContext, useAuth } from "../../contexts";
import { generatePokeSummary } from "../../helpers";
import {
  Button,
  Navbar,
  Text,
  Modal,
  PokeCard,
  DeleteButton,
  Loading,
} from "../../components/ui";
import { collectionService } from "../../services";

import * as T from "./index.style";
import { UserPokemonDto } from "../../types/userspokemon.types";

// Extended Pokemon type for API data
interface DisplayPokemon {
  id?: number; // UserPokemon ID from backend
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

  const { setState } = useGlobalContext();
  const { isAuthenticated } = useAuth();
  const navRef = createRef<HTMLDivElement>();

  async function loadMyPokemon() {
    setIsLoading(true);

    try {
      if (isAuthenticated) {
        // Load from API
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
        // Require authentication - no localStorage fallback
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

  async function releasePokemon(pokemon: DisplayPokemon) {
    try {
      if (!pokemon.isFromApi || !pokemon.id) {
        toast.error("Cannot release this Pokemon");
        return;
      }

      await collectionService.releasePokemon(pokemon.id);
      toast.success(`${pokemon.nickname} was released!`);

      // Reload collection from API
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
          <div>
            <Text as="h1" variant="darker" size="lg">
              My Pokémon
            </Text>
            <Text as="span" variant="darker" size="sm">
              Total: {pokemons.length}
              {isAuthenticated &&
                pokemons.filter((p) => p.isFavorite).length > 0 && (
                  <>
                    {" "}
                    • Favorites: {pokemons.filter((p) => p.isFavorite).length}
                  </>
                )}
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
                ⭐ Favorites
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
                  <PokeCard
                    name={pokemon.name}
                    nickname={pokemon.nickname}
                    sprite={pokemon.sprite}
                  >
                    {/* Extra info badges */}
                    <div
                      style={{
                        display: "flex",
                        gap: 4,
                        position: "absolute",
                        top: 4,
                        left: 4,
                        flexWrap: "wrap",
                      }}
                    >
                      {pokemon.isShiny && (
                        <span
                          style={{
                            fontSize: 10,
                            padding: "2px 6px",
                            background: "#FBBF24",
                            borderRadius: 4,
                            color: "#000",
                          }}
                        >
                          ✨ Shiny
                        </span>
                      )}
                      {pokemon.currentLevel && (
                        <span
                          style={{
                            fontSize: 10,
                            padding: "2px 6px",
                            background: "#60A5FA",
                            borderRadius: 4,
                            color: "#fff",
                          }}
                        >
                          Lv.{pokemon.currentLevel}
                        </span>
                      )}
                      {pokemon.ivRating && (
                        <span
                          style={{
                            fontSize: 10,
                            padding: "2px 6px",
                            background:
                              pokemon.ivRating === "Perfect"
                                ? "#34D399"
                                : "#818CF8",
                            borderRadius: 4,
                            color: "#fff",
                          }}
                        >
                          {pokemon.ivRating}
                        </span>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: "flex", gap: 4 }}>
                      {pokemon.isFromApi && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(pokemon);
                          }}
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            fontSize: 20,
                            padding: 4,
                          }}
                          title={
                            pokemon.isFavorite
                              ? "Remove from favorites"
                              : "Add to favorites"
                          }
                        >
                          {pokemon.isFavorite ? "⭐" : "☆"}
                        </button>
                      )}
                      <DeleteButton
                        onClick={() => {
                          setSelectedPokemon(pokemon);
                          setDeleteConfirmation(true);
                        }}
                      />
                    </div>
                  </PokeCard>
                </T.WrapperCardList>
              ))}
          </T.Grid>
        ) : (
          <T.EmptyState>
            {filter === "favorites" ? (
              <>
                <Text>No favorite Pokémon yet</Text>
                <Button onClick={() => setFilter("all")}>Show All</Button>
              </>
            ) : (
              <>
                <Text>You haven't caught any Pokémon</Text>
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
              background: "rgba(96, 165, 250, 0.1)",
              borderRadius: 8,
              marginTop: 16,
            }}
          >
            <Text size="lg" style={{ marginBottom: 12 }}>
              🔒 Login Required
            </Text>
            <Text size="sm">
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
