import React, { useEffect, useRef, useState, useCallback } from "react";
import { Text, Button, Header } from "@/components/ui";
import { pokemonService } from "@/services";
import { sfx } from "@/components/utils/sfx";
import SEOWrapper from "@/components/ui/SEOWrapper";
import {
  GameContainer,
  ControlBar,
  StatPill,
  StageCard,
  SafariField,
  PokemonTargetWrapper,
  TargetRing,
  PokemonSprite,
  BallWobbleContainer,
  BallIconGraphic,
  AccuracyToast,
  BallSelectorDock,
  BallDockItem,
  CatchResultCard,
} from "./index.style";

const POKEMON_MAX_ID = 898;
const LEADERBOARD_KEY = "pokegames@catchLeaderboard";

type BallType = "poke" | "great" | "ultra" | "master";

interface BallInventory {
  great: number;
  ultra: number;
  master: number;
}

interface PokemonState {
  id: number;
  name: string;
  spriteUrl: string;
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function getRandomPokemonId() {
  return Math.floor(Math.random() * POKEMON_MAX_ID) + 1;
}

const CatchChallenge: React.FC = () => {
  const [pokemon, setPokemon] = useState<PokemonState | null>(null);
  const [loading, setLoading] = useState(true);

  // Position on field (0-100%)
  const [x, setX] = useState(50);
  const [y, setY] = useState(50);

  // Ball inventory & selection
  const [selectedBall, setSelectedBall] = useState<BallType>("poke");
  const [inventory, setInventory] = useState<BallInventory>({
    great: 5,
    ultra: 2,
    master: 0,
  });

  // Catch animation state: 'idle' | 'in-ball' | 'shake-1' | 'shake-2' | 'shake-3' | 'caught' | 'fled'
  const [catchState, setCatchState] = useState<string>("idle");
  const [wobblePosition, setWobblePosition] = useState<{
    x: number;
    y: number;
  }>({ x: 50, y: 50 });
  const [accuracyToast, setAccuracyToast] = useState<string | null>(null);

  // Scores
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState<number>(() =>
    Number(localStorage.getItem("pokegames@catchBest") || 0),
  );
  const [caughtHistory, setCaughtHistory] = useState<string[]>([]);

  const fieldRef = useRef<HTMLDivElement>(null);
  const moveTimer = useRef<number | null>(null);

  const loadRandomPokemon = useCallback(async () => {
    setLoading(true);
    setCatchState("idle");
    setAccuracyToast(null);

    try {
      const id = getRandomPokemonId();
      const details = await pokemonService.getPokemonDetail(id);
      if (details) {
        const sprite =
          details.sprites?.other?.["official-artwork"]?.front_default ||
          details.sprites?.front_default ||
          "";
        setPokemon({ id: details.id, name: details.name, spriteUrl: sprite });
      }
    } catch (error) {
      console.error("Failed to load Pokemon:", error);
    } finally {
      setLoading(false);
      setX(rand(25, 75));
      setY(rand(25, 75));
    }
  }, []);

  useEffect(() => {
    loadRandomPokemon();
  }, [loadRandomPokemon]);

  // Movement loop when not catching
  useEffect(() => {
    if (!pokemon || loading || catchState !== "idle") return;

    moveTimer.current = window.setInterval(() => {
      setX((prev) => Math.max(15, Math.min(85, prev + rand(-20, 20))));
      setY((prev) => Math.max(20, Math.min(80, prev + rand(-20, 20))));
    }, 900);

    return () => {
      if (moveTimer.current) window.clearInterval(moveTimer.current);
    };
  }, [pokemon, loading, catchState]);

  // Handle click on the field to throw Poké Ball
  const handleFieldClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (loading || catchState !== "idle" || !pokemon || !fieldRef.current)
      return;

    // Check inventory
    if (selectedBall !== "poke" && inventory[selectedBall] <= 0) {
      setSelectedBall("poke");
      return;
    }

    // Deduct ball
    if (selectedBall !== "poke") {
      setInventory((prev) => ({
        ...prev,
        [selectedBall]: Math.max(0, prev[selectedBall] - 1),
      }));
    }

    sfx.click();

    // Get click coords relative to field %
    const rect = fieldRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    // Distance to Pokemon center
    const dist = Math.hypot(clickX - x, clickY - y);

    let accuracyBonus = 0;
    let toast = "NICE!";

    if (dist < 8) {
      accuracyBonus = 0.35;
      toast = "🌟 EXCELLENT!";
    } else if (dist < 15) {
      accuracyBonus = 0.2;
      toast = "👍 GREAT!";
    } else if (dist < 26) {
      accuracyBonus = 0.08;
      toast = "NICE!";
    } else {
      // Missed throw
      setAccuracyToast("💨 MISSED!");
      setTimeout(() => setAccuracyToast(null), 1200);
      return;
    }

    setAccuracyToast(toast);
    setTimeout(() => setAccuracyToast(null), 1400);

    // Ball multiplier
    const ballMult =
      selectedBall === "master"
        ? 10.0
        : selectedBall === "ultra"
          ? 2.0
          : selectedBall === "great"
            ? 1.5
            : 1.0;

    // Catch chance formula
    const baseCatchRate = 0.38;
    const totalCatchChance = Math.min(
      0.95,
      (baseCatchRate + accuracyBonus) * ballMult,
    );
    const willCatch =
      selectedBall === "master" || Math.random() < totalCatchChance;

    // Start 3-shake wobble animation sequence
    setWobblePosition({ x, y });
    setCatchState("shake-left");
    sfx.tick();

    // Shake 1
    setTimeout(() => {
      setCatchState("shake-right");
      sfx.tick();
    }, 500);

    // Shake 2
    setTimeout(() => {
      setCatchState("shake-left");
      sfx.tick();
    }, 1000);

    // Shake 3 & resolution
    setTimeout(() => {
      if (willCatch) {
        setCatchState("gotcha");
        sfx.success();

        const earnedPoints = toast.includes("EXCELLENT")
          ? 300
          : toast.includes("GREAT")
            ? 200
            : 100;

        setScore((s) => s + earnedPoints);
        const newStreak = streak + 1;
        setStreak(newStreak);

        // Best streak tracking
        setBestStreak((b) => {
          const nextBest = Math.max(b, newStreak);
          localStorage.setItem("pokegames@catchBest", String(nextBest));
          return nextBest;
        });

        // Add to history
        setCaughtHistory((h) => [pokemon.name, ...h.slice(0, 9)]);

        // Reward extra balls for streaks
        if (newStreak % 3 === 0) {
          setInventory((inv) => ({
            ...inv,
            great: inv.great + 2,
            ultra: inv.ultra + 1,
            master: newStreak >= 10 ? inv.master + 1 : inv.master,
          }));
        }
      } else {
        setCatchState("fled");
        sfx.fail();
        setStreak(0);
      }
    }, 1500);
  };

  const handleReset = () => {
    sfx.click();
    setScore(0);
    setStreak(0);
    setInventory({ great: 5, ultra: 2, master: 0 });
    setSelectedBall("poke");
    setCaughtHistory([]);
    loadRandomPokemon();
  };

  return (
    <>
      <SEOWrapper
        title="Catch Challenge - Kiremon"
        description="Thử thách ném Pokéball trong Safari Zone. Nhắm chính xác Nice, Great, Excellent để bắt trọn Pokémon!"
      />
      <Header
        title="Catch Challenge"
        subtitle="Aim and click on the Pokémon to throw! Time your throw for an Excellent catch!"
        backTo="/"
      />
      <GameContainer>
        {/* Controls Bar */}
        <ControlBar>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <StatPill variant="fire">
              🔥 Streak: {streak} (Best: {bestStreak})
            </StatPill>
            <StatPill variant="score">⭐ {score} pts</StatPill>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <Button
              variant="light"
              onClick={loadRandomPokemon}
              disabled={catchState !== "idle"}
            >
              Skip
            </Button>
            <Button variant="dark" onClick={handleReset}>
              Reset Game
            </Button>
          </div>
        </ControlBar>

        {/* Stage Card */}
        <StageCard>
          {loading || !pokemon ? (
            <div
              style={{
                height: 340,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text>Searching in tall grass...</Text>
            </div>
          ) : (
            <>
              {/* Safari Catch Field */}
              <SafariField
                ref={fieldRef}
                onClick={handleFieldClick}
                isAiming={catchState === "idle"}
              >
                {accuracyToast && (
                  <AccuracyToast text={accuracyToast}>
                    {accuracyToast}
                  </AccuracyToast>
                )}

                {/* Pokemon Sprite & Target */}
                {catchState === "idle" && (
                  <PokemonTargetWrapper x={x} y={y}>
                    <TargetRing />
                    <PokemonSprite
                      src={pokemon.spriteUrl}
                      alt={pokemon.name}
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                    />
                  </PokemonTargetWrapper>
                )}

                {/* Wobbling Poké Ball */}
                {catchState !== "idle" && catchState !== "fled" && (
                  <BallWobbleContainer
                    x={wobblePosition.x}
                    y={wobblePosition.y}
                    wobbleState={catchState}
                  >
                    <BallIconGraphic ballType={selectedBall} />
                  </BallWobbleContainer>
                )}

                {/* Pokémon breaking free */}
                {catchState === "fled" && (
                  <PokemonTargetWrapper
                    x={wobblePosition.x}
                    y={wobblePosition.y}
                  >
                    <PokemonSprite
                      src={pokemon.spriteUrl}
                      alt={pokemon.name}
                      style={{ opacity: 0.8 }}
                    />
                  </PokemonTargetWrapper>
                )}
              </SafariField>

              {/* Ball Selector Dock */}
              <BallSelectorDock>
                <BallDockItem
                  isSelected={selectedBall === "poke"}
                  onClick={() => setSelectedBall("poke")}
                  disabled={catchState !== "idle"}
                >
                  <BallIconGraphic
                    ballType="poke"
                    style={{ width: 28, height: 28 }}
                  />
                  <span style={{ fontWeight: 700, fontSize: 13 }}>
                    Poké Ball
                  </span>
                  <span className="qty">∞</span>
                </BallDockItem>

                <BallDockItem
                  isSelected={selectedBall === "great"}
                  onClick={() => setSelectedBall("great")}
                  disabled={catchState !== "idle" || inventory.great <= 0}
                >
                  <BallIconGraphic
                    ballType="great"
                    style={{ width: 28, height: 28 }}
                  />
                  <span style={{ fontWeight: 700, fontSize: 13 }}>
                    Great Ball (1.5×)
                  </span>
                  <span className="qty">×{inventory.great}</span>
                </BallDockItem>

                <BallDockItem
                  isSelected={selectedBall === "ultra"}
                  onClick={() => setSelectedBall("ultra")}
                  disabled={catchState !== "idle" || inventory.ultra <= 0}
                >
                  <BallIconGraphic
                    ballType="ultra"
                    style={{ width: 28, height: 28 }}
                  />
                  <span style={{ fontWeight: 700, fontSize: 13 }}>
                    Ultra Ball (2.0×)
                  </span>
                  <span className="qty">×{inventory.ultra}</span>
                </BallDockItem>

                {inventory.master > 0 && (
                  <BallDockItem
                    isSelected={selectedBall === "master"}
                    onClick={() => setSelectedBall("master")}
                    disabled={catchState !== "idle"}
                  >
                    <BallIconGraphic
                      ballType="master"
                      style={{ width: 28, height: 28 }}
                    />
                    <span style={{ fontWeight: 700, fontSize: 13 }}>
                      Master Ball
                    </span>
                    <span className="qty">×{inventory.master}</span>
                  </BallDockItem>
                )}
              </BallSelectorDock>

              {/* Catch Results / Feedback */}
              {catchState === "gotcha" && (
                <CatchResultCard status="caught">
                  <Text
                    as="h3"
                    style={{
                      margin: 0,
                      color: "#065f46",
                      textTransform: "capitalize",
                    }}
                  >
                    ⭐ Gotcha! {pokemon.name.replace(/-/g, " ").toUpperCase()}{" "}
                    was caught!
                  </Text>
                  <div style={{ marginTop: 12 }}>
                    <Button variant="sky" onClick={loadRandomPokemon}>
                      Find Next Pokémon
                    </Button>
                  </div>
                </CatchResultCard>
              )}

              {catchState === "fled" && (
                <CatchResultCard status="fled">
                  <Text as="h3" style={{ margin: 0, color: "#991b1b" }}>
                    💨 Oh no! The Pokémon broke free!
                  </Text>
                  <div style={{ marginTop: 12 }}>
                    <Button variant="sky" onClick={loadRandomPokemon}>
                      Try Another Pokémon
                    </Button>
                  </div>
                </CatchResultCard>
              )}

              {/* Caught summary list */}
              {caughtHistory.length > 0 && (
                <div
                  style={{ marginTop: 20, width: "100%", textAlign: "left" }}
                >
                  <Text
                    as="span"
                    style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}
                  >
                    RECENTLY CAUGHT:
                  </Text>
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      flexWrap: "wrap",
                      marginTop: 4,
                    }}
                  >
                    {caughtHistory.map((name, i) => (
                      <span
                        key={`${name}-${i}`}
                        style={{
                          background: "#f1f5f9",
                          borderRadius: 6,
                          padding: "2px 8px",
                          fontSize: 12,
                          textTransform: "capitalize",
                          fontWeight: 600,
                        }}
                      >
                        {name.replace(/-/g, " ")}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </StageCard>
      </GameContainer>
    </>
  );
};

export default CatchChallenge;
