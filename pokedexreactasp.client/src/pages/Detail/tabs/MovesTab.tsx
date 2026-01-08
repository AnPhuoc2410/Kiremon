import React, { useState, useEffect } from "react";
import { Text } from "../../../components/ui";
import * as S from "./MovesTab.style";

// Type effectiveness data
const typeEffectiveness = {
  normal: {
    weakTo: ["fighting"],
    resistantTo: [],
    immuneTo: ["ghost"],
  },
  fire: {
    weakTo: ["water", "ground", "rock"],
    resistantTo: ["fire", "grass", "ice", "bug", "steel", "fairy"],
    immuneTo: [],
  },
  water: {
    weakTo: ["electric", "grass"],
    resistantTo: ["fire", "water", "ice", "steel"],
    immuneTo: [],
  },
  electric: {
    weakTo: ["ground"],
    resistantTo: ["electric", "flying", "steel"],
    immuneTo: [],
  },
  grass: {
    weakTo: ["fire", "ice", "poison", "flying", "bug"],
    resistantTo: ["water", "electric", "grass", "ground"],
    immuneTo: [],
  },
  ice: {
    weakTo: ["fire", "fighting", "rock", "steel"],
    resistantTo: ["ice"],
    immuneTo: [],
  },
  fighting: {
    weakTo: ["flying", "psychic", "fairy"],
    resistantTo: ["bug", "rock", "dark"],
    immuneTo: [],
  },
  poison: {
    weakTo: ["ground", "psychic"],
    resistantTo: ["grass", "fighting", "poison", "bug", "fairy"],
    immuneTo: [],
  },
  ground: {
    weakTo: ["water", "grass", "ice"],
    resistantTo: ["poison", "rock"],
    immuneTo: ["electric"],
  },
  flying: {
    weakTo: ["electric", "ice", "rock"],
    resistantTo: ["grass", "fighting", "bug"],
    immuneTo: ["ground"],
  },
  psychic: {
    weakTo: ["bug", "ghost", "dark"],
    resistantTo: ["fighting", "psychic"],
    immuneTo: [],
  },
  bug: {
    weakTo: ["fire", "flying", "rock"],
    resistantTo: ["grass", "fighting", "ground"],
    immuneTo: [],
  },
  rock: {
    weakTo: ["water", "grass", "fighting", "ground", "steel"],
    resistantTo: ["normal", "fire", "poison", "flying"],
    immuneTo: [],
  },
  ghost: {
    weakTo: ["ghost", "dark"],
    resistantTo: ["poison", "bug"],
    immuneTo: ["normal", "fighting"],
  },
  dragon: {
    weakTo: ["ice", "dragon", "fairy"],
    resistantTo: ["fire", "water", "electric", "grass"],
    immuneTo: [],
  },
  dark: {
    weakTo: ["fighting", "bug", "fairy"],
    resistantTo: ["ghost", "dark"],
    immuneTo: ["psychic"],
  },
  steel: {
    weakTo: ["fire", "fighting", "ground"],
    resistantTo: [
      "normal",
      "grass",
      "ice",
      "flying",
      "psychic",
      "bug",
      "rock",
      "dragon",
      "steel",
      "fairy",
    ],
    immuneTo: ["poison"],
  },
  fairy: {
    weakTo: ["poison", "steel"],
    resistantTo: ["fighting", "bug", "dark"],
    immuneTo: ["dragon"],
  },
};

interface MovesTabProps {
  moves: string[];
  types: string[];
}

interface MoveDetails {
  name: string;
  level?: number;
  method: string;
}

const MovesTab: React.FC<MovesTabProps> = ({ moves, types }) => {
  const [organizeMoves, setOrganizeMoves] = useState<{
    [key: string]: MoveDetails[];
  }>({
    levelUp: [],
    tm: [],
    egg: [],
    tutor: [],
    other: [],
  });

  // Process moves into categories
  useEffect(() => {
    // In a real implementation, you would fetch detailed move data from the API
    // For demo purposes, we'll simulate this with random assignments
    const processedMoves = {
      levelUp: [] as MoveDetails[],
      tm: [] as MoveDetails[],
      egg: [] as MoveDetails[],
      tutor: [] as MoveDetails[],
      other: [] as MoveDetails[],
    };

    moves.forEach((move, index) => {
      // Randomly assign moves to categories for demonstration
      const rand = Math.random();

      if (rand < 0.4) {
        processedMoves.levelUp.push({
          name: move,
          level: Math.floor(Math.random() * 50) + 1,
          method: "level-up",
        });
      } else if (rand < 0.7) {
        processedMoves.tm.push({
          name: move,
          method: "machine",
        });
      } else if (rand < 0.85) {
        processedMoves.egg.push({
          name: move,
          method: "egg",
        });
      } else if (rand < 0.95) {
        processedMoves.tutor.push({
          name: move,
          method: "tutor",
        });
      } else {
        processedMoves.other.push({
          name: move,
          method: "other",
        });
      }
    });

    // Sort level-up moves by level
    processedMoves.levelUp.sort((a, b) => (a.level || 0) - (b.level || 0));

    setOrganizeMoves(processedMoves);
  }, [moves]);

  // Calculate type defenses based on Pokémon types
  const calculateTypeDefenses = () => {
    const defenses: {
      [type: string]: { effectiveness: string; multiplier: number };
    } = {};

    // Initialize all types with neutral effectiveness
    Object.keys(typeEffectiveness).forEach((type) => {
      defenses[type] = { effectiveness: "neutral", multiplier: 1 };
    });

    // Apply each of the Pokémon's types to calculate resistances and weaknesses
    types.forEach((pokemonType) => {
      if (!typeEffectiveness[pokemonType as keyof typeof typeEffectiveness])
        return;

      const { weakTo, resistantTo, immuneTo } =
        typeEffectiveness[pokemonType as keyof typeof typeEffectiveness];

      // Apply weaknesses (2x damage)
      weakTo.forEach((type) => {
        if (defenses[type].effectiveness === "neutral") {
          defenses[type] = { effectiveness: "weak", multiplier: 2 };
        } else if (defenses[type].effectiveness === "weak") {
          defenses[type] = { effectiveness: "weak", multiplier: 4 }; // Double weakness (4x)
        } else if (defenses[type].effectiveness === "resistant") {
          defenses[type] = { effectiveness: "neutral", multiplier: 1 }; // Cancels out
        }
      });

      // Apply resistances (0.5x damage)
      resistantTo.forEach((type) => {
        if (defenses[type].effectiveness === "neutral") {
          defenses[type] = { effectiveness: "resistant", multiplier: 0.5 };
        } else if (defenses[type].effectiveness === "resistant") {
          defenses[type] = { effectiveness: "resistant", multiplier: 0.25 }; // Double resistance (0.25x)
        } else if (defenses[type].effectiveness === "weak") {
          defenses[type] = { effectiveness: "neutral", multiplier: 1 }; // Cancels out
        }
      });

      // Apply immunities (0x damage)
      immuneTo.forEach((type) => {
        defenses[type] = { effectiveness: "immune", multiplier: 0 };
      });
    });

    return defenses;
  };

  const typeDefenses = calculateTypeDefenses();

  return (
    <div style={{ padding: "16px 0" }}>
      {/* Type Defenses Section */}
      <S.TypeDefenseContainer>
        <Text as="h3" style={{ marginBottom: "16px" }}>
          Type Defenses
        </Text>
        <S.TypeDefenseDescription>
          The effectiveness of each type against{" "}
          {types.map((t) => t.charAt(0).toUpperCase() + t.slice(1)).join("/")}:
        </S.TypeDefenseDescription>

        <S.TypeDefenseGrid>
          {Object.entries(typeDefenses)
            .filter(([_, { effectiveness }]) => effectiveness !== "neutral")
            .sort((a, b) => {
              // Sort by effectiveness: weak > resistant > immune
              const order = { weak: 0, resistant: 1, immune: 2 };
              return (
                order[a[1].effectiveness as keyof typeof order] -
                order[b[1].effectiveness as keyof typeof order]
              );
            })
            .map(([type, { effectiveness, multiplier }]) => (
              <S.TypeEffectiveness key={type} effectiveness={effectiveness}>
                <S.TypeBadge>{type}</S.TypeBadge>
                <S.MultiplierBadge>
                  {multiplier === 0
                    ? "0×"
                    : multiplier === 0.25
                      ? "¼×"
                      : multiplier === 0.5
                        ? "½×"
                        : multiplier === 2
                          ? "2×"
                          : multiplier === 4
                            ? "4×"
                            : "1×"}
                </S.MultiplierBadge>
              </S.TypeEffectiveness>
            ))}
        </S.TypeDefenseGrid>
      </S.TypeDefenseContainer>

      {/* Move Pool Section */}
      <S.MovePoolContainer>
        <Text as="h3" style={{ marginBottom: "16px" }}>
          Move Pool
        </Text>

        {/* Level Up Moves */}
        {organizeMoves.levelUp.length > 0 && (
          <S.MoveCategory>
            <S.MoveCategoryTitle>
              <h4>Level Up</h4>
              <span className="count">{organizeMoves.levelUp.length}</span>
            </S.MoveCategoryTitle>
            <S.MoveGrid>
              {organizeMoves.levelUp.slice(0, 12).map((move, index) => (
                <S.MoveItem key={index}>
                  <div className="move-name">{move.name.replace("-", " ")}</div>
                  <div className="move-details">
                    <span>Level {move.level}</span>
                  </div>
                </S.MoveItem>
              ))}
              {organizeMoves.levelUp.length > 12 && (
                <S.MoreMovesItem>
                  +{organizeMoves.levelUp.length - 12} more
                </S.MoreMovesItem>
              )}
            </S.MoveGrid>
          </S.MoveCategory>
        )}

        {/* TM/HM Moves */}
        {organizeMoves.tm.length > 0 && (
          <S.MoveCategory>
            <S.MoveCategoryTitle>
              <h4>TM/HM</h4>
              <span className="count">{organizeMoves.tm.length}</span>
            </S.MoveCategoryTitle>
            <S.MoveGrid>
              {organizeMoves.tm.slice(0, 8).map((move, index) => (
                <S.MoveItem key={index}>
                  <div className="move-name">{move.name.replace("-", " ")}</div>
                </S.MoveItem>
              ))}
              {organizeMoves.tm.length > 8 && (
                <S.MoreMovesItem>
                  +{organizeMoves.tm.length - 8} more
                </S.MoreMovesItem>
              )}
            </S.MoveGrid>
          </S.MoveCategory>
        )}

        {/* Egg Moves */}
        {organizeMoves.egg.length > 0 && (
          <S.MoveCategory>
            <S.MoveCategoryTitle>
              <h4>Egg Moves</h4>
              <span className="count">{organizeMoves.egg.length}</span>
            </S.MoveCategoryTitle>
            <S.MoveGrid>
              {organizeMoves.egg.slice(0, 8).map((move, index) => (
                <S.MoveItem key={index}>
                  <div className="move-name">{move.name.replace("-", " ")}</div>
                </S.MoveItem>
              ))}
              {organizeMoves.egg.length > 8 && (
                <S.MoreMovesItem>
                  +{organizeMoves.egg.length - 8} more
                </S.MoreMovesItem>
              )}
            </S.MoveGrid>
          </S.MoveCategory>
        )}

        {/* Move Tutor */}
        {organizeMoves.tutor.length > 0 && (
          <S.MoveCategory>
            <S.MoveCategoryTitle>
              <h4>Move Tutor</h4>
              <span className="count">{organizeMoves.tutor.length}</span>
            </S.MoveCategoryTitle>
            <S.MoveGrid>
              {organizeMoves.tutor.slice(0, 8).map((move, index) => (
                <S.MoveItem key={index}>
                  <div className="move-name">{move.name.replace("-", " ")}</div>
                </S.MoveItem>
              ))}
              {organizeMoves.tutor.length > 8 && (
                <S.MoreMovesItem>
                  +{organizeMoves.tutor.length - 8} more
                </S.MoreMovesItem>
              )}
            </S.MoveGrid>
          </S.MoveCategory>
        )}
      </S.MovePoolContainer>
    </div>
  );
};

export default MovesTab;
