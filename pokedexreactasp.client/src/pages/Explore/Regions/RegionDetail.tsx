import { useState, useEffect, createRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header, Navbar, PokeCard } from "../../../components/ui";
import { getRegionDetails, getPokedexDetails } from "../../../services/pokemon";
import { IRegion, IPokedex, INameUrlPair } from "../../../types/pokemon";
import * as S from "./regionDetail.style";
import { getPokemonId } from "../../../components/utils";

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
  const [pokemonEntries, setPokemonEntries] = useState<any[]>([]);
  const [showAllPokemon, setShowAllPokemon] = useState<boolean>(false);
  const [pokemonPage, setPokemonPage] = useState<number>(1);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const pokemonPerPage = 20;

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

          // Load initial batch of Pokemon data
          if (pokedexDetails?.pokemon_entries) {
            loadPokemonData(pokedexDetails.pokemon_entries.slice(0, 12));
          }
        }

      } catch (err) {
        console.error(`Error fetching data for region ${regionName}:`, err);
        setError(`Failed to load details for ${regionName} region. Please try again later.`);
      } finally {
        setLoading(false);
      }
    };

    fetchRegionData();
    // Reset state when region changes
    setShowAllPokemon(false);
    setPokemonPage(1);
    setPokemonEntries([]);
  }, [regionName]);

  // Function to load Pokemon data with types and details
  const loadPokemonData = async (entries: any[]) => {
    try {
      const detailedPokemon = await Promise.all(
        entries.map(async (entry) => {
          try {
            const name = entry.pokemon_species.name;
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);

            if (!response.ok) {
              throw new Error(`Failed to fetch details for ${name}`);
            }

            const data = await response.json();
            const types = data.types.map((t: any) => t.type.name);

            return {
              id: data.id,
              name: name,
              entryNumber: entry.entry_number,
              types: types,
              sprite: data.sprites.front_default,
              url: entry.pokemon_species.url
            };
          } catch (error) {
            console.error(`Error fetching details for ${entry.pokemon_species.name}:`, error);
            return {
              name: entry.pokemon_species.name,
              entryNumber: entry.entry_number,
              types: [],
              url: entry.pokemon_species.url
            };
          }
        })
      );

      setPokemonEntries(prevEntries => [...prevEntries, ...detailedPokemon]);
    } catch (error) {
      console.error("Error loading Pokemon data:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Load more Pokemon
  const loadMorePokemon = async () => {
    if (!pokedexData?.pokemon_entries || isLoadingMore) return;

    setIsLoadingMore(true);

    const startIndex = pokemonPage * pokemonPerPage;
    const endIndex = startIndex + pokemonPerPage;
    const nextBatch = pokedexData.pokemon_entries.slice(startIndex, endIndex);

    if (nextBatch.length > 0) {
      await loadPokemonData(nextBatch);
      setPokemonPage(prevPage => prevPage + 1);
    }

    setIsLoadingMore(false);
  };

  // Handle "Show All Pokemon" button click
  const handleShowAllPokemon = () => {
    setShowAllPokemon(true);
    if (pokemonEntries.length < pokemonPerPage) {
      loadMorePokemon();
    }
  };

  const formatName = (name: string): string => {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!showAllPokemon || isLoadingMore) return;

    const element = e.currentTarget;
    if (element.scrollHeight - element.scrollTop - element.clientHeight < 200) {
      loadMorePokemon();
    }
  };

  return (
    <>
      <S.Container style={{ marginBottom: navHeight }} onScroll={handleScroll}>
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

                {pokedexData && pokedexData.pokemon_entries && (
                  <S.CatchButton onClick={handleShowAllPokemon}>
                    Discover All {pokedexData.pokemon_entries.length} {formatName(region.name)} Pokémon
                  </S.CatchButton>
                )}
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

            {!showAllPokemon && region.locations && region.locations.length > 0 && (
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
                <S.SectionHeader>
                  <S.SectionTitle>
                    {showAllPokemon
                      ? `All ${formatName(region.name)} Pokémon (${pokedexData.pokemon_entries.length})`
                      : "Featured Pokémon"}
                  </S.SectionTitle>
                  <S.SectionSubtitle>
                    {showAllPokemon
                      ? `Complete list of Pokémon native to the ${formatName(region.name)} region`
                      : `Discover the native Pokémon of ${formatName(region.name)}`}
                  </S.SectionSubtitle>
                </S.SectionHeader>

                <S.PokemonGrid>
                  {pokemonEntries.map((pokemon, index) => (
                    <S.PokemonCard
                      key={`${pokemon.name}-${index}`}
                      onClick={() => navigate(`/pokemon/${pokemon.name}`)}
                    >
                      <S.PokemonImage
                        src={pokemon.sprite || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id || getPokemonId(pokemon.url)}.png`}
                        alt={pokemon.name}
                      />
                      <S.PokemonName>{formatName(pokemon.name)}</S.PokemonName>
                      <S.PokemonNumber>#{pokemon.entryNumber}</S.PokemonNumber>
                      {pokemon.types && pokemon.types.length > 0 && (
                        <S.TypeContainer>
                          {pokemon.types.map((type: string, i: number) => (
                            <S.TypeBadge key={i} type={type}>
                              {type}
                            </S.TypeBadge>
                          ))}
                        </S.TypeContainer>
                      )}
                    </S.PokemonCard>
                  ))}
                </S.PokemonGrid>

                {isLoadingMore && (
                  <S.LoadingMore>
                    <p>Loading more Pokémon...</p>
                  </S.LoadingMore>
                )}

                {!showAllPokemon && pokedexData.pokemon_entries.length > 12 && (
                  <S.ShowMoreButtonContainer>
                    <S.ShowMoreButton onClick={handleShowAllPokemon}>
                      View All {pokedexData.pokemon_entries.length} Pokémon
                    </S.ShowMoreButton>
                    <S.ButtonDescription>
                      See the complete list of Pokémon native to the {formatName(region.name)} region
                    </S.ButtonDescription>
                  </S.ShowMoreButtonContainer>
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
