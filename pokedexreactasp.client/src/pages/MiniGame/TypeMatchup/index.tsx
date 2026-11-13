import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Text, Button, Header } from "@/components/ui";
import TypeIcon from "@/components/ui/Card/TypeIcon";
import { typesService } from "@/services";
import { IPokemonType } from "@/types/pokemon";
import { sfx } from "@/components/utils/sfx";
import SEOWrapper from "@/components/ui/SEOWrapper";
import {
  GameContainer,
  ControlBar,
  ModeButtonGroup,
  ModeTabBtn,
  ScoreBar,
  StatPill,
  ArenaCard,
  TimerTrack,
  TimerFill,
  MatchupStage,
  CombatantBox,
  VsBadge,
  OptionsGrid,
  OptionButton,
  FeedbackBanner,
} from "./index.style";

const SINGLE_OPTIONS = [2, 1, 0.5, 0];
const DUAL_OPTIONS = [4, 2, 1, 0.5, 0.25, 0];
const LEADERBOARD_KEY = "pokegames@typeLeaderboard";

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const getEffectLabel = (v: number): string => {
  if (v === 4) return "Ultra Effective (4×)";
  if (v === 2) return "Super Effective (2×)";
  if (v === 1) return "Regular Damage (1×)";
  if (v === 0.5) return "Not Very Effective (0.5×)";
  if (v === 0.25) return "Barely Tickles (0.25×)";
  return "No Effect / Immune (0×)";
};

const TypeMatchup: React.FC = () => {
  const [types, setTypes] = useState<IPokemonType[]>([]);
  const [mode, setMode] = useState<"single" | "dual">("single");

  const [attacking, setAttacking] = useState<IPokemonType | null>(null);
  const [defendingPrimary, setDefendingPrimary] = useState<IPokemonType | null>(
    null,
  );
  const [defendingSecondary, setDefendingSecondary] =
    useState<IPokemonType | null>(null);

  const [selected, setSelected] = useState<number | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);

  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState<number>(() =>
    Number(localStorage.getItem("pokegames@typeBest") || 0),
  );

  const maxTime = mode === "dual" ? 16 : 12;
  const [timeLeft, setTimeLeft] = useState<number>(maxTime);
  const [loading, setLoading] = useState(true);

  // Load all types
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

  const computeSingleMultiplier = (
    atk: IPokemonType,
    defName: string,
  ): number => {
    const dr = atk.damageRelations;
    if (!dr) return 1;
    const n = defName.toLowerCase();
    if (dr?.no_damage_to?.some((x) => x.name === n)) return 0;
    if (dr?.double_damage_to?.some((x) => x.name === n)) return 2;
    if (dr?.half_damage_to?.some((x) => x.name === n)) return 0.5;
    return 1;
  };

  const nextQuestion = useCallback(() => {
    if (!types.length) return;

    const atk = pick(types);
    const def1 = pick(types);
    let def2: IPokemonType | null = null;

    if (mode === "dual") {
      const candidates = types.filter((t) => t.name !== def1.name);
      def2 = pick(candidates);
    }

    setAttacking(atk);
    setDefendingPrimary(def1);
    setDefendingSecondary(def2);
    setSelected(null);
    setCorrectAnswer(null);
    setTimeLeft(maxTime);
  }, [types, mode, maxTime]);

  useEffect(() => {
    if (!loading && types.length > 0) {
      nextQuestion();
    }
  }, [loading, mode, nextQuestion]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0 || selected !== null) return;
    const timer = setTimeout(() => {
      setTimeLeft((t) => t - 1);
      if (timeLeft <= 4) sfx.tick();
    }, 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, selected]);

  const saveLeaderboard = (finalScore: number) => {
    try {
      const list = JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || "[]");
      list.push({
        score: finalScore,
        date: new Date().toISOString(),
        mode,
      });
      list.sort((a: any, b: any) => b.score - a.score);
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(list.slice(0, 20)));
    } catch {}
  };

  const handleSelect = useCallback(
    (chosenOpt: number) => {
      if (!attacking || !defendingPrimary || selected !== null) return;

      let mult = computeSingleMultiplier(attacking, defendingPrimary.name);
      if (mode === "dual" && defendingSecondary) {
        mult *= computeSingleMultiplier(attacking, defendingSecondary.name);
      }

      setSelected(chosenOpt);
      setCorrectAnswer(mult);
      setTotal((t) => t + 1);

      const isRight = chosenOpt === mult;
      if (isRight) {
        sfx.success();
        setScore((s) => s + (mode === "dual" ? 150 : 100));
        const newStreak = streak + 1;
        setStreak(newStreak);
        setBestStreak((b) => {
          const nb = Math.max(b, newStreak);
          localStorage.setItem("pokegames@typeBest", String(nb));
          return nb;
        });
      } else {
        sfx.fail();
        setStreak(0);
        saveLeaderboard(score);
      }
    },
    [
      attacking,
      defendingPrimary,
      defendingSecondary,
      selected,
      mode,
      streak,
      score,
    ],
  );

  // Time expired -> counts as wrong
  useEffect(() => {
    if (
      timeLeft === 0 &&
      selected === null &&
      !loading &&
      attacking &&
      defendingPrimary
    ) {
      handleSelect(-1);
    }
  }, [timeLeft, selected, loading, attacking, defendingPrimary, handleSelect]);

  const handleReset = () => {
    sfx.click();
    setScore(0);
    setTotal(0);
    setStreak(0);
    nextQuestion();
  };

  const optionsList = useMemo(
    () => (mode === "dual" ? DUAL_OPTIONS : SINGLE_OPTIONS),
    [mode],
  );

  // Keyboard controls: 1..6 and Space/Enter
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (selected !== null && (e.key === " " || e.key === "Enter")) {
        e.preventDefault();
        nextQuestion();
        return;
      }

      if (selected === null) {
        const num = parseInt(e.key, 10);
        if (!isNaN(num) && num >= 1 && num <= optionsList.length) {
          e.preventDefault();
          handleSelect(optionsList[num - 1]);
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selected, optionsList, handleSelect, nextQuestion]);

  const pct = Math.max(0, Math.min(100, (timeLeft / maxTime) * 100));

  return (
    <>
      <SEOWrapper
        title="Type Matchup Quiz - Kiremon"
        description="Luyện tập tương khắc hệ Pokémon chuyên sâu. Hỗ trợ chế độ Hệ Đơn và Hệ Kép (Dual-Type), bấm phím 1-6 cực nhanh!"
      />
      <Header
        title="Type Matchup Quiz"
        subtitle="Master Pokémon damage relations! Single & Dual defending types supported."
        backTo="/"
      />
      <GameContainer>
        {/* Controls Bar */}
        <ControlBar>
          <ModeButtonGroup>
            <ModeTabBtn
              isActive={mode === "single"}
              onClick={() => {
                sfx.click();
                setMode("single");
              }}
            >
              Single Type Defender
            </ModeTabBtn>
            <ModeTabBtn
              isActive={mode === "dual"}
              onClick={() => {
                sfx.click();
                setMode("dual");
              }}
            >
              Dual Type (Pro)
            </ModeTabBtn>
          </ModeButtonGroup>

          <ScoreBar>
            <StatPill variant="fire">
              🔥 Streak: {streak} (Best: {bestStreak})
            </StatPill>
            <StatPill variant="gold">
              ⭐ {score} pts (
              {score > 0 && total > 0 ? Math.round((streak / total) * 100) : 0}
              %)
            </StatPill>
            <Button
              variant="light"
              onClick={handleReset}
              style={{ padding: "6px 12px" }}
            >
              Reset
            </Button>
          </ScoreBar>
        </ControlBar>

        {/* Main Quiz Arena */}
        <ArenaCard>
          {loading || !attacking || !defendingPrimary ? (
            <div
              style={{
                height: 260,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text>Loading Type Data...</Text>
            </div>
          ) : (
            <>
              {/* Timer Bar */}
              <TimerTrack>
                <TimerFill pct={pct} isUrgent={timeLeft <= 4} />
              </TimerTrack>

              <Text
                as="h3"
                style={{ margin: "4px 0 16px", color: "#475569", fontSize: 16 }}
              >
                What happens when this attack hits the target?
              </Text>

              {/* Matchup Showdown Stage */}
              <MatchupStage>
                <CombatantBox role="attack">
                  <span className="label">⚡ Move Attack</span>
                  <TypeIcon type={attacking.name} />
                </CombatantBox>

                <VsBadge>VS</VsBadge>

                <CombatantBox role="defend">
                  <span className="label">🛡️ Defender Type</span>
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      flexWrap: "wrap",
                      justifyContent: "center",
                    }}
                  >
                    <TypeIcon type={defendingPrimary.name} />
                    {defendingSecondary && (
                      <TypeIcon type={defendingSecondary.name} />
                    )}
                  </div>
                </CombatantBox>
              </MatchupStage>

              {/* Options */}
              <OptionsGrid>
                {optionsList.map((val, idx) => (
                  <OptionButton
                    key={val}
                    onClick={() => {
                      sfx.click();
                      handleSelect(val);
                    }}
                    correct={selected !== null && val === correctAnswer}
                    wrong={
                      selected !== null &&
                      val === selected &&
                      val !== correctAnswer
                    }
                    disabled={selected !== null}
                  >
                    <span>{getEffectLabel(val)}</span>
                    <span className="key-tag">{idx + 1}</span>
                  </OptionButton>
                ))}
              </OptionsGrid>

              {/* Answer Banner */}
              {selected !== null && (
                <>
                  <FeedbackBanner isCorrect={selected === correctAnswer}>
                    <Text as="h4" style={{ margin: 0, fontSize: 18 }}>
                      {selected === correctAnswer
                        ? "🎉 Correct!"
                        : "❌ Incorrect!"}{" "}
                      Effective Multiplier:{" "}
                      <strong>
                        {correctAnswer !== null
                          ? getEffectLabel(correctAnswer)
                          : ""}
                      </strong>
                    </Text>
                  </FeedbackBanner>

                  <div style={{ marginTop: 16 }}>
                    <Button variant="sky" onClick={nextQuestion}>
                      Next Question (Press Space)
                    </Button>
                  </div>
                </>
              )}
            </>
          )}
        </ArenaCard>
      </GameContainer>
    </>
  );
};

export default TypeMatchup;
