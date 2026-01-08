import React, { useEffect, useMemo, useState } from "react";
import { Text, Button } from "../../components/ui";
import TypeIcon from "../../components/ui/Card/TypeIcon";
import { typesService } from "../../services";
import { IPokemonType } from "../../types/pokemon";
import {
  GameContainer,
  GameCard,
  OptionsGrid,
  OptionButton,
  ScoreBar,
} from "./index.style";
import { sfx } from "../../components/utils/sfx";

const EFFECT_OPTIONS = [2, 1, 0.5, 0];
const LEADERBOARD_KEY = "pokegames@typeLeaderboard";

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const TypeMatchup: React.FC = () => {
  const [types, setTypes] = useState<IPokemonType[]>([]);
  const [attacking, setAttacking] = useState<IPokemonType | null>(null);
  const [defending, setDefending] = useState<IPokemonType | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [correct, setCorrect] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState<number>(() =>
    Number(localStorage.getItem("pokegames@typeBest") || 0),
  );
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const difficulty =
    (localStorage.getItem("pokegames@difficulty") as
      | "easy"
      | "normal"
      | "hard") || "normal";

  const questionTime = useMemo(
    () => (difficulty === "easy" ? 18 : difficulty === "hard" ? 8 : 12),
    [difficulty],
  );

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const all = await typesService.getAllTypesWithDetails();
      const filtered = all.filter(
        (t) => !["unknown", "shadow", "stellar"].includes(t.name),
      );
      setTypes(filtered);
      setLoading(false);
    };
    load();
  }, []);

  const computeMultiplier = (atk: IPokemonType, defName: string): number => {
    const dr = atk.damageRelations;
    const n = defName.toLowerCase();
    if (dr?.no_damage_to?.some((x) => x.name === n)) return 0;
    if (dr?.double_damage_to?.some((x) => x.name === n)) return 2;
    if (dr?.half_damage_to?.some((x) => x.name === n)) return 0.5;
    return 1;
  };

  const nextQuestion = () => {
    if (!types.length) return;
    const atk = pick(types);
    const def = pick(types);
    setAttacking(atk);
    setDefending(def);
    setSelected(null);
    setCorrect(null);
    setTimeLeft(questionTime);
  };

  useEffect(() => {
    if (!loading) nextQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  useEffect(() => {
    if (timeLeft <= 0 || selected !== null) return;
    const id = setTimeout(() => {
      setTimeLeft((t) => t - 1);
      sfx.tick();
    }, 1000);
    return () => clearTimeout(id);
  }, [timeLeft, selected]);

  useEffect(() => {
    if (
      timeLeft === 0 &&
      selected === null &&
      !loading &&
      attacking &&
      defending
    ) {
      // time out -> wrong
      handleSelect(-1);
    }
  }, [timeLeft]);

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

  const handleSelect = (opt: number) => {
    if (!attacking || !defending || selected !== null) return;
    const mult = computeMultiplier(attacking, defending.name);
    setSelected(opt);
    setCorrect(mult);
    setTotal((t) => t + 1);

    const isCorrect = opt === mult;
    if (isCorrect) {
      sfx.success();
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
    } else {
      sfx.fail();
      setStreak(0);
      saveLeaderboard(score);
    }

    // best streak
    setBest((b) => {
      const nb = Math.max(b, isCorrect ? streak + 1 : 0);
      localStorage.setItem("pokegames@typeBest", String(nb));
      return nb;
    });
  };

  return (
    <GameContainer>
      <Text as="h1" variant="outlined" size="xl">
        Type Matchup Quiz
      </Text>
      <GameCard className="pxl-border">
        {loading || !attacking || !defending ? (
          <Text>Loading...</Text>
        ) : (
          <>
            <ScoreBar>
              <Text as="span">
                Score: {score} / {total}
              </Text>
              <Text as="span">
                Streak: {streak} (Best {best})
              </Text>
              <Text as="span">Time: {timeLeft}s</Text>
              <Button
                variant="light"
                onClick={() => {
                  setScore(0);
                  setTotal(0);
                  setStreak(0);
                  nextQuestion();
                }}
              >
                Reset
              </Button>
            </ScoreBar>

            <div style={{ marginTop: 12 }}>
              <Text as="h3">If an attack of type</Text>
              <div
                style={{
                  display: "inline-flex",
                  gap: 8,
                  alignItems: "center",
                  marginTop: 4,
                }}
              >
                <TypeIcon type={attacking.name} />
                <Text as="span">hits a</Text>
                <TypeIcon type={defending.name} />
                <Text as="span">Pokémon, what's the effectiveness?</Text>
              </div>
            </div>

            <OptionsGrid>
              {EFFECT_OPTIONS.map((v) => (
                <OptionButton
                  key={v}
                  onClick={() => {
                    sfx.click();
                    handleSelect(v);
                  }}
                  correct={selected !== null && v === correct}
                  wrong={selected !== null && v === selected && v !== correct}
                  className="pxl-border"
                >
                  {v === 2
                    ? "Super effective (2x)"
                    : v === 1
                      ? "Normal (1x)"
                      : v === 0.5
                        ? "Not very effective (0.5x)"
                        : "No effect (0x)"}
                </OptionButton>
              ))}
            </OptionsGrid>

            {selected !== null && (
              <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                <Button variant="sky" onClick={nextQuestion}>
                  Next Question
                </Button>
              </div>
            )}
          </>
        )}
      </GameCard>
    </GameContainer>
  );
};

export default TypeMatchup;
