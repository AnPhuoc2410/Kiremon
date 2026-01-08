import { useState, useEffect, createRef } from "react";
import { useNavigate } from "react-router-dom";

import { Header, Navbar, Loading } from "../../../components/ui";
import * as S from "./index.style";
import { regionsService, pokedexService } from "../../../services";
import { getRegionTheme } from "../../../components/utils/regionThemes";

type RegionCardData = {
  id?: number;
  name: string;
  image: string;
  description: string;
  pokemonCount: number;
};

const regionImageMap: Record<string, string> = {
  kanto: "/region/Kanto_Map.png",
  johto: "/region/Johto_Map.png",
  hoenn: "/region/Hoenn_Map.png",
  sinnoh: "/region/Sinnoh_Map.png",
  unova: "/region/Unova_Map.png",
  kalos: "/region/Kalos_Map.png",
  alola: "/region/Alola_Map.png",
  galar: "/region/Galar_Map.png",
  paldea: "/region/Paldea_Map.png",
  hisui: "/region/Hisui_Map.png",
};

const regionDescriptionMap: Record<string, string> = {
  kanto:
    "The first region in the Pokémon world, home to the original 151 Pokémon",
  johto: "The second main region, located west of Kanto",
  hoenn: "A region with diverse environments and many bodies of water",
  sinnoh:
    "Known for its central mountain, Mt. Coronet, which divides the region",
  unova: "A region far away from the others, based on New York City",
  kalos:
    "A star-shaped region inspired by France where Mega Evolution was discovered",
  alola:
    "A tropical island paradise where regional variant Pokémon were first discovered",
  galar:
    "A region inspired by the United Kingdom, known for Dynamax phenomenon",
  paldea: "The most recently discovered region with open-world exploration",
  hisui: "The ancient version of the Sinnoh region from long ago",
};

const RegionsExplore = () => {
  const navigate = useNavigate();
  const navRef = createRef<HTMLDivElement>();
  const [navHeight, setNavHeight] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [regions, setRegions] = useState<RegionCardData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setNavHeight(navRef.current?.clientHeight as number);
  }, [navRef]);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get basic region data via service layer
        const regionsData = await regionsService.getAllRegions();

        // Get detailed info for each region including pokedex info
        const detailedRegionsPromises = regionsData.map(
          async (region: { name: string; url: string }) => {
            const regionDetail = await regionsService.getRegionDetails(
              region.name,
            );
            let pokemonCount = 0;

            // If there are pokedexes associated with this region, get the pokemon count
            const hasPokedexes =
              !!regionDetail &&
              Array.isArray((regionDetail as any).pokedexes) &&
              (regionDetail as any).pokedexes.length > 0;
            if (hasPokedexes) {
              const mainPokedex = (regionDetail as any).pokedexes[0]; // Take the first pokedex
              const pokedexDetail = await pokedexService.getPokedexDetails(
                mainPokedex.name,
              );
              pokemonCount =
                (pokedexDetail as any)?.pokemon_entries?.length || 0;
            }

            // Build the region object with custom image and description
            const data: RegionCardData = {
              id: (regionDetail as any)?.id,
              name: region.name,
              image: regionImageMap[region.name] || "",
              description:
                regionDescriptionMap[region.name] ||
                `The ${region.name} region of the Pokémon world`,
              pokemonCount,
            };
            return data;
          },
        );

        const detailedRegions = await Promise.all(detailedRegionsPromises);
        setRegions(detailedRegions);
      } catch (err) {
        console.error("Error fetching regions:", err);
        setError("Failed to load region data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRegions();
  }, []);

  const handleRegionClick = (regionName: string) => {
    navigate(`/regions/${regionName}`);
  };

  return (
    <>
      <S.RegionContainer style={{ marginBottom: navHeight }}>
        <Header
          title="Explore by Region"
          subtitle="Discover Pokémon from different regions"
        />

        <S.BackButton onClick={() => navigate("/pokemons")}>
          ← Back to Explore
        </S.BackButton>

        {loading ? (
          <S.LoadingWrapper>
            <Loading label="Loading regions data..." />
          </S.LoadingWrapper>
        ) : error ? (
          <S.ErrorWrapper>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
          </S.ErrorWrapper>
        ) : (
          <S.RegionGrid>
            {regions.map((region) => {
              const theme = getRegionTheme(region.name);
              return (
                <S.RegionCard
                  key={region.id || region.name}
                  onClick={() => handleRegionClick(region.name)}
                >
                  <S.RegionImage
                    style={{ backgroundImage: `url(${region.image})` }}
                  />
                  <S.RegionInfo>
                    <S.RegionName>
                      {region.name.charAt(0).toUpperCase() +
                        region.name.slice(1)}
                    </S.RegionName>
                    <S.RegionDescription>
                      {region.description}
                    </S.RegionDescription>
                    <S.PokemonCount bg={theme.overlay} text={theme.primary}>
                      {region.pokemonCount} Pokémon
                    </S.PokemonCount>
                  </S.RegionInfo>
                </S.RegionCard>
              );
            })}
          </S.RegionGrid>
        )}
      </S.RegionContainer>

      <Navbar ref={navRef} />
    </>
  );
};

export default RegionsExplore;
