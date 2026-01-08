import React, { useEffect, useRef, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Text, Button } from "../../components/ui";
import { pokemonService } from "../../services";
import { IPokemon } from "../../types/pokemon";
import {
  Field,
  GameCard,
  GameContainer,
  PokemonSprite,
  ThrowArea,
} from "./index.style";
import { sfx } from "../../components/utils/sfx";

interface GamePokemon extends IPokemon {
  sprites?: {
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const LEADERBOARD_KEY = "pokegames@catchLeaderboard";

const CatchChallenge: React.FC = () => {
  const [pokemon, setPokemon] = useState<GamePokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [x, setX] = useState(50);
  const [y, setY] = useState(50);
  const [score, setScore] = useState(0);
  const [throws, setThrows] = useState(5);
  const [timeLeft, setTimeLeft] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState<number>(() =>
    Number(localStorage.getItem("pokegames@catchBest") || 0),
  );
  const timer = useRef<number | null>(null);
  const difficulty =
    (localStorage.getItem("pokegames@difficulty") as
      | "easy"
      | "normal"
      | "hard") || "normal";

  const speed = difficulty === "easy" ? 800 : difficulty === "hard" ? 500 : 700; // ms interval
  const questionTime =
    difficulty === "easy" ? 20 : difficulty === "hard" ? 12 : 16; // seconds

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
    const response = await pokemonService.getAllPokemon(200, 0);
    if (response.results.length) {
      const random =
        response.results[Math.floor(Math.random() * response.results.length)];
      const details = await pokemonService.getPokemonDetail(random.name);
      setPokemon({ ...random, id: details?.id, sprites: details?.sprites });
    }
    setLoading(false);
    setX(50);
    setY(50);
    setTimeLeft(questionTime);
  };

  useEffect(() => {
    loadRandomPokemon();
  }, []);

  useEffect(() => {
    if (!pokemon) return;
    // Move Pokémon around
    timer.current = window.setInterval(() => {
      setX((v) => Math.max(10, Math.min(90, v + rand(-15, 15))));
      setY((v) => Math.max(10, Math.min(90, v + rand(-15, 15))));
    }, speed);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [pokemon, speed]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const id = setTimeout(() => {
      setTimeLeft((t) => t - 1);
      sfx.tick();
    }, 1000);
    return () => clearTimeout(id);
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && !loading) {
      sfx.fail();
      setStreak(0);
      saveLeaderboard(score);
      // auto next
      setThrows(5);
      loadRandomPokemon();
    }
  }, [timeLeft]);

  const tryCatch = () => {
    if (throws <= 0) return;
    setThrows((t) => t - 1);
    sfx.click();
    // Simple catch formula: closer to center increases chance
    const dx = Math.abs(x - 50) / 50;
    const dy = Math.abs(y - 50) / 50;
    const distanceFactor = 1 - Math.min(1, Math.sqrt(dx * dx + dy * dy)); // 0..1
    const base =
      difficulty === "easy" ? 0.45 : difficulty === "hard" ? 0.25 : 0.35;
    const chance = base + distanceFactor * 0.5; // up to ~95%
    if (Math.random() < chance) {
      sfx.success();
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
      setThrows(5);
      loadRandomPokemon();
    } else if (throws - 1 === 0) {
      sfx.fail();
      setStreak(0);
      saveLeaderboard(score);
    }
  };

  return (
    <GameContainer>
      <Text as="h1" variant="outlined" size="xl">
        Catch Challenge
      </Text>
      <GameCard className="pxl-border">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 8,
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
              {pokemon.sprites?.other?.["official-artwork"].front_default && (
                <PokemonSprite
                  src={pokemon.sprites.other["official-artwork"].front_default}
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
              <Button
                variant="dark"
                onClick={() => {
                  setScore(0);
                  setThrows(5);
                  setStreak(0);
                  setTimeLeft(questionTime);
                }}
              >
                Reset
              </Button>
            </ThrowArea>
          </>
        )}
      </GameCard>
    </GameContainer>
  );
};

export default CatchChallenge;
