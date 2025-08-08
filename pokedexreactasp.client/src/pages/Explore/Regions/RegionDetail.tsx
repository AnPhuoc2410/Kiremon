import { useState, useEffect, createRef, useCallback, useRef, type RefObject } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header, Navbar, Loading } from "../../../components/ui";
import { regionsService, pokedexService, pokemonService } from "../../../services";
import { IRegion, IPokedex, INameUrlPair } from "../../../types/pokemon";
import * as S from "./regionDetail.style";
import { getRegionTheme } from "../../../components/utils/regionThemes";

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
  const [pokemonPage, setPokemonPage] = useState<number>(0);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [expandedLocations, setExpandedLocations] = useState<boolean>(false);
  const pokemonPerPage = 20;
  const locationsPerPage = 8; // Show 8 locations initially

  // New refs for smooth scrolling to sections
  const locationsRef = useRef<HTMLDivElement | null>(null);
  const pokedexRef = useRef<HTMLDivElement | null>(null);

  // Compute theme from regionName
  const theme = getRegionTheme(regionName || 'default');

  // Reset all state when the region changes
  useEffect(() => {
    setShowAllPokemon(false);
    setPokemonPage(0);
    setPokemonEntries([]);
    setRegion(null);
    setPokedexData(null);
    setLoading(true);
    setError(null);
    setExpandedLocations(false);
  }, [regionName]);

  useEffect(() => {
    setNavHeight(navRef.current?.clientHeight as number);
  }, [navRef]);

  // Function to load Pokemon data with types and details
  const loadPokemonData = useCallback(async (entries: any[]) => {
    if (!entries || entries.length === 0) return;

    try {
      setIsLoadingMore(true);

      const detailedPokemon = await Promise.all(
        entries.map(async (entry) => {
          try {
            const name = entry.pokemon_species.name;
            // Get Pokémon details via service layer
            const pokemonData = await pokemonService.getPokemonDetail(name);

            if (!pokemonData) {
              throw new Error(`Failed to fetch details for ${name}`);
            }

            const types = pokemonData.types.map((t: any) => t.type.name);

            return {
              name: name,
              // Use the regional Pokédex entry_number directly
              entryNumber: entry.entry_number,
              types: types,
              sprite: pokemonData.sprites.front_default,
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

      // Always set the entries directly to avoid duplicate entries
      setPokemonEntries(prevEntries => {
        // Check if we already have any of these Pokémon to prevent duplicates
        const existingNames = new Set(prevEntries.map(p => p.name));
        const uniqueNewPokemon = detailedPokemon.filter(p => !existingNames.has(p.name));
        return [...prevEntries, ...uniqueNewPokemon];
      });
    } catch (error) {
      console.error("Error loading Pokemon data:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, []);

  // Fetch region data after state reset
  useEffect(() => {
    const fetchRegionData = async () => {
      if (!regionName) return;

      try {
        // Get detailed region data
        const regionData = await regionsService.getRegionDetails(regionName);

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
          const pokedexDetails = await pokedexService.getPokedexDetails(mainPokedex.name);
          setPokedexData(pokedexDetails);

          // Load initial batch of Pokemon data
          if (pokedexDetails?.pokemon_entries) {
            // Make sure we start fresh with each region
            await loadPokemonData(pokedexDetails.pokemon_entries.slice(0, 12));
          }
        }
      } catch (err) {
        console.error(`Error fetching data for region ${regionName}:`, err);
        setError(`Failed to load details for ${regionName} region. Please try again later.`);
      } finally {
        setLoading(false);
      }
    };

    // Only run if we're in loading state (which happens after region change resets state)
    if (loading && regionName) {
      fetchRegionData();
    }
  }, [regionName, loading, loadPokemonData]);

  // Load more Pokemon
  const loadMorePokemon = useCallback(async () => {
    if (!pokedexData?.pokemon_entries || isLoadingMore) return;

    const startIndex = (pokemonPage + 1) * pokemonPerPage;
    const endIndex = startIndex + pokemonPerPage;
    const nextBatch = pokedexData.pokemon_entries.slice(startIndex, endIndex);

    if (nextBatch.length > 0) {
      await loadPokemonData(nextBatch);
      setPokemonPage(prevPage => prevPage + 1);
    }
  }, [pokedexData, pokemonPage, pokemonPerPage, isLoadingMore, loadPokemonData]);

  // Handle "Show All Pokemon" button click
  const handleShowAllPokemon = () => {
    setShowAllPokemon(true);
    // If we still have the initial 12 Pokémon, load more
    if (pokemonEntries.length <= 12) {
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
    if (element.scrollHeight - element.scrollTop - element.clientHeight < 300) {
      loadMorePokemon();
    }
  };

  // Handle expanding/collapsing the locations section
  const toggleLocationExpansion = () => {
    setExpandedLocations(prev => !prev);
  };

  // Smooth scroll helpers
  const scrollToRef = (ref: RefObject<HTMLElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const goToLocations = () => scrollToRef(locationsRef);
  const goToPokedexAll = () => {
    handleShowAllPokemon();
    scrollToRef(pokedexRef);
  };

  return (
    <>
      <S.Container style={{ marginBottom: navHeight }} onScroll={handleScroll}>
        <Header
          title={regionName ? formatName(regionName) + " Region" : "Region Details"}
          subtitle="Explore Pokémon, locations, and more"
        />

        <S.BackButton onClick={() => navigate('/regions')} bg={theme.secondary} hoverBg={theme.primary}>
          ← Back to Regions
        </S.BackButton>

        {loading ? (
          <S.LoadingWrapper>
            <Loading label="Loading region data..." />
          </S.LoadingWrapper>
        ) : error ? (
          <S.ErrorWrapper>
            <p>{error}</p>
            <button onClick={() => navigate('/regions')}>Back to Regions</button>
          </S.ErrorWrapper>
        ) : region ? (
          <S.Content>
            <S.RegionBanner style={{ backgroundImage: `url(${region.image})` }}>
              <S.RegionOverlay overlayTint={theme.overlay}>
                <S.RegionTitle>{formatName(region.name)}</S.RegionTitle>
                <S.RegionDescription>{region.description}</S.RegionDescription>

                {/* New: quick actions under hero */}
                <S.HeroActions>
                  {region.locations && region.locations.length > 0 && (
                    <S.PrimaryAction onClick={goToLocations} bg={theme.primary} hoverBg={theme.secondary}>Explore Locations</S.PrimaryAction>
                  )}
                  {pokedexData && pokedexData.pokemon_entries && (
                    <S.SecondaryAction borderColor={theme.primary} textColor={theme.primary} hoverBg={theme.overlay}>
                      View Pokédex ({pokedexData.pokemon_entries.length})
                    </S.SecondaryAction>
                  )}
                </S.HeroActions>

                {pokedexData && pokedexData.pokemon_entries && (
                  <S.CatchButton onClick={handleShowAllPokemon} bg={theme.accent} hoverBg={theme.primary}>
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

              {/* New: compact stats row */}
              <S.StatsRow>
                <S.StatPill>📍 {region.locations?.length || 0} Locations</S.StatPill>
                <S.StatPill>📘 {pokedexData?.pokemon_entries?.length || 0} Pokémon</S.StatPill>
                {region.main_generation && (
                  <S.StatPill>🧬 {formatName(region.main_generation.name)}</S.StatPill>
                )}
              </S.StatsRow>
            </S.InfoContainer>

            {!showAllPokemon && region.locations && region.locations.length > 0 && (
              <S.Section ref={locationsRef}>
                <S.SectionHeader>
                  <S.HeaderContainer>
                    <div>
                      <S.SectionTitle>Locations</S.SectionTitle>
                      <S.SectionSubtitle>
                        Discover places to visit in the {formatName(region.name)} region
                      </S.SectionSubtitle>
                    </div>
                    {region.locations.length > locationsPerPage && (
                      <S.SmallToggle onClick={toggleLocationExpansion}>
                        {expandedLocations ? 'Show Less' : 'Show All'}
                      </S.SmallToggle>
                    )}
                  </S.HeaderContainer>
                </S.SectionHeader>

                <S.LocationGrid>
                  {region.locations
                    .slice(0, expandedLocations ? region.locations.length : locationsPerPage)
                    .map((location: INameUrlPair, index: number) => (
                      <S.LocationCard key={index}>
                        <S.LocationIcon>📍</S.LocationIcon>
                        {formatName(location.name)}
                      </S.LocationCard>
                    ))}
                </S.LocationGrid>

                {!expandedLocations && region.locations.length > locationsPerPage && (
                  <S.ShowMoreButtonContainer>
                    <S.ButtonDescription>
                      {region.locations.length - locationsPerPage} more locations not shown
                    </S.ButtonDescription>
                  </S.ShowMoreButtonContainer>
                )}
              </S.Section>
            )}

            {pokedexData && pokedexData.pokemon_entries && (
              <S.Section ref={pokedexRef}>
                <S.SectionHeader>
                  <div>
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
                  </div>
                </S.SectionHeader>

                <S.PokemonGrid>
                  {pokemonEntries.map((pokemon, index) => (
                    <S.PokemonCard
                      key={`${pokemon.name}-${pokemon.entryNumber}`}
                      onClick={() => navigate(`/pokemon/${pokemon.name}`)}
                    >
                      {/* Themed number badge */}
                      <S.NumberBadge bg={theme.primary}>
                        #{String(pokemon.entryNumber).padStart(3, '0')}
                      </S.NumberBadge>

                      <S.PokemonImage
                        src={pokemon.sprite}
                        alt={pokemon.name}
                      />
                      <S.PokemonName>{formatName(pokemon.name)}</S.PokemonName>
                      <S.PokemonNumber>
                        #{pokemon.entryNumber}
                      </S.PokemonNumber>
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
                    <Loading label="Loading more Pokémon..." />
                  </S.LoadingMore>
                )}

                {!showAllPokemon && pokedexData.pokemon_entries.length > 12 && (
                  <S.ShowMoreButtonContainer>
                    <S.ShowMoreButton onClick={handleShowAllPokemon} bg={theme.primary} hoverBg={theme.secondary}>
                      View All {pokedexData.pokemon_entries.length} Pokémon
                    </S.ShowMoreButton>
                    <S.ButtonDescription>
                      See the complete list of Pokémon native to the {formatName(region.name)} region
                    </S.ButtonDescription>
                  </S.ShowMoreButtonContainer>
                )}

                {showAllPokemon && !isLoadingMore && pokemonEntries.length < pokedexData.pokemon_entries.length && (
                  <S.ShowMoreButtonContainer>
                    <S.ShowMoreButton onClick={loadMorePokemon} bg={theme.primary} hoverBg={theme.secondary}>
                      Load More Pokémon
                    </S.ShowMoreButton>
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
