import React, { useMemo } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Link } from 'react-router-dom';
import { Text } from '..';
import { POKEMON_IMAGE } from '../../../config/api.config';
import * as S from './index.style';

interface EvolutionPokemon {
  id: number;
  name: string;
  sprite: string;
}

interface EvolutionTrigger {
  text: string;
}

interface EvolutionData {
  from: EvolutionPokemon;
  to: EvolutionPokemon;
  trigger?: EvolutionTrigger;
}

interface EvolutionChainProps {
  evolutions: EvolutionData[];
}

// Item name to sprite URL mapping
const getItemSprite = (itemName: string): string => {
  const formattedName = itemName.toLowerCase().replace(/\s+/g, '-');
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${formattedName}.png`;
};

// Parse trigger text to extract item info
const parseTrigger = (triggerText: string): { type: string; item?: string; value?: string; displayText: string } => {
  const text = triggerText.toLowerCase();

  if (text.startsWith('level ')) {
    return { type: 'level', value: text.replace('level ', ''), displayText: triggerText };
  }
  if (text.startsWith('use ')) {
    return { type: 'item', item: text.replace('use ', ''), displayText: triggerText };
  }
  if (text.includes('trade holding')) {
    const item = text.replace('trade holding ', '');
    return { type: 'trade-item', item, displayText: triggerText };
  }
  if (text === 'trade') {
    return { type: 'trade', displayText: 'Trade' };
  }
  if (text.startsWith('happiness')) {
    const match = text.match(/\((\d+)\+?\)/);
    return { type: 'happiness', value: match ? match[1] : '220', displayText: triggerText };
  }
  if (text.includes('daytime') || text.includes('day')) {
    return { type: 'time-day', displayText: triggerText };
  }
  if (text.includes('nighttime') || text.includes('night')) {
    return { type: 'time-night', displayText: triggerText };
  }

  return { type: 'other', value: triggerText, displayText: triggerText };
};

// Pokemon Card Component
const PokemonCard: React.FC<{ pokemon: EvolutionPokemon; size?: 'small' | 'medium' | 'large' }> = ({
  pokemon,
  size = 'medium'
}) => {
  const sizeMap = {
    small: 64,
    medium: 80,
    large: 96
  };

  return (
    <Link to={`/pokemon/${pokemon.name}`} className={`pokemon-card pokemon-card--${size}`}>
      <LazyLoadImage
        src={pokemon.sprite || `${POKEMON_IMAGE}/${pokemon.id}.png`}
        alt={pokemon.name}
        width={sizeMap[size]}
        height={sizeMap[size]}
        effect="blur"
      />
      <Text className="pokemon-id">#{String(pokemon.id).padStart(4, '0')}</Text>
      <Text className="pokemon-name">{pokemon.name}</Text>
    </Link>
  );
};

// Evolution Arrow Component with item display
const EvolutionArrow: React.FC<{
  trigger?: EvolutionTrigger;
  direction?: 'horizontal' | 'diagonal-up' | 'diagonal-down';
}> = ({ trigger, direction = 'horizontal' }) => {
  const parsed = trigger ? parseTrigger(trigger.text) : null;

  const getArrowIcon = () => {
    switch (direction) {
      case 'diagonal-up':
        return '↗';
      case 'diagonal-down':
        return '↘';
      default:
        return '→';
    }
  };

  const showItemSprite = parsed && (parsed.type === 'item' || parsed.type === 'trade-item');

  return (
    <div className={`evolution-arrow evolution-arrow--${direction}`}>
      <div className="arrow-content">
        {showItemSprite && parsed.item && (
          <img
            src={getItemSprite(parsed.item)}
            alt={parsed.item}
            className="item-sprite"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}
        {trigger && <Text className="trigger-text">{trigger.text}</Text>}
        <div className="arrow-symbol">{getArrowIcon()}</div>
      </div>
    </div>
  );
};

// Process evolution data into a graph structure
interface EvolutionNode {
  pokemon: EvolutionPokemon;
  evolvesTo: { node: EvolutionNode; trigger?: EvolutionTrigger }[];
}

const buildEvolutionGraph = (evolutions: EvolutionData[]): EvolutionNode | null => {
  if (evolutions.length === 0) return null;

  // Find all unique Pokemon
  const pokemonMap = new Map<string, EvolutionPokemon>();
  const childrenMap = new Map<string, { to: EvolutionPokemon; trigger?: EvolutionTrigger }[]>();
  const hasParent = new Set<string>();

  evolutions.forEach(evo => {
    pokemonMap.set(evo.from.name, evo.from);
    pokemonMap.set(evo.to.name, evo.to);

    if (!childrenMap.has(evo.from.name)) {
      childrenMap.set(evo.from.name, []);
    }
    childrenMap.get(evo.from.name)!.push({ to: evo.to, trigger: evo.trigger });
    hasParent.add(evo.to.name);
  });

  // Find root (Pokemon that has no parent)
  let rootName: string | null = null;
  pokemonMap.forEach((_, name) => {
    if (!hasParent.has(name)) {
      rootName = name;
    }
  });

  if (!rootName) return null;

  // Build tree recursively
  const buildNode = (name: string): EvolutionNode => {
    const pokemon = pokemonMap.get(name)!;
    const children = childrenMap.get(name) || [];

    return {
      pokemon,
      evolvesTo: children.map(child => ({
        node: buildNode(child.to.name),
        trigger: child.trigger
      }))
    };
  };

  return buildNode(rootName);
};

// Calculate if this is a branching evolution (like Eevee)
const countDirectEvolutions = (node: EvolutionNode): number => {
  return node.evolvesTo.length;
};

// SVG Arrow Line Component
const SvgArrowLine: React.FC<{
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  trigger?: EvolutionTrigger;
}> = ({ startX, startY, endX, endY, trigger }) => {
  const parsed = trigger ? parseTrigger(trigger.text) : null;
  const showItemSprite = parsed && (parsed.type === 'item' || parsed.type === 'trade-item');

  // Calculate angle for arrow head
  const angle = Math.atan2(endY - startY, endX - startX);

  // Shorten the line to not overlap with cards
  const shortenStart = 60; // Distance from center of start card
  const shortenEnd = 65; // Distance from center of end card

  const lineLength = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
  const ratio1 = shortenStart / lineLength;
  const ratio2 = 1 - (shortenEnd / lineLength);

  const actualStartX = startX + (endX - startX) * ratio1;
  const actualStartY = startY + (endY - startY) * ratio1;
  const actualEndX = startX + (endX - startX) * ratio2;
  const actualEndY = startY + (endY - startY) * ratio2;

  // Label position - closer to the end (evolution) side
  const labelRatio = 0.65; // 65% along the line from start
  const labelX = actualStartX + (actualEndX - actualStartX) * labelRatio;
  const labelY = actualStartY + (actualEndY - actualStartY) * labelRatio;

  // Arrow head points
  const arrowSize = 8;
  const arrowAngle = Math.PI / 6; // 30 degrees

  const arrowPoint1X = actualEndX - arrowSize * Math.cos(angle - arrowAngle);
  const arrowPoint1Y = actualEndY - arrowSize * Math.sin(angle - arrowAngle);
  const arrowPoint2X = actualEndX - arrowSize * Math.cos(angle + arrowAngle);
  const arrowPoint2Y = actualEndY - arrowSize * Math.sin(angle + arrowAngle);

  return (
    <g className="arrow-group">
      {/* Main line */}
      <line
        x1={actualStartX}
        y1={actualStartY}
        x2={actualEndX}
        y2={actualEndY}
        stroke="#CBD5E1"
        strokeWidth="2"
      />

      {/* Arrow head */}
      <polygon
        points={`${actualEndX},${actualEndY} ${arrowPoint1X},${arrowPoint1Y} ${arrowPoint2X},${arrowPoint2Y}`}
        fill="#94A3B8"
      />

      {/* Label */}
      <foreignObject
        x={labelX - 55}
        y={labelY - 28}
        width="110"
        height="56"
        style={{ overflow: 'visible' }}
      >
        <div className="arrow-label-wrapper">
          {showItemSprite && parsed?.item && (
            <img
              src={getItemSprite(parsed.item)}
              alt={parsed.item}
              className="item-sprite-svg"
            />
          )}
          {trigger && <span className="arrow-label-text">{trigger.text}</span>}
        </div>
      </foreignObject>
    </g>
  );
};

// Linear Evolution Chain (e.g., Pichu -> Pikachu -> Raichu)
const LinearEvolutionChain: React.FC<{ root: EvolutionNode }> = ({ root }) => {
  const renderChain = (node: EvolutionNode): React.ReactNode => {
    const evolutionCount = node.evolvesTo.length;

    return (
      <React.Fragment>
        <div className="evolution-stage">
          <PokemonCard pokemon={node.pokemon} />
        </div>

        {evolutionCount > 0 && (
          <>
            {evolutionCount === 1 ? (
              // Single evolution path
              <>
                <EvolutionArrow trigger={node.evolvesTo[0].trigger} direction="horizontal" />
                {renderChain(node.evolvesTo[0].node)}
              </>
            ) : evolutionCount === 2 ? (
              // Two evolution paths (like Slowpoke, Tyrogue)
              <div className="split-evolution">
                <div className="split-branch split-branch--top">
                  <EvolutionArrow trigger={node.evolvesTo[0].trigger} direction="diagonal-up" />
                  <div className="branch-content">
                    <PokemonCard pokemon={node.evolvesTo[0].node.pokemon} />
                    {node.evolvesTo[0].node.evolvesTo.length > 0 && (
                      <>
                        <EvolutionArrow trigger={node.evolvesTo[0].node.evolvesTo[0].trigger} direction="horizontal" />
                        <PokemonCard pokemon={node.evolvesTo[0].node.evolvesTo[0].node.pokemon} />
                      </>
                    )}
                  </div>
                </div>
                <div className="split-branch split-branch--bottom">
                  <EvolutionArrow trigger={node.evolvesTo[1].trigger} direction="diagonal-down" />
                  <div className="branch-content">
                    <PokemonCard pokemon={node.evolvesTo[1].node.pokemon} />
                    {node.evolvesTo[1].node.evolvesTo.length > 0 && (
                      <>
                        <EvolutionArrow trigger={node.evolvesTo[1].node.evolvesTo[0].trigger} direction="horizontal" />
                        <PokemonCard pokemon={node.evolvesTo[1].node.evolvesTo[0].node.pokemon} />
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </>
        )}
      </React.Fragment>
    );
  };

  return (
    <div className="linear-chain">
      {renderChain(root)}
    </div>
  );
};

const RadialEvolutionChain: React.FC<{ root: EvolutionNode }> = ({ root }) => {
  const evolutions = root.evolvesTo;
  const count = evolutions.length;
  const radius = 320;
  const containerSize = 820;
  const centerX = containerSize / 2;
  const centerY = containerSize / 2;

  // Calculate positions in a perfect circle
  const getPosition = (index: number) => {
    const angleStep = 360 / count;
    // Start from top (-90°) and distribute evenly
    const angle = -90 + (angleStep * index);

    // Convert to radians
    const radians = (angle * Math.PI) / 180;

    const x = Math.cos(radians) * radius;
    const y = Math.sin(radians) * radius;

    return { x, y, angle };
  };

  return (
    <div className="radial-chain" style={{ width: containerSize, height: containerSize }}>
      {/* SVG layer for arrows */}
      <svg
        className="radial-svg"
        width={containerSize}
        height={containerSize}
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#94A3B8" />
          </marker>
        </defs>

        {evolutions.map((evo, index) => {
          const pos = getPosition(index);
          return (
            <SvgArrowLine
              key={`arrow-${evo.node.pokemon.name}`}
              startX={centerX}
              startY={centerY}
              endX={centerX + pos.x}
              endY={centerY + pos.y}
              trigger={evo.trigger}
            />
          );
        })}
      </svg>

      {/* Center Pokemon */}
      <div className="radial-center">
        <PokemonCard pokemon={root.pokemon} size="large" />
      </div>

      {/* Evolution Pokemon positioned around the center */}
      {evolutions.map((evo, index) => {
        const pos = getPosition(index);

        return (
          <div
            key={evo.node.pokemon.name}
            className="radial-branch"
            style={{
              left: `calc(50% + ${pos.x}px)`,
              top: `calc(50% + ${pos.y}px)`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <PokemonCard pokemon={evo.node.pokemon} size="small" />
          </div>
        );
      })}
    </div>
  );
};

// Main Evolution Chain Component
const EvolutionChain: React.FC<EvolutionChainProps> = ({ evolutions }) => {
  const evolutionGraph = useMemo(() => buildEvolutionGraph(evolutions), [evolutions]);

  if (!evolutionGraph) return null;

  const directEvolutionCount = countDirectEvolutions(evolutionGraph);
  const useBranchingLayout = directEvolutionCount > 2;

  return (
    <S.EvolutionContainer className={useBranchingLayout ? 'radial-layout' : 'linear-layout'}>
      {useBranchingLayout ? (
        <RadialEvolutionChain root={evolutionGraph} />
      ) : (
        <LinearEvolutionChain root={evolutionGraph} />
      )}
    </S.EvolutionContainer>
  );
};

export default EvolutionChain;
