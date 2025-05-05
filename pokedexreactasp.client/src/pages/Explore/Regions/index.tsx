import { useState, useEffect, createRef } from "react";
import { useNavigate } from "react-router-dom";

import { Header, Navbar } from "../../../components/ui";
import * as S from "./index.style";

// Mock data - In a real app, you would fetch this from an API
const pokemonRegions = [
  {
    id: 1,
    name: "Kanto",
    image: "https://archives.bulbagarden.net/media/upload/4/43/HGSS_Kanto.png",
    description: "The first region in the Pokémon world, home to the original 151 Pokémon",
    pokemonCount: 151
  },
  {
    id: 2,
    name: "Johto",
    image: "https://archives.bulbagarden.net/media/upload/thumb/6/64/JohtoMap.png/300px-JohtoMap.png",
    description: "The second main region, located west of Kanto",
    pokemonCount: 100
  },
  {
    id: 3,
    name: "Hoenn",
    image: "https://archives.bulbagarden.net/media/upload/thumb/8/85/Hoenn_ORAS.png/300px-Hoenn_ORAS.png",
    description: "A region with diverse environments and many bodies of water",
    pokemonCount: 135
  },
  {
    id: 4,
    name: "Sinnoh",
    image: "https://archives.bulbagarden.net/media/upload/thumb/0/08/Sinnoh_BDSP_artwork.png/300px-Sinnoh_BDSP_artwork.png",
    description: "Known for its central mountain, Mt. Coronet, which divides the region",
    pokemonCount: 107
  },
  {
    id: 5,
    name: "Unova",
    image: "https://archives.bulbagarden.net/media/upload/thumb/f/fc/Unova_B2W2_alt.png/300px-Unova_B2W2_alt.png",
    description: "A region far away from the others, based on New York City",
    pokemonCount: 156
  },
  {
    id: 6,
    name: "Kalos",
    image: "https://archives.bulbagarden.net/media/upload/thumb/8/8a/Kalos_alt.png/300px-Kalos_alt.png",
    description: "A star-shaped region inspired by France where Mega Evolution was discovered",
    pokemonCount: 72
  },
  {
    id: 7,
    name: "Alola",
    image: "https://archives.bulbagarden.net/media/upload/thumb/0/0b/Alola_USUM_artwork.png/300px-Alola_USUM_artwork.png",
    description: "A tropical island paradise where regional variant Pokémon were first discovered",
    pokemonCount: 88
  },
  {
    id: 8,
    name: "Galar",
    image: "https://archives.bulbagarden.net/media/upload/thumb/c/ce/Galar_artwork.png/300px-Galar_artwork.png",
    description: "A region inspired by the United Kingdom, known for Dynamax phenomenon",
    pokemonCount: 89
  },
  {
    id: 9,
    name: "Paldea",
    image: "https://archives.bulbagarden.net/media/upload/f/fd/Paldea_artwork.png",
    description: "The most recently discovered region with open-world exploration",
    pokemonCount: 103
  }
];

const RegionsExplore = () => {
  const navigate = useNavigate();
  const navRef = createRef<HTMLDivElement>();
  const [navHeight, setNavHeight] = useState<number>(0);

  useEffect(() => {
    setNavHeight(navRef.current?.clientHeight as number);
  }, [navRef]);

  const handleRegionClick = (regionName: string) => {
    // In a real app, you would navigate to a page showing Pokémon from this region
    console.log(`Exploring Pokémon from the ${regionName} region`);
  };

  return (
    <>
      <S.RegionContainer style={{ marginBottom: navHeight }}>
        <Header
          title="Explore by Region"
          subtitle="Discover Pokémon from different regions"
        />

        <S.BackButton onClick={() => navigate('/pokemons')}>
          ← Back to Explore
        </S.BackButton>

        <S.RegionGrid>
          {pokemonRegions.map((region) => (
            <S.RegionCard key={region.id} onClick={() => handleRegionClick(region.name)}>
              <S.RegionImage style={{ backgroundImage: `url(${region.image})` }} />
              <S.RegionInfo>
                <S.RegionName>{region.name}</S.RegionName>
                <S.RegionDescription>{region.description}</S.RegionDescription>
                <S.PokemonCount>{region.pokemonCount} Pokémon</S.PokemonCount>
              </S.RegionInfo>
            </S.RegionCard>
          ))}
        </S.RegionGrid>
      </S.RegionContainer>

      <Navbar ref={navRef} />
    </>
  );
};

export default RegionsExplore;
