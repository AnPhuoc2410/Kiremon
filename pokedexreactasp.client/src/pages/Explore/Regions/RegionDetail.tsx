import { useState, useEffect, createRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header, Navbar } from "../../../components/ui";
import { getRegionDetails, getPokedexDetails } from "../../../services/pokemon";
import { IRegion, IPokedex, INameUrlPair } from "../../../types/pokemon";
import * as S from "./regionDetail.style";

// Map of region names to image URLs (PokeAPI doesn't provide images)
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

// Simple region descriptions
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

const RegionDetail = () => {
  const { regionName } = useParams<{ regionName: string }>();
  const navigate = useNavigate();
  const navRef = createRef<HTMLDivElement>();
  const [navHeight, setNavHeight] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [region, setRegion] = useState<IRegion | null>(null);
  const [pokedexData, setPokedexData] = useState<IPokedex | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setNavHeight(navRef.current?.clientHeight as number);
  }, [navRef]);

  useEffect(() => {
    const fetchRegionData = async () => {
      if (!regionName) return;

      try {
        setLoading(true);
        setError(null);

        // Get detailed region data
        const regionData = await getRegionDetails(regionName);

        if (!regionData) {
          setError(`Could not find details for region: ${regionName}`);
          setLoading(false);
          return;
        }

        // Add custom image and description
        const enhancedRegion = {
          ...regionData,
          image: regionImageMap[regionName] || "",
          description: regionDescriptionMap[regionName] || `The ${regionName} region of the Pokémon world`
        };

        setRegion(enhancedRegion);

        // Get pokedex data if available
        if (regionData.pokedexes && regionData.pokedexes.length > 0) {
          const mainPokedex = regionData.pokedexes[0];
          const pokedexDetails = await getPokedexDetails(mainPokedex.name);
          setPokedexData(pokedexDetails);
        }

      } catch (err) {
        console.error(`Error fetching data for region ${regionName}:`, err);
        setError(`Failed to load details for ${regionName} region. Please try again later.`);
      } finally {
        setLoading(false);
      }
    };

    fetchRegionData();
  }, [regionName]);

  const formatName = (name: string): string => {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <>
      <S.Container style={{ marginBottom: navHeight }}>
        <Header
          title={regionName ? formatName(regionName) + " Region" : "Region Details"}
          subtitle="Explore Pokémon, locations, and more"
        />

        <S.BackButton onClick={() => navigate('/regions')}>
          ← Back to Regions
        </S.BackButton>

        {loading ? (
          <S.LoadingWrapper>
            <p>Loading region data...</p>
          </S.LoadingWrapper>
        ) : error ? (
          <S.ErrorWrapper>
            <p>{error}</p>
            <button onClick={() => navigate('/regions')}>Back to Regions</button>
          </S.ErrorWrapper>
        ) : region ? (
          <S.Content>
            <S.RegionBanner style={{ backgroundImage: `url(${region.image})` }}>
              <S.RegionOverlay>
                <S.RegionTitle>{formatName(region.name)}</S.RegionTitle>
                <S.RegionDescription>{region.description}</S.RegionDescription>
              </S.RegionOverlay>
            </S.RegionBanner>

            <S.InfoContainer>
              <S.SectionTitle>About this Region</S.SectionTitle>

              {region.main_generation && (
                <S.InfoItem>
                  <S.InfoLabel>Generation:</S.InfoLabel>
                  <S.InfoValue>{formatName(region.main_generation.name)}</S.InfoValue>
                </S.InfoItem>
              )}

              {pokedexData && (
                <S.InfoItem>
                  <S.InfoLabel>Regional Pokédex:</S.InfoLabel>
                  <S.InfoValue>
                    {formatName(pokedexData.name)} - {pokedexData.pokemon_entries?.length || 0} Pokémon
                  </S.InfoValue>
                </S.InfoItem>
              )}
            </S.InfoContainer>

            {region.locations && region.locations.length > 0 && (
              <S.Section>
                <S.SectionTitle>Locations</S.SectionTitle>
                <S.LocationGrid>
                  {region.locations.map((location: INameUrlPair, index: number) => (
                    <S.LocationCard key={index}>
                      {formatName(location.name)}
                    </S.LocationCard>
                  ))}
                </S.LocationGrid>
              </S.Section>
            )}

            {pokedexData && pokedexData.pokemon_entries && (
              <S.Section>
                <S.SectionTitle>Featured Pokémon</S.SectionTitle>
                <S.PokemonGrid>
                  {pokedexData.pokemon_entries.slice(0, 10).map((entry, index) => {
                    // Extract Pokémon ID from URL
                    const urlParts = entry.pokemon_species.url.split('/');
                    const id = urlParts[urlParts.length - 2];

                    return (
                      <S.PokemonCard
                        key={index}
                        onClick={() => navigate(`/pokemon/${entry.pokemon_species.name}`)}
                      >
                        <S.PokemonImage
                          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                          alt={entry.pokemon_species.name}
                        />
                        <S.PokemonName>{formatName(entry.pokemon_species.name)}</S.PokemonName>
                        <S.PokemonNumber>#{entry.entry_number}</S.PokemonNumber>
                      </S.PokemonCard>
                    );
                  })}
                </S.PokemonGrid>
                {pokedexData.pokemon_entries.length > 10 && (
                  <S.ShowMoreButton onClick={() => navigate(`/pokemons?region=${region.name}`)}>
                    View All {pokedexData.pokemon_entries.length} Pokémon
                  </S.ShowMoreButton>
                )}
              </S.Section>
            )}
          </S.Content>
        ) : (
          <S.ErrorWrapper>
            <p>No data available for this region</p>
            <button onClick={() => navigate('/regions')}>Back to Regions</button>
          </S.ErrorWrapper>
        )}
      </S.Container>

      <Navbar ref={navRef} />
    </>
  );
};

export default RegionDetail;
