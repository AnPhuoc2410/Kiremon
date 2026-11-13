import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header, Text, Button } from "@/components/ui";
import SEOWrapper from "@/components/ui/SEOWrapper";
import { sfx } from "@/components/utils/sfx";
import {
  ArcadeContainer,
  HeroBanner,
  HeroTitle,
  HeroSubtitle,
  GamesGrid,
  GameCard,
  GameCardTop,
  GameIconCircle,
  BadgeRow,
  TagBadge,
  GameTitle,
  GameDesc,
  CardFooter,
  ScoreRecord,
} from "./index.style";

interface GameInfo {
  id: string;
  title: string;
  desc: string;
  icon: string;
  path: string;
  themeColor: string;
  tags: string[];
  bestKey?: string;
  scoreLabel?: string;
}

const ARCADE_GAMES: GameInfo[] = [
  {
    id: "whos-that",
    title: "Who's That Pokémon?",
    desc: "Guess the mystery Pokémon from its shadow silhouette. Choose casual 4-choice mode or speed keyboard typing with hints & gen filters!",
    icon: "🕵️",
    path: "/games/whos-that-pokemon",
    themeColor: "#0284c7",
    tags: ["Trivia", "Keys 1-4", "Gen 1-8"],
    bestKey: "pokegames@whosThatBest",
    scoreLabel: "Best Streak",
  },
  {
    id: "type-matchup",
    title: "Type Matchup Quiz",
    desc: "Train battle effectiveness and type matchups! Test your expertise with Single Type and Dual-Type defender combinations.",
    icon: "⚔️",
    path: "/games/type-matchup",
    themeColor: "#ea580c",
    tags: ["Battle", "Dual-Type", "Speed Run"],
    bestKey: "pokegames@typeBest",
    scoreLabel: "Best Streak",
  },
  {
    id: "catch-challenge",
    title: "Catch Challenge",
    desc: "Safari Zone target throw game! Aim carefully, gauge Pokémon movement, and throw Poké Balls, Great Balls, and Ultra Balls for Excellent catches.",
    icon: "🎯",
    path: "/games/catch-challenge",
    themeColor: "#16a34a",
    tags: ["Action", "Accuracy", "Safari Zone"],
    bestKey: "pokegames@catchBest",
    scoreLabel: "Best Streak",
  },
  {
    id: "stat-optimizer",
    title: "Stat Optimizer",
    desc: "Strategic stat puzzle: Assign 6 core Pokémon base stats (HP, Atk, Def, SpA, SpD, Spe) to maximize your theoretical team power score.",
    icon: "📊",
    path: "/games/stat-optimizer",
    themeColor: "#9333ea",
    tags: ["Strategy", "Puzzle", "Base Stats"],
  },
  {
    id: "pokedle",
    title: "Pokedle",
    desc: "The classic daily & unlimited Pokémon Wordle! Guess mystery Pokémon using Generation, Types, Color, and Evolution stage clues.",
    icon: "🧩",
    path: "/games/pokedle",
    themeColor: "#059669",
    tags: ["Daily", "Wordle", "Gen Clues"],
  },
  {
    id: "combat-team",
    title: "Combat Team Arena",
    desc: "Draft your dream Pokémon battle party, customize movesets, and compete in team combat challenges.",
    icon: "🏆",
    path: "/games/combat-team",
    themeColor: "#dc2626",
    tags: ["Team Builder", "Combat", "Competitive"],
  },
];

const ArcadeHub: React.FC = () => {
  const navigate = useNavigate();
  const [bests, setBests] = useState<Record<string, number>>({});

  useEffect(() => {
    const scores: Record<string, number> = {};
    ARCADE_GAMES.forEach((g) => {
      if (g.bestKey) {
        scores[g.id] = Number(localStorage.getItem(g.bestKey) || 0);
      }
    });
    setBests(scores);
  }, []);

  const handleLaunch = (path: string) => {
    sfx.click();
    navigate(path);
  };

  return (
    <>
      <SEOWrapper
        title="Arcade Mini-Games - Kiremon"
        description="Bộ sưu tập Mini Games Pokémon: Who's That Pokémon, Type Matchup, Catch Challenge, Stat Optimizer, Pokedle và Combat Team!"
      />
      <Header
        title="Pokémon Arcade"
        subtitle="Challenge your Pokémon battle knowledge, speed, and accuracy in retro arcade games!"
        backTo="/"
      />
      <ArcadeContainer>
        {/* Hero Banner */}
        <HeroBanner>
          <HeroTitle>🎮 Kiremon Mini Games Arcade</HeroTitle>
          <HeroSubtitle>
            Put your Pokémon master instincts to the test! Earn streaks, beat
            your personal records, and hone your battle knowledge across 6
            custom-built arcade games.
          </HeroSubtitle>
        </HeroBanner>

        {/* Games Grid */}
        <GamesGrid>
          {ARCADE_GAMES.map((game) => (
            <GameCard key={game.id} themeColor={game.themeColor}>
              <GameCardTop>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <GameIconCircle themeColor={game.themeColor}>
                    {game.icon}
                  </GameIconCircle>
                  <BadgeRow>
                    {game.tags.map((t) => (
                      <TagBadge key={t}>{t}</TagBadge>
                    ))}
                  </BadgeRow>
                </div>

                <GameTitle>{game.title}</GameTitle>
                <GameDesc>{game.desc}</GameDesc>
              </GameCardTop>

              <CardFooter>
                {game.bestKey && (
                  <ScoreRecord>
                    <span className="label">{game.scoreLabel}:</span>
                    <span>🔥 {bests[game.id] || 0}</span>
                  </ScoreRecord>
                )}

                <Button
                  variant="sky"
                  onClick={() => handleLaunch(game.path)}
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  Play Game →
                </Button>
              </CardFooter>
            </GameCard>
          ))}
        </GamesGrid>
      </ArcadeContainer>
    </>
  );
};

export default ArcadeHub;
