import { useState, useEffect, createRef } from "react";
import { useNavigate } from "react-router-dom";

import { Header, Navbar, Loading } from "../../../components/ui";
import * as S from "./index.style";
import { getAllRegions, getRegionDetails, getPokedexDetails } from "../../../services/pokemon";
import { IRegion, IPokedex } from "../../../types/pokemon";

const regionImageMap: Record<string, string> = {
  "kanto": "https://archives.bulbagarden.net/media/upload/4/43/HGSS_Kanto.png",
  "johto": "https://archives.bulbagarden.net/media/upload/thumb/6/64/JohtoMap.png/300px-JohtoMap.png",
  "hoenn": "https://archives.bulbagarden.net/media/upload/thumb/8/85/Hoenn_ORAS.png/300px-Hoenn_ORAS.png",
  "sinnoh": "https://archives.bulbagarden.net/media/upload/thumb/0/08/Sinnoh_BDSP_artwork.png/300px-Sinnoh_BDSP_artwork.png",
  "unova": "https://archives.bulbagarden.net/media/upload/thumb/f/fc/Unova_B2W2_alt.png/300px-Unova_B2W2_alt.png",
  "kalos": "https://archives.bulbagarden.net/media/upload/thumb/8/8a/Kalos_alt.png/300px-Kalos_alt.png",
  "alola": "https://archives.bulbagarden.net/media/upload/thumb/0/0b/Alola_USUM_artwork.png/300px-Alola_USUM_artwork.png",
  "galar": "https://archives.bulbagarden.net/media/upload/thumb/c/ce/Galar_artwork.png/300px-Galar_artwork.png",
  "paldea": "https://archives.bulbagarden.net/media/upload/f/fd/Paldea_artwork.png",
  "hisui": "https://oyster.ignimgs.com/mediawiki/apis.ign.com/pokemon-legends/d/df/Home_features_2.jpeg"
};

const regionDescriptionMap: Record<string, string> = {
  "kanto": "The first region in the Pokémon world, home to the original 151 Pokémon",
  "johto": "The second main region, located west of Kanto",
  "hoenn": "A region with diverse environments and many bodies of water",
  "sinnoh": "Known for its central mountain, Mt. Coronet, which divides the region",
  "unova": "A region far away from the others, based on New York City",
  "kalos": "A star-shaped region inspired by France where Mega Evolution was discovered",
  "alola": "A tropical island paradise where regional variant Pokémon were first discovered",
  "galar": "A region inspired by the United Kingdom, known for Dynamax phenomenon",
  "paldea": "The most recently discovered region with open-world exploration",
  "hisui": "The ancient version of the Sinnoh region from long ago"
};

const RegionsExplore = () => {
  const navigate = useNavigate();
  const navRef = createRef<HTMLDivElement>();
  const [navHeight, setNavHeight] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [regions, setRegions] = useState<IRegion[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setNavHeight(navRef.current?.clientHeight as number);
  }, [navRef]);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get basic region data
        const regionsData = await getAllRegions();

        // Get detailed info for each region including pokedex info
        const detailedRegionsPromises = regionsData.map(async (region: { name: string, url: string }) => {
          const regionDetail = await getRegionDetails(region.name);
          let pokemonCount = 0;

          // If there are pokedexes associated with this region, get the pokemon count
          if (regionDetail?.pokedexes?.length > 0) {
            const mainPokedex = regionDetail.pokedexes[0]; // Take the first pokedex
            const pokedexDetail = await getPokedexDetails(mainPokedex.name);
            pokemonCount = pokedexDetail?.pokemon_entries?.length || 0;
          }

          // Build the region object with custom image and description
          return {
            ...regionDetail,
            name: region.name,
            image: regionImageMap[region.name] || "", // Use our image map
            description: regionDescriptionMap[region.name] || `The ${region.name} region of the Pokémon world`,
            pokemonCount
          };
        });

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
    // Navigate to region detail page - this would be implemented later
    console.log(`Exploring Pokémon from the ${regionName} region`);
    navigate(`/regions/${regionName}`);
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
            {regions.map((region) => (
              <S.RegionCard key={region.id} onClick={() => handleRegionClick(region.name)}>
                <S.RegionImage style={{ backgroundImage: `url(${region.image})` }} />
                <S.RegionInfo>
                  <S.RegionName>{region.name.charAt(0).toUpperCase() + region.name.slice(1)}</S.RegionName>
                  <S.RegionDescription>{region.description}</S.RegionDescription>
                  <S.PokemonCount>{region.pokemonCount} Pokémon</S.PokemonCount>
                </S.RegionInfo>
              </S.RegionCard>
            ))}
          </S.RegionGrid>
        )}
      </S.RegionContainer>

      <Navbar ref={navRef} />
    </>
  );
};

export default RegionsExplore;
