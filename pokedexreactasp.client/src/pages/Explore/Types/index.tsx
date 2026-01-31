import { useState, useEffect, createRef } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";

import { Header, Navbar, Loading, PokeCard } from "@/components/ui";
import {
  getAllPokemonTypes,
  getRelatedPokemonByType,
  getDetailPokemon,
} from "@/services/pokemon";
import { colors } from "@/components/utils";
import { useGlobalContext } from "@/contexts";
import { IPokemonType } from "@/types/pokemon";
import * as S from "./index.style";
import { POKEMON_IMAGE } from "@/config/api.config";
import { getPokemonId } from "@/components/utils";

import bugIcon from "@/assets/type-icon/bug.png";
import darkIcon from "@/assets/type-icon/dark.png";
import dragonIcon from "@/assets/type-icon/dragon.png";
import electricIcon from "@/assets/type-icon/electric.png";
import fairyIcon from "@/assets/type-icon/fairy.png";
import fightingIcon from "@/assets/type-icon/fighting.png";
import fireIcon from "@/assets/type-icon/fire.png";
import flyingIcon from "@/assets/type-icon/flying.png";
import ghostIcon from "@/assets/type-icon/ghost.png";
import groundIcon from "@/assets/type-icon/ground.png";
import grassIcon from "@/assets/type-icon/grass.png";
import iceIcon from "@/assets/type-icon/ice.png";
import normalIcon from "@/assets/type-icon/normal.png";
import poisonIcon from "@/assets/type-icon/poison.png";
import psychicIcon from "@/assets/type-icon/psychic.png";
import rockIcon from "@/assets/type-icon/rock.png";
import steelIcon from "@/assets/type-icon/steel.png";
import stellarIcon from "@/assets/type-icon/stellar.png";
import waterIcon from "@/assets/type-icon/water.png";

const typeColors: Record<string, string> = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  stellar: "#A8A8A8",
  fairy: "#D685AD",
};

const typeIcons: Record<string, string> = {
  bug: bugIcon,
  dark: darkIcon,
  dragon: dragonIcon,
  electric: electricIcon,
  fairy: fairyIcon,
  fighting: fightingIcon,
  fire: fireIcon,
  flying: flyingIcon,
  ghost: ghostIcon,
  ground: groundIcon,
  grass: grassIcon,
  ice: iceIcon,
  normal: normalIcon,
  poison: poisonIcon,
  psychic: psychicIcon,
  rock: rockIcon,
  steel: steelIcon,
  stellar: stellarIcon,
  water: waterIcon,
};

const TypesExplore = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const typeParam = searchParams.get("type");

  const navRef = createRef<HTMLDivElement>();
  const { state, setState } = useGlobalContext();

  const [navHeight, setNavHeight] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Track selected type from URL parameter
  const [selectedType, setSelectedType] = useState<string | null>(typeParam);
  const [selectedTypeColor, setSelectedTypeColor] = useState<string>(
    typeParam ? typeColors[typeParam] || colors["gray-300"] : "",
  );
  const [typePokemon, setTypePokemon] = useState<any[]>([]);
  const [isLoadingPokemon, setIsLoadingPokemon] = useState<boolean>(false);

  useEffect(() => {
    setNavHeight(navRef.current?.clientHeight as number);

    const fetchTypes = async () => {
      // Check if we already have the types data in our global state
      if (state.pokemonTypes && state.pokemonTypes.length > 0) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const typesData = await getAllPokemonTypes();

        // Sort types alphabetically
        const sortedTypes = typesData.sort((a, b) =>
          a.name.localeCompare(b.name),
        );

        // Store in global state for future use
        setState({ pokemonTypes: sortedTypes });
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load Pokémon types. Please try again later.");
        setIsLoading(false);
        console.error("Error fetching types:", err);
      }
    };

    fetchTypes();
  }, [navRef, state.pokemonTypes, setState]);

  // Improved effect to properly handle URL parameter changes, including when it becomes null
  useEffect(() => {
    if (typeParam) {
      setSelectedType(typeParam);
      setSelectedTypeColor(typeColors[typeParam] || colors["gray-300"]);
      loadTypePokemons(typeParam);
    } else {
      // This explicitly handles the case when we navigate back and typeParam becomes null
      setSelectedType(null);
      setTypePokemon([]);
    }
  }, [typeParam]);

  const loadTypePokemons = async (typeName: string) => {
    setIsLoadingPokemon(true);

    try {
      const rawList = await getRelatedPokemonByType(typeName);

      // rawList items are typically { name, url } but could be { pokemon: { name, url } }
      const normalized = rawList.map((p: any) => ({
        name: p?.name ?? p?.pokemon?.name,
        url: p?.url ?? p?.pokemon?.url,
      }));

      // Fetch details for each pokemon to obtain types and id
      const detailed = await Promise.all(
        normalized.map(async (p: any) => {
          try {
            const details = await getDetailPokemon(p.name);
            const types = details?.types?.map((t: any) => t.type.name) || [];
            return {
              name: p.name,
              url: p.url,
              id: details?.id || undefined,
              types,
              captured: 0,
            };
          } catch (e) {
            console.error(`Failed to load details for ${p.name}:`, e);
            return { name: p.name, url: p.url, types: [], captured: 0 };
          }
        }),
      );

      setTypePokemon(detailed);
      setIsLoadingPokemon(false);
    } catch (err) {
      console.error(`Error fetching Pokémon of ${typeName} type:`, err);
      setError(
        `Failed to load ${typeName} type Pokémon. Please try again later.`,
      );
      setIsLoadingPokemon(false);
    }
  };

  const handleTypeClick = async (typeName: string) => {
    setSearchParams({ type: typeName });
  };

  const handleBackToTypes = () => {
    setSearchParams({});
    setSelectedType(null);
    setTypePokemon([]);
    setError(null);
  };

  // Use types from the global state
  const types = state.pokemonTypes || [];

  return (
    <>
      <S.PageWrapper
        style={
          selectedType
            ? { backgroundColor: `${selectedTypeColor}20` }
            : undefined
        }
      >
        <S.TypesContainer style={{ marginBottom: navHeight }}>
          <Header
            title="Explore by Type"
            subtitle="Discover different Pokémon types"
          />

          {!selectedType ? (
            <>
              <S.BackButton onClick={() => navigate("/pokemons")}>
                ← Back to Explore
              </S.BackButton>

              {isLoading ? (
                <S.LoadingContainer>
                  <Loading label="Loading Pokémon types..." />
                </S.LoadingContainer>
              ) : error ? (
                <S.ErrorMessage>{error}</S.ErrorMessage>
              ) : (
                <S.TypesGrid>
                  {types.map((type: IPokemonType) => (
                    <S.TypeCard
                      key={type.id}
                      typeColor={typeColors[type.name] || colors["gray-300"]}
                      onClick={() => handleTypeClick(type.name)}
                    >
                      {typeIcons[type.name] && (
                        <S.TypeIcon icon={typeIcons[type.name]} />
                      )}
                      <S.TypeName>
                        {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
                      </S.TypeName>
                      <S.PokemonCount>
                        {type.pokemonCount} Pokémon
                      </S.PokemonCount>
                    </S.TypeCard>
                  ))}
                </S.TypesGrid>
              )}
            </>
          ) : (
            <>
              <S.BackToTypesButton onClick={handleBackToTypes}>
                ← Back to Types
              </S.BackToTypesButton>

              <S.SelectedTypeName
                style={{
                  color: selectedTypeColor,
                  marginBottom: "20px",
                  fontSize: "1.5rem",
                  textShadow: "0px 0px 1px rgba(0, 0, 0, 0.2)",
                }}
              >
                {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}{" "}
                Type Pokémon
              </S.SelectedTypeName>

              {isLoadingPokemon ? (
                <S.LoadingContainer>
                  <Loading label={`Loading ${selectedType} type Pokémon...`} />
                </S.LoadingContainer>
              ) : error ? (
                <S.ErrorMessage>{error}</S.ErrorMessage>
              ) : (
                <S.PokemonGrid>
                  {typePokemon.length > 0 ? (
                    typePokemon.map((pokemon, index) => {
                      // Handle different response shapes: some endpoints return { pokemon: { name, url } }
                      const name =
                        pokemon?.name ?? pokemon?.pokemon?.name ?? "";
                      const url = pokemon?.url ?? pokemon?.pokemon?.url ?? "";
                      const pokemonId = getPokemonId(url) || index;

                      return (
                        <PokeCard
                          key={`${name}-${pokemonId}`}
                          pokemonId={pokemonId}
                          name={name}
                          captured={pokemon?.captured ?? 0}
                          types={
                            pokemon?.types ?? pokemon?.pokemon?.types ?? []
                          }
                          onClick={() => navigate(`/pokemon/${name}`)}
                        />
                      );
                    })
                  ) : (
                    <S.ErrorMessage>
                      No Pokémon found for this type
                    </S.ErrorMessage>
                  )}
                </S.PokemonGrid>
              )}
            </>
          )}
        </S.TypesContainer>
      </S.PageWrapper>

      <Navbar ref={navRef} />
    </>
  );
};

export default TypesExplore;
