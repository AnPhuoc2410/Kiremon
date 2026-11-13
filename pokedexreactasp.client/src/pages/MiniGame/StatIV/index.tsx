import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { Header, Text, Button } from "@/components/ui";
import { pokemonService } from "@/services";
import { IPokemonDetailResponse } from "@/types/pokemon";
import { sfx } from "@/components/utils/sfx";
import SEOWrapper from "@/components/ui/SEOWrapper";
import {
  GameContainer,
  ControlBar,
  StatTray,
  StatPillList,
  StatDockPill,
  PokemonGrid,
  PokemonCard,
  PokemonImg,
  SlotButton,
  StatBarList,
  StatBarRow,
  BarTrack,
  BarFill,
  NativeDialog,
  ModalContent,
} from "./index.style";

const STATS = [
  { key: "hp", label: "HP", color: "#ef4444" },
  { key: "attack", label: "Attack", color: "#f97316" },
  { key: "defense", label: "Defense", color: "#eab308" },
  { key: "special-attack", label: "Sp. Atk", color: "#3b82f6" },
  { key: "special-defense", label: "Sp. Def", color: "#10b981" },
  { key: "speed", label: "Speed", color: "#ec4899" },
];

const POKEMON_MAX_ID = 898;

function getRandomPokemonId() {
  return Math.floor(Math.random() * POKEMON_MAX_ID) + 1;
}

// Calculate max possible score using brute-force permutations (6! = 720)
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

export const StatIV: React.FC = () => {
  const [pokemons, setPokemons] = useState<IPokemonDetailResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Active selected stat in tray to assign on click
  const [activeStatInTray, setActiveStatInTray] = useState<string>("hp");

  // Map of pokemonIndex (0-5) -> statKey ("hp", "attack", ...)
  const [assignedStats, setAssignedStats] = useState<Record<number, string>>(
    {},
  );
  const [gameState, setGameState] = useState<"playing" | "revealed">("playing");

  const dialogRef = useRef<HTMLDialogElement>(null);

  // Fallback for browsers without closedby support per modern-web-guidance
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (!("closedBy" in HTMLDialogElement.prototype)) {
      const handleBackdropClick = (event: MouseEvent) => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const isDialogContent =
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width;

        if (!isDialogContent) {
          dialog.close();
        }
      };
      dialog.addEventListener("click", handleBackdropClick);
      return () => dialog.removeEventListener("click", handleBackdropClick);
    }
  }, []);

  const loadRandomPokemons = useCallback(async () => {
    setLoading(true);
    setGameState("playing");
    setAssignedStats({});
    setActiveStatInTray("hp");

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
  }, []);

  useEffect(() => {
    loadRandomPokemons();
  }, [loadRandomPokemons]);

  // Click on a stat pill in the dock
  const handleSelectTrayStat = (statKey: string) => {
    sfx.click();
    setActiveStatInTray(statKey);
  };

  // Click on a Pokémon card slot
  const handleAssignToPokemon = (pokemonIndex: number) => {
    if (gameState === "revealed") return;
    sfx.click();

    setAssignedStats((prev) => {
      const next = { ...prev };
      const currentAssignedToThis = next[pokemonIndex];

      // If clicked with currently active stat that's already here, unassign
      if (currentAssignedToThis === activeStatInTray) {
        delete next[pokemonIndex];
        return next;
      }

      // If active stat was assigned elsewhere, remove from that pokemon
      Object.keys(next).forEach((key) => {
        if (next[Number(key)] === activeStatInTray) {
          delete next[Number(key)];
        }
      });

      next[pokemonIndex] = activeStatInTray;

      // Automatically advance active tray stat to next unassigned stat
      const allAssigned = Object.values(next);
      const nextUnassigned = STATS.find((s) => !allAssigned.includes(s.key));
      if (nextUnassigned) {
        setActiveStatInTray(nextUnassigned.key);
      }

      return next;
    });
  };

  // Submit and calculate
  const handleSubmit = () => {
    if (Object.keys(assignedStats).length < 6) return;
    sfx.success();
    setGameState("revealed");
    dialogRef.current?.showModal();
  };

  // Player's score
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

  // Max theoretical score
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

  const optimalityPct =
    maxPossibleScore > 0
      ? Math.round((currentScore / maxPossibleScore) * 1000) / 10
      : 0;

  const rank =
    optimalityPct >= 96
      ? { grade: "S", title: "Poké Professor 🏆", color: "#f59e0b" }
      : optimalityPct >= 88
        ? { grade: "A", title: "Gym Leader 🥇", color: "#10b981" }
        : optimalityPct >= 75
          ? { grade: "B", title: "Ace Trainer 🥈", color: "#3b82f6" }
          : { grade: "C", title: "Novice Camper 🏕️", color: "#64748b" };

  return (
    <>
      <SEOWrapper
        title="Stat Optimizer - Kiremon"
        description="Giải đố tối ưu hoá chỉ số cơ bản của 6 Pokémon. Ghép đúng chỉ số cao nhất cho từng Pokémon để đạt điểm tối ưu!"
      />
      <Header
        title="Stat Optimizer"
        subtitle="6 Pokémon, 6 base stats. Match each Pokémon to the stat it excels at to maximize your team score!"
        backTo="/"
      />
      <GameContainer>
        {/* Controls Bar */}
        <ControlBar>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Text
              as="span"
              style={{ fontWeight: 800, fontSize: 15, color: "#1e293b" }}
            >
              Assigned: {Object.keys(assignedStats).length} / 6
            </Text>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            {gameState === "playing" ? (
              <Button
                variant="sky"
                onClick={handleSubmit}
                disabled={Object.keys(assignedStats).length < 6}
              >
                Calculate Optimization
              </Button>
            ) : (
              <>
                <Button
                  variant="sky"
                  onClick={() => dialogRef.current?.showModal()}
                >
                  View Score Report
                </Button>
                <Button variant="light" onClick={loadRandomPokemons}>
                  New Puzzle
                </Button>
              </>
            )}
          </div>
        </ControlBar>

        {/* Stat Tray */}
        <StatTray>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              as="span"
              style={{ fontSize: 13, fontWeight: 700, color: "#475569" }}
            >
              1. SELECT A STAT:
            </Text>
            <Text as="span" style={{ fontSize: 12, color: "#64748b" }}>
              Click a stat, then click a Pokémon card to assign it.
            </Text>
          </div>
          <StatPillList>
            {STATS.map((stat) => {
              const isAssigned = Object.values(assignedStats).includes(
                stat.key,
              );
              const isActive = activeStatInTray === stat.key;
              return (
                <StatDockPill
                  key={stat.key}
                  colorHex={stat.color}
                  isAssigned={isAssigned}
                  isActive={isActive}
                  onClick={() => handleSelectTrayStat(stat.key)}
                >
                  <span className="dot" />
                  <span>{stat.label}</span>
                  {isAssigned && <span style={{ fontSize: 11 }}>✓</span>}
                </StatDockPill>
              );
            })}
          </StatPillList>
        </StatTray>

        {/* 6 Pokemon Cards Grid */}
        {loading ? (
          <div
            style={{
              height: 350,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text>Generating 6 Random Pokémon...</Text>
          </div>
        ) : (
          <PokemonGrid>
            {pokemons.map((pokemon, idx) => {
              const assignedStatKey = assignedStats[idx];
              const assignedStatObj = STATS.find(
                (s) => s.key === assignedStatKey,
              );
              const sprite =
                pokemon.sprites?.other?.["official-artwork"]?.front_default ||
                pokemon.sprites?.front_default;

              return (
                <PokemonCard
                  key={pokemon.id || idx}
                  isAssigned={Boolean(assignedStatKey)}
                  colorHex={assignedStatObj?.color}
                >
                  <PokemonImg src={sprite} alt={pokemon.name} />
                  <Text
                    as="h4"
                    style={{
                      margin: 0,
                      textTransform: "capitalize",
                      fontSize: 16,
                    }}
                  >
                    {pokemon.name.replace(/-/g, " ")}
                  </Text>

                  {/* Slot button */}
                  <SlotButton
                    isAssigned={Boolean(assignedStatKey)}
                    colorHex={assignedStatObj?.color}
                    onClick={() => handleAssignToPokemon(idx)}
                    disabled={gameState === "revealed"}
                  >
                    <span>
                      {assignedStatObj
                        ? `Slot: ${assignedStatObj.label}`
                        : "Click to assign active stat"}
                    </span>
                    <span>{assignedStatObj ? "✓" : "+"}</span>
                  </SlotButton>

                  {/* Revealed Stats Bars */}
                  {gameState === "revealed" && (
                    <StatBarList>
                      {STATS.map((s) => {
                        const val =
                          pokemon.stats.find((item) => item.stat.name === s.key)
                            ?.base_stat || 0;
                        const isTarget = assignedStatKey === s.key;
                        const pct = Math.min(100, (val / 160) * 100);

                        return (
                          <StatBarRow key={s.key} isTarget={isTarget}>
                            <span style={{ width: 50 }}>{s.label}</span>
                            <BarTrack>
                              <BarFill
                                widthPct={pct}
                                colorHex={s.color}
                                isTarget={isTarget}
                              />
                            </BarTrack>
                            <span className="val">{val}</span>
                          </StatBarRow>
                        );
                      })}
                    </StatBarList>
                  )}
                </PokemonCard>
              );
            })}
          </PokemonGrid>
        )}

        {/* Results Modal using native <dialog> per modern-web-guidance */}
        <NativeDialog
          ref={dialogRef}
          aria-labelledby="results-title"
          {...({ closedby: "any" } as any)}
        >
          <ModalContent>
            <div style={{ fontSize: 44, marginBottom: 8 }}>
              {rank.grade === "S" ? "🏆" : "⚡"}
            </div>
            <h2
              id="results-title"
              style={{ margin: "0 0 6px", fontSize: 24, color: rank.color }}
            >
              Rank {rank.grade}: {rank.title}
            </h2>
            <Text style={{ color: "#64748b", margin: "0 0 20px" }}>
              Your Optimization Efficiency: <strong>{optimalityPct}%</strong>
            </Text>

            <div
              style={{
                display: "flex",
                gap: 20,
                background: "#f8fafc",
                padding: "16px 24px",
                borderRadius: 12,
                marginBottom: 24,
                width: "100%",
                justifyContent: "space-around",
              }}
            >
              <div>
                <div
                  style={{ fontSize: 12, color: "#64748b", fontWeight: 700 }}
                >
                  YOUR SCORE
                </div>
                <div
                  style={{ fontSize: 26, fontWeight: 900, color: "#0f172a" }}
                >
                  {currentScore}
                </div>
              </div>
              <div style={{ borderLeft: "2px solid #e2e8f0" }} />
              <div>
                <div
                  style={{ fontSize: 12, color: "#64748b", fontWeight: 700 }}
                >
                  MAX POSSIBLE
                </div>
                <div
                  style={{ fontSize: 26, fontWeight: 900, color: "#10b981" }}
                >
                  {maxPossibleScore}
                </div>
              </div>
            </div>

            <form method="dialog" style={{ display: "flex", gap: 10 }}>
              <Button type="submit" variant="light">
                Close & Review Board
              </Button>
              <Button
                type="button"
                variant="sky"
                onClick={() => {
                  dialogRef.current?.close();
                  loadRandomPokemons();
                }}
              >
                Play Another Round
              </Button>
            </form>
          </ModalContent>
        </NativeDialog>
      </GameContainer>
    </>
  );
};

export default StatIV;
