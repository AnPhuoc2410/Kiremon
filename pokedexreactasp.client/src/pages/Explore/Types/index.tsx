import { useState, useEffect, createRef } from "react";
import { useNavigate } from "react-router-dom";

import { Header, Navbar, Loading } from "../../../components/ui";
import { getAllPokemonTypes } from "../../../services/pokemon";
import { colors } from "../../../components/utils";
import { useGlobalContext } from "../../../contexts";
import { IPokemonType } from "../../../types/pokemon";
import * as S from "./index.style";

import bugIcon from "../../../assets/type-icon/bug.png";
import darkIcon from "../../../assets/type-icon/dark.png";
import dragonIcon from "../../../assets/type-icon/dragon.png";
import electricIcon from "../../../assets/type-icon/electric.png";
import fairyIcon from "../../../assets/type-icon/fairy.png";
import fightingIcon from "../../../assets/type-icon/fighting.png";
import fireIcon from "../../../assets/type-icon/fire.png";
import flyingIcon from "../../../assets/type-icon/flying.png";
import ghostIcon from "../../../assets/type-icon/ghost.png";
import groundIcon from "../../../assets/type-icon/ground.png";
import grassIcon from "../../../assets/type-icon/grass.png";
import iceIcon from "../../../assets/type-icon/ice.png";
import normalIcon from "../../../assets/type-icon/normal.png";
import poisonIcon from "../../../assets/type-icon/poison.png";
import psychicIcon from "../../../assets/type-icon/psychic.png";
import rockIcon from "../../../assets/type-icon/rock.png";
import steelIcon from "../../../assets/type-icon/steel.png";
import stellarIcon from "../../../assets/type-icon/stellar.png";
import waterIcon from "../../../assets/type-icon/water.png";

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
  fairy: "#D685AD"
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
  water: waterIcon
};

const TypesExplore = () => {
  const navigate = useNavigate();
  const navRef = createRef<HTMLDivElement>();
  const { state, setState } = useGlobalContext();

  const [navHeight, setNavHeight] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setNavHeight(navRef.current?.clientHeight as number);

    const fetchTypes = async () => {
      // Check if we already have the types data in our global state
      if (state.pokemonTypes && state.pokemonTypes.length > 0) {
        console.log("Using cached types data");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log("Fetching fresh types data from API");
        const typesData = await getAllPokemonTypes();

        // Sort types alphabetically
        const sortedTypes = typesData.sort((a, b) => a.name.localeCompare(b.name));

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

  const handleTypeClick = (typeName: string) => {
    // In a real app, you would navigate to a page showing Pokémon of this type
    console.log(`Exploring ${typeName} type Pokémon`);
  };

  // Use types from the global state
  const types = state.pokemonTypes || [];

  return (
    <>
      <S.TypesContainer style={{ marginBottom: navHeight }}>
        <Header
          title="Explore by Type"
          subtitle="Discover different Pokémon types"
        />

        <S.BackButton onClick={() => navigate('/pokemons')}>
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
                <S.TypeName>{type.name.charAt(0).toUpperCase() + type.name.slice(1)}</S.TypeName>
                <S.PokemonCount>{type.pokemonCount} Pokémon</S.PokemonCount>
              </S.TypeCard>
            ))}
          </S.TypesGrid>
        )}
      </S.TypesContainer>

      <Navbar ref={navRef} />
    </>
  );
};

export default TypesExplore;
