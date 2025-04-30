import React from 'react';
import styled from '@emotion/styled';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Link } from 'react-router-dom';
import { Text } from '..';
import { POKEMON_IMAGE } from '../../../config/api.config';

const EvolutionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 16px 0;

  .evolution-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 8px;
  }

  .pokemon-evolution {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 12px;
    border-radius: 12px;
    background-color: white;
    box-shadow: 0px 1px 3px rgba(16, 24, 40, 0.1), 0px 1px 2px rgba(16, 24, 40, 0.06);
    transition: transform 0.2s ease-in-out;
    width: 120px;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03);
    }

    .pokemon-name {
      font-weight: 600;
      text-transform: capitalize;
      margin-top: 8px;
    }

    .pokemon-id {
      color: #6B7280;
      font-size: 0.75rem;
    }
  }

  .evolution-arrow {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 8px;

    svg {
      color: #6B7280;
      margin-bottom: 4px;
    }

    .trigger-text {
      font-size: 0.75rem;
      text-align: center;
      max-width: 120px;
      color: #6B7280;
    }
  }
`;

interface EvolutionItem {
  id: number;
  name: string;
  sprite: string;
}

interface EvolutionTrigger {
  text: string;
}

interface EvolutionChainProps {
  evolutions: {
    from: EvolutionItem;
    to: EvolutionItem;
    trigger?: EvolutionTrigger;
  }[];
}

const EvolutionArrow = ({ trigger }: { trigger?: EvolutionTrigger }) => (
  <div className="evolution-arrow">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    {trigger && <div className="trigger-text">{trigger.text}</div>}
  </div>
);

const PokemonEvolutionItem = ({ pokemon }: { pokemon: EvolutionItem }) => (
  <Link to={`/pokemon/${pokemon.name}`} className="pokemon-evolution">
    <LazyLoadImage
      src={pokemon.sprite || `${POKEMON_IMAGE}/${pokemon.id}.png`}
      alt={pokemon.name}
      width={80}
      height={80}
      effect="blur"
    />
    <Text className="pokemon-id">#{String(pokemon.id).padStart(3, '0')}</Text>
    <Text className="pokemon-name">{pokemon.name}</Text>
  </Link>
);

const EvolutionChain: React.FC<EvolutionChainProps> = ({ evolutions }) => {
  // Group evolutions by "from" Pokémon to handle branched evolutions
  const groupedEvolutions: { [key: string]: typeof evolutions } = {};

  evolutions.forEach(evolution => {
    const fromName = evolution.from.name;
    if (!groupedEvolutions[fromName]) {
      groupedEvolutions[fromName] = [];
    }
    groupedEvolutions[fromName].push(evolution);
  });

  // Get starter Pokémon (ones that don't evolve from anything else)
  const starters = evolutions
    .map(evolution => evolution.from)
    .filter(from => !evolutions.some(evolution => evolution.to.name === from.name));

  // Recursively render evolution chains
  const renderEvolutionChain = (pokemon: EvolutionItem) => {
    const nextEvolutions = groupedEvolutions[pokemon.name] || [];

    if (nextEvolutions.length === 0) {
      return <PokemonEvolutionItem key={pokemon.name} pokemon={pokemon} />;
    }

    return (
      <div key={pokemon.name} className="evolution-row">
        <PokemonEvolutionItem pokemon={pokemon} />
        {nextEvolutions.map(evolution => (
          <React.Fragment key={`${evolution.from.name}-${evolution.to.name}`}>
            <EvolutionArrow trigger={evolution.trigger} />
            {renderEvolutionChain(evolution.to)}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <EvolutionContainer>
      {starters.map(starter => renderEvolutionChain(starter))}
    </EvolutionContainer>
  );
};

export default EvolutionChain;