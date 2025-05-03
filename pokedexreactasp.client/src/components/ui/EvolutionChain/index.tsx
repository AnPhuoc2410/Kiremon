import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Link } from 'react-router-dom';
import { Text } from '..';
import { POKEMON_IMAGE } from '../../../config/api.config';
import { EvolutionContainer } from './index.style';

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
    to: EvolutionItem | EvolutionItem[];
    trigger?: EvolutionTrigger;
  }[];
}

function getBranchDirection(
  index: number,
  total: number
): 'up-right' | 'up' | 'right' | 'down-right' {
  if (total === 1) {
    return 'right';
  }
  if (total === 2) {
    // For two-way splits: first goes up‑right, second down‑right
    return index === 0 ? 'up-right' : 'down-right';
  }
  if (total === 3) {
    // For three-way splits: top, middle, bottom
    return index === 0
      ? 'up-right'
      : index === 1
        ? 'up'
        : 'down-right';
  }
  // For many splits: distribute them among available directions
  if (index === 0) return 'up-right';
  if (index === total - 1) return 'down-right';
  return index % 2 === 0 ? 'up-right' : 'down-right';
}

/**
 * Process raw evolution data into a structured format for rendering
 */
function processEvolutionData(evolutions: EvolutionChainProps['evolutions']): EvolutionItem[][] {
  // Group evolutions by stages
  const stages: Map<number, Set<EvolutionItem>> = new Map();
  const stageMap: Map<string, number> = new Map(); // Maps pokemon.name to stage number

  // Start with base Pokemon at stage 0
  const basePokemons = new Set<string>();
  evolutions.forEach(evo => basePokemons.add(evo.from.name));

  // Find Pokemon that are only 'from' but never 'to' as base Pokemon
  const onlyAsTo = new Set<string>();
  evolutions.forEach(evo => {
    if (Array.isArray(evo.to)) {
      evo.to.forEach(to => onlyAsTo.add(to.name));
    } else {
      onlyAsTo.add(evo.to.name);
    }
  });

  // First stage Pokemon (those that never appear as 'to')
  const firstStage = Array.from(basePokemons)
    .filter(name => !onlyAsTo.has(name))
    .map(name => evolutions.find(evo => evo.from.name === name)?.from)
    .filter(Boolean) as EvolutionItem[];

  if (firstStage.length === 0 && evolutions.length > 0) {
    // Fallback: use the first evolution's 'from' as base
    firstStage.push(evolutions[0].from);
  }

  // Add first stage Pokemon
  stages.set(0, new Set(firstStage));
  firstStage.forEach(pokemon => stageMap.set(pokemon.name, 0));

  // Process evolutions to build stages
  let currentStage = 0;
  let foundNew = true;

  while (foundNew) {
    foundNew = false;
    const currentPokemon = stages.get(currentStage);

    if (!currentPokemon) break;

    const nextStage = new Set<EvolutionItem>();

    // For each Pokemon in current stage, add its evolutions to next stage
    currentPokemon.forEach(pokemon => {
      const evosForPokemon = evolutions.filter(evo => evo.from.name === pokemon.name);

      evosForPokemon.forEach(evo => {
        if (Array.isArray(evo.to)) {
          evo.to.forEach(to => {
            if (!stageMap.has(to.name)) {
              nextStage.add(to);
              stageMap.set(to.name, currentStage + 1);
              foundNew = true;
            }
          });
        } else {
          if (!stageMap.has(evo.to.name)) {
            nextStage.add(evo.to);
            stageMap.set(evo.to.name, currentStage + 1);
            foundNew = true;
          }
        }
      });
    });

    if (nextStage.size > 0) {
      stages.set(currentStage + 1, nextStage);
      currentStage++;
    }
  }

  // Convert Map of Sets to array of arrays
  const result: EvolutionItem[][] = [];
  for (let i = 0; i <= currentStage; i++) {
    const stagePokemons = stages.get(i);
    if (stagePokemons) {
      result.push(Array.from(stagePokemons));
    }
  }

  return result;
}

const PokemonCard = ({ pokemon }: { pokemon: EvolutionItem }) => (
  <Link to={`/pokemon/${pokemon.name}`} className="pokemon-card">
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

interface EvolutionArrowProps {
  direction: 'up-right' | 'up' | 'right' | 'down-right';
  label?: string;
}

const EvolutionArrow: React.FC<EvolutionArrowProps> = ({ direction, label }) => {
  // Simple horizontal arrow that matches the reference image
  return (
    <div className="evolution-arrow">
      {label && <Text className="arrow-label">{label}</Text>}
      <div className="arrow">→</div>
    </div>
  );
};

const EvolutionChain: React.FC<EvolutionChainProps> = ({ evolutions }) => {
  if (!evolutions || evolutions.length === 0) return null;

  // Process the evolution data into stages
  const stages = processEvolutionData(evolutions);

  return (
    <EvolutionContainer>
      <div className="evolution-chain">
        {stages.map((stage, stageIndex) => (
          <React.Fragment key={`stage-${stageIndex}`}>
            {/* The Pokemon of this stage */}
            <div className="evolution-stage">
              <div className="stage-pokemon">
                {stage.map((pokemon, pokemonIndex) => (
                  <PokemonCard
                    key={`pokemon-${stageIndex}-${pokemonIndex}`}
                    pokemon={pokemon}
                  />
                ))}
              </div>
            </div>

            {/* If not the last stage, display arrows to next stage */}
            {stageIndex < stages.length - 1 && (
              <div className="evolution-arrows">
                {stage.map((fromPokemon, fromIndex) => {
                  // Find evolutions for this Pokemon
                  const evosForPokemon = evolutions.filter(evo =>
                    evo.from.name === fromPokemon.name
                  );

                  return evosForPokemon.map((evo, evoIndex) => {
                    if (Array.isArray(evo.to)) {
                      return evo.to.map((toPokemon, toIndex) => (
                        <div className="evolution-branch" key={`evo-${stageIndex}-${fromIndex}-${evoIndex}-${toIndex}`}>
                          <EvolutionArrow
                            direction="right"
                            label={evo.trigger?.text}
                          />
                        </div>
                      ));
                    } else {
                      return (
                        <div className="evolution-branch" key={`evo-${stageIndex}-${fromIndex}-${evoIndex}`}>
                          <EvolutionArrow
                            direction="right"
                            label={evo.trigger?.text}
                          />
                        </div>
                      );
                    }
                  });
                })}
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </EvolutionContainer>
  );
};

export default EvolutionChain;
