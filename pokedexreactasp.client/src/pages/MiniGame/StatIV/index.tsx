import React, { useState, useEffect, useMemo } from "react";
import { Header, Text, Button } from "@/components/ui";
import { pokemonService } from "@/services";
import { IPokemonDetailResponse } from "@/types/pokemon";
import { sfx } from "@/components/utils/sfx";
import {
  GameContainer,
  GameCard,
  StatGrid,
  StatCard,
  PokemonImage,
  PillContainer,
  StatPill,
  RevealBadge,
  ScoreBoard,
  ScoreItem,
  ScoreLabel,
  ScoreValue,
} from "./index.style";
import { FlexCenter } from "@/styles";

const STATS = [
  { key: "hp", label: "HP", color: "#FF5959" },
  { key: "attack", label: "Atk", color: "#F5AC78" },
  { key: "defense", label: "Def", color: "#FAE078" },
  { key: "special-attack", label: "SpA", color: "#9DB7F5" },
  { key: "special-defense", label: "SpD", color: "#A7DB8D" },
  { key: "speed", label: "Spe", color: "#FA92B2" },
];

const POKEMON_MAX_ID = 898;

function getRandomPokemonId() {
  return Math.floor(Math.random() * POKEMON_MAX_ID) + 1;
}

// Calculate max score using brute force permutations (6! = 720)
function getPermutations(arr: string[]): string[][] {
  if (arr.length <= 1) return [arr];
  const result: string[][] = [];
  for (let i = 0; i < arr.length; i++) {
    const current = arr[i];
    const remaining = arr.slice(0, i).concat(arr.slice(i + 1));
    const remainingPerms = getPermutations(remaining);
    for (const perm of remainingPerms) {
      result.push([current, ...perm]);
    }
  }
  return result;
}

export const StatIV = () => {
  const [pokemons, setPokemons] = useState<IPokemonDetailResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [assignedStats, setAssignedStats] = useState<Record<number, string>>(
    {},
  );
  const [gameState, setGameState] = useState<"playing" | "revealed">("playing");

  const loadRandomPokemons = async () => {
    setLoading(true);
    setGameState("playing");
    setAssignedStats({});
    try {
      const promises = Array.from({ length: 6 }).map(() =>
        pokemonService.getPokemonDetail(getRandomPokemonId()),
      );
      const results = await Promise.all(promises);
      setPokemons(
        results.filter((p): p is IPokemonDetailResponse => p !== null),
      );
    } catch (error) {
      console.error("Failed to load pokemons", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRandomPokemons();
  }, []);

  const handleStatSelect = (pokemonIndex: number, statKey: string) => {
    if (gameState === "revealed") return;
    sfx.click();
    setAssignedStats((prev) => {
      const newStats = { ...prev };
      // If stat already used elsewhere, clear it from that pokemon
      Object.keys(newStats).forEach((key) => {
        if (newStats[Number(key)] === statKey) {
          delete newStats[Number(key)];
        }
      });
      // Toggle off if clicking same stat
      if (prev[pokemonIndex] === statKey) {
        delete newStats[pokemonIndex];
      } else {
        newStats[pokemonIndex] = statKey;
      }
      return newStats;
    });
  };

  const isStatUsed = (statKey: string) =>
    Object.values(assignedStats).includes(statKey);

  const handleSubmit = () => {
    if (Object.keys(assignedStats).length < 6) return;
    sfx.success();
    setGameState("revealed");
  };

  // Calculate scores
  const currentScore = useMemo(() => {
    let score = 0;
    Object.entries(assignedStats).forEach(([pIndex, statKey]) => {
      const pokemon = pokemons[Number(pIndex)];
      const statValue =
        pokemon?.stats.find((s) => s.stat.name === statKey)?.base_stat || 0;
      score += statValue;
    });
    return score;
  }, [assignedStats, pokemons]);

  const maxPossibleScore = useMemo(() => {
    if (pokemons.length < 6) return 0;
    const statKeys = STATS.map((s) => s.key);
    const perms = getPermutations(statKeys);
    let max = 0;

    for (const perm of perms) {
      let sum = 0;
      for (let i = 0; i < 6; i++) {
        const statValue =
          pokemons[i].stats.find((s) => s.stat.name === perm[i])?.base_stat ||
          0;
        sum += statValue;
      }
      if (sum > max) max = sum;
    }
    return max;
  }, [pokemons]);

  return (
    <>
      <Header
        title="Stat Optimizer"
        subtitle="Pick a different stat for each Pokémon so that together they add up to the highest possible sum."
        backTo="/"
      />
      <GameContainer>
        <GameCard className="pxl-border">
          {loading ? (
            <FlexCenter style={{ height: 400 }}>
              <Text>Loading Pokémon...</Text>
            </FlexCenter>
          ) : (
            <>
              {gameState === "revealed" && (
                <ScoreBoard>
                  <ScoreItem>
                    <ScoreLabel>Your Total Score</ScoreLabel>
                    <ScoreValue highlight={currentScore === maxPossibleScore}>
                      {currentScore}
                    </ScoreValue>
                  </ScoreItem>
                  <ScoreItem>
                    <ScoreLabel>Best Possible Score</ScoreLabel>
                    <ScoreValue>{maxPossibleScore}</ScoreValue>
                  </ScoreItem>
                </ScoreBoard>
              )}

              <StatGrid>
                {pokemons.map((pokemon, index) => {
                  const sprite =
                    pokemon.sprites?.other?.["official-artwork"]
                      ?.front_default || pokemon.sprites?.front_default;
                  const selectedStatKey = assignedStats[index];
                  const actualStatValue =
                    gameState === "revealed" && selectedStatKey
                      ? pokemon.stats.find(
                          (s) => s.stat.name === selectedStatKey,
                        )?.base_stat
                      : null;

                  return (
                    <StatCard key={index} isComplete={!!selectedStatKey}>
                      <PokemonImage src={sprite} alt={pokemon.name} />
                      <Text
                        style={{
                          textTransform: "capitalize",
                          fontWeight: "bold",
                        }}
                      >
                        {pokemon.name}
                      </Text>

                      {gameState === "revealed" && actualStatValue !== null && (
                        <RevealBadge>{actualStatValue}</RevealBadge>
                      )}

                      <PillContainer>
                        {STATS.map((stat) => {
                          const isSelected = selectedStatKey === stat.key;
                          const isUsedByOther =
                            isStatUsed(stat.key) && !isSelected;

                          return (
                            <StatPill
                              key={stat.key}
                              isSelected={isSelected}
                              isDisabled={
                                isUsedByOther || gameState === "revealed"
                              }
                              colorHex={stat.color}
                              onClick={() => handleStatSelect(index, stat.key)}
                            >
                              {stat.label}
                            </StatPill>
                          );
                        })}
                      </PillContainer>
                    </StatCard>
                  );
                })}
              </StatGrid>

              <FlexCenter style={{ gap: 16, marginTop: 16 }}>
                {gameState === "playing" ? (
                  <Button
                    variant="sky"
                    onClick={handleSubmit}
                    disabled={Object.keys(assignedStats).length < 6}
                    style={{ width: 200 }}
                  >
                    Submit
                  </Button>
                ) : (
                  <Button
                    variant="sky"
                    onClick={loadRandomPokemons}
                    style={{ width: 200 }}
                  >
                    Play Again
                  </Button>
                )}
              </FlexCenter>
            </>
          )}
        </GameCard>
      </GameContainer>
    </>
  );
};

export default StatIV;
