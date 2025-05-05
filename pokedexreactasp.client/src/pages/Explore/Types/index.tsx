import { useState, useEffect, createRef } from "react";
import { useNavigate } from "react-router-dom";

import { Header, Navbar } from "../../../components/ui";
import * as S from "./index.style";

// Mock data for Pokémon types
const pokemonTypes = [
  { id: 1, name: "Normal", count: 117, color: "#A8A77A" },
  { id: 2, name: "Fire", count: 81, color: "#EE8130" },
  { id: 3, name: "Water", count: 134, color: "#6390F0" },
  { id: 4, name: "Electric", count: 61, color: "#F7D02C" },
  { id: 5, name: "Grass", count: 102, color: "#7AC74C" },
  { id: 6, name: "Ice", count: 47, color: "#96D9D6" },
  { id: 7, name: "Fighting", count: 66, color: "#C22E28" },
  { id: 8, name: "Poison", count: 70, color: "#A33EA1" },
  { id: 9, name: "Ground", count: 68, color: "#E2BF65" },
  { id: 10, name: "Flying", count: 101, color: "#A98FF3" },
  { id: 11, name: "Psychic", count: 96, color: "#F95587" },
  { id: 12, name: "Bug", count: 81, color: "#A6B91A" },
  { id: 13, name: "Rock", count: 65, color: "#B6A136" },
  { id: 14, name: "Ghost", count: 55, color: "#735797" },
  { id: 15, name: "Dragon", count: 60, color: "#6F35FC" },
  { id: 16, name: "Dark", count: 54, color: "#705746" },
  { id: 17, name: "Steel", count: 55, color: "#B7B7CE" },
  { id: 18, name: "Fairy", count: 53, color: "#D685AD" }
];

const TypesExplore = () => {
  const navigate = useNavigate();
  const navRef = createRef<HTMLDivElement>();
  const [navHeight, setNavHeight] = useState<number>(0);

  useEffect(() => {
    setNavHeight(navRef.current?.clientHeight as number);
  }, [navRef]);

  const handleTypeClick = (typeName: string) => {
    // In a real app, you would navigate to a page showing Pokémon of this type
    console.log(`Exploring ${typeName} type Pokémon`);
  };

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

        <S.TypesGrid>
          {pokemonTypes.map((type) => (
            <S.TypeCard
              key={type.id}
              typeColor={type.color}
              onClick={() => handleTypeClick(type.name)}
            >
              <S.TypeName>{type.name}</S.TypeName>
              <S.PokemonCount>{type.count} Pokémon</S.PokemonCount>
            </S.TypeCard>
          ))}
        </S.TypesGrid>
      </S.TypesContainer>

      <Navbar ref={navRef} />
    </>
  );
};

export default TypesExplore;
