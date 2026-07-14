import React, { useEffect, useRef, useState } from "react";
import { Text, Button, Header } from "@/components/ui";
import { pokemonService } from "@/services";
import {
  Field,
  GameCard,
  GameContainer,
  PokemonSprite,
  ThrowArea,
} from "./index.style";
import { sfx } from "@/components/utils/sfx";

// Pokémon gen 1-8 range (stable sprites)
const POKEMON_MAX_ID = 898;

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function getRandomPokemonId() {
  return Math.floor(Math.random() * POKEMON_MAX_ID) + 1;
}

const LEADERBOARD_KEY = "pokegames@catchLeaderboard";
const INITIAL_THROWS = 5;

interface PokemonState {
  name: string;
  spriteUrl: string;
}

const CatchChallenge: React.FC = () => {
  const [pokemon, setPokemon] = useState<PokemonState | null>(null);
  const [loading, setLoading] = useState(true);
  const [x, setX] = useState(50);
  const [y, setY] = useState(50);
  const [score, setScore] = useState(0);
  const [throws, setThrows] = useState(INITIAL_THROWS);
  const [timeLeft, setTimeLeft] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState<number>(() =>
    Number(localStorage.getItem("pokegames@catchBest") || 0),
  );
  const moveTimer = useRef<number | null>(null);

  const difficulty =
    (localStorage.getItem("pokegames@difficulty") as
      | "easy"
      | "normal"
      | "hard") || "normal";

  const speed = difficulty === "easy" ? 900 : difficulty === "hard" ? 500 : 700;
  const questionTime =
    difficulty === "easy" ? 20 : difficulty === "hard" ? 12 : 16;

  const saveLeaderboard = (newScore: number) => {
    try {
      const list = JSON.parse(
        localStorage.getItem(LEADERBOARD_KEY) || "[]",
      ) as Array<{ score: number; date: string; difficulty: string }>;
      list.push({
        score: newScore,
        date: new Date().toISOString(),
        difficulty,
      });
      list.sort((a, b) => b.score - a.score);
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(list.slice(0, 20)));
    } catch {}
  };

  const loadRandomPokemon = async () => {
    setLoading(true);
    try {
      const id = getRandomPokemonId();
      const details = await pokemonService.getPokemonDetail(id);
      if (details) {
        const sprite =
          details.sprites?.other?.["official-artwork"]?.front_default ||
          details.sprites?.front_default ||
          "";
        setPokemon({ name: details.name, spriteUrl: sprite });
      }
    } catch (error) {
      console.error("Failed to load Pokemon:", error);
    } finally {
      setLoading(false);
      setX(50);
      setY(50);
      setTimeLeft(questionTime);
    }
  };

  useEffect(() => {
    loadRandomPokemon();
  }, []);

  // Move Pokémon using CSS transition — setState interval at `speed` ms
  useEffect(() => {
    if (!pokemon || loading) return;
    moveTimer.current = window.setInterval(() => {
      setX((v) => Math.max(10, Math.min(90, v + rand(-15, 15))));
      setY((v) => Math.max(10, Math.min(90, v + rand(-15, 15))));
    }, speed);
    return () => {
      if (moveTimer.current) window.clearInterval(moveTimer.current);
    };
  }, [pokemon, loading, speed]);

  // Countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    const id = setTimeout(() => {
      setTimeLeft((t) => t - 1);
      sfx.tick();
    }, 1000);
    return () => clearTimeout(id);
  }, [timeLeft]);

  // Timeout → fail round
  useEffect(() => {
    if (timeLeft === 0 && !loading && pokemon) {
      sfx.fail();
      setStreak(0);
      saveLeaderboard(score);
      setThrows(INITIAL_THROWS);
      loadRandomPokemon();
    }
  }, [timeLeft]);

  const tryCatch = () => {
    if (throws <= 0) return;
    const remaining = throws - 1;
    setThrows(remaining);
    sfx.click();

    const dx = Math.abs(x - 50) / 50;
    const dy = Math.abs(y - 50) / 50;
    const distanceFactor = 1 - Math.min(1, Math.sqrt(dx * dx + dy * dy));
    const base =
      difficulty === "easy" ? 0.45 : difficulty === "hard" ? 0.25 : 0.35;
    const chance = base + distanceFactor * 0.5;

    if (Math.random() < chance) {
      sfx.success();
      const newScore = score + 1;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      setBest((b) => {
        const nb = Math.max(b, newStreak);
        localStorage.setItem("pokegames@catchBest", String(nb));
        return nb;
      });
      setThrows(INITIAL_THROWS);
      loadRandomPokemon();
    } else if (remaining === 0) {
      sfx.fail();
      setStreak(0);
      saveLeaderboard(score);
    }
  };

  const handleReset = () => {
    setScore(0);
    setThrows(INITIAL_THROWS);
    setStreak(0);
    setTimeLeft(questionTime);
  };

  return (
    <>
      <Header
        title="Catch Challenge"
        subtitle="Throw Poké Balls to catch the moving Pokémon!"
        backTo="/"
      />
      <GameContainer>
        <GameCard className="pxl-border">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <Text>Score: {score}</Text>
            <Text>
              Streak: {streak} (Best {best})
            </Text>
            <Text>Time: {timeLeft}s</Text>
            <Text>Poké Balls: {throws}</Text>
          </div>

          {loading || !pokemon ? (
            <Text>Loading...</Text>
          ) : (
            <>
              <Field className="pxl-border">
                {pokemon.spriteUrl && (
                  <PokemonSprite
                    src={pokemon.spriteUrl}
                    x={x}
                    y={y}
                    alt={pokemon.name}
                  />
                )}
              </Field>

              <ThrowArea>
                <Button variant="sky" onClick={tryCatch} disabled={throws <= 0}>
                  Throw Poké Ball
                </Button>
                <Button variant="light" onClick={loadRandomPokemon}>
                  Skip
                </Button>
                <Button variant="dark" onClick={handleReset}>
                  Reset
                </Button>
              </ThrowArea>
            </>
          )}
        </GameCard>
      </GameContainer>
    </>
  );
};

export default CatchChallenge;
