import React, { useState, useMemo } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Link } from 'react-router-dom';
import { IGenerationDetail, IName, INameUrlPair, IPokemonSpeciesDetail } from '../../../types/pokemon';
import { Text } from '../';
import { getRegionTheme } from '../../utils/regionThemes';
import {
  GenerationContainer,
  GenerationContent,
  TitleArea,
  TabContainer,
  TabContent,
  PokemonGrid,
  PokemonCard,
  VersionsGrid,
  VersionCard,
  MovesList,
  TabButton,
  Pagination,
  PageInfo
} from './index.style';

interface GenerationDetailProps {
  generation: IGenerationDetail;
}

type TabType = 'pokemon_species' | 'moves' | 'version_groups';

const ITEMS_PER_PAGE = 36; // For displaying Pokémon in a 6x6 grid on most screens

const GenerationDetail: React.FC<GenerationDetailProps> = ({ generation }) => {
  const [activeTab, setActiveTab] = useState<TabType>('pokemon_species');
  const [currentPage, setCurrentPage] = useState(1);

  // Get region-specific theme colors
  const regionTheme = useMemo(() =>
    getRegionTheme(generation.main_region.name),
  [generation.main_region.name]);

  // Calculate pagination for Pokémon species
  const totalPokemonPages = Math.ceil(generation.pokemon_species.length / ITEMS_PER_PAGE);
  const currentPokemon = generation.pokemon_species.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Get the localized name in English
  const getLocalizedName = (names: IName[]): string => {
    const englishName = names.find(name => name.language.name === 'en');
    return englishName ? englishName.name : generation.name;
  };

  // Format the name to be displayed
  const formatName = (name: string): string => {
    return name.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
  };

  // Extract generation number from name ("generation-i" -> "1")
  const getGenerationNumber = (name: string): string => {
    const match = name.match(/generation-([ivx]+)/i);
    if (!match) return '';

    const roman = match[1].toLowerCase();

    // Convert Roman numerals to integers
    const romanValues: { [key: string]: number } = {
      i: 1, v: 5, x: 10, l: 50, c: 100, d: 500, m: 1000
    };

    let result = 0;
    let i = 0;

    while (i < roman.length) {
      const current = romanValues[roman[i]];
      const next = i + 1 < roman.length ? romanValues[roman[i + 1]] : 0;

      if (current < next) {
        result += next - current;
        i += 2;
      } else {
        result += current;
        i += 1;
      }
    }

    return result.toString();
  };

  // Extract ID from URL
  const extractIdFromUrl = (url: string): number => {
    const parts = url.split('/');
    return parseInt(parts[parts.length - 2] || '0', 10);
  };

  // Handle page changes
  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPokemonPages));
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  return (
    <GenerationContainer theme={regionTheme}>
      <TitleArea theme={regionTheme}>
        <Text as="h1" size="xl">
          Generation {getGenerationNumber(generation.name)}
        </Text>
        <Text as="h2" size="lg">
          {getLocalizedName(generation.names)}
        </Text>
        <Text as="p">
          Region: {formatName(generation.main_region.name)}
        </Text>
      </TitleArea>

      <TabContainer>
        <TabButton
          active={activeTab === 'pokemon_species'}
          onClick={() => setActiveTab('pokemon_species')}
          theme={regionTheme}
        >
          Pokémon Species ({generation.pokemon_species.length})
        </TabButton>
        <TabButton
          active={activeTab === 'moves'}
          onClick={() => setActiveTab('moves')}
          theme={regionTheme}
        >
          Moves ({generation.moves.length})
        </TabButton>
        <TabButton
          active={activeTab === 'version_groups'}
          onClick={() => setActiveTab('version_groups')}
          theme={regionTheme}
        >
          Games ({generation.version_groups.length})
        </TabButton>
      </TabContainer>

      <GenerationContent>
        {/* Pokémon Species Tab */}
        {activeTab === 'pokemon_species' && (
          <TabContent theme={regionTheme}>
            <PokemonGrid>
              {currentPokemon.map((species) => (
                <Link to={`/pokemon/${species.name}`} key={species.name}>
                  <PokemonCard theme={regionTheme}>
                    <LazyLoadImage
                      src={species.sprite || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${extractIdFromUrl(species.url)}.png`}
                      alt={species.name}
                      effect="opacity"
                      width={96}
                      height={96}
                    />
                    <Text>{formatName(species.name)}</Text>
                  </PokemonCard>
                </Link>
              ))}
            </PokemonGrid>

            {/* Pagination controls */}
            {totalPokemonPages > 1 && (
              <Pagination theme={regionTheme}>
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <PageInfo>
                  Page {currentPage} of {totalPokemonPages}
                </PageInfo>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPokemonPages}
                >
                  Next
                </button>
              </Pagination>
            )}
          </TabContent>
        )}

        {/* Moves Tab */}
        {activeTab === 'moves' && (
          <TabContent theme={regionTheme}>
            <MovesList>
              {generation.moves.map((move) => (
                <div key={move.name} className="move-item">
                  <Text>{formatName(move.name)}</Text>
                </div>
              ))}
            </MovesList>
          </TabContent>
        )}

        {/* Version Groups Tab */}
        {activeTab === 'version_groups' && (
          <TabContent theme={regionTheme}>
            <VersionsGrid>
              {generation.version_groups.map((version) => (
                <VersionCard key={version.name} theme={regionTheme}>
                  <Text>{formatName(version.name)}</Text>
                </VersionCard>
              ))}
            </VersionsGrid>
          </TabContent>
        )}
      </GenerationContent>
    </GenerationContainer>
  );
};

export default GenerationDetail;
