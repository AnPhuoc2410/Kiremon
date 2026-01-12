import React from "react";
import { Text } from "../../../components/ui";
import * as S from "./TrainingTab.style";
import Divider from "../../../components/ui/Divider";

interface TrainingTabProps {
  stats: Array<{
    stat: { name: string };
    base_stat: number;
    effort: number;
  }>;
  baseExperience: number;
  captureRate: number;
  baseHappiness: number;
  growthRate: string;
}

const TrainingTab: React.FC<TrainingTabProps> = ({
  stats,
  baseExperience,
  captureRate,
  baseHappiness,
  growthRate,
}) => {
  // Calculate total EVs
  const totalEVs = stats.reduce((sum, stat) => sum + (stat.effort || 0), 0);

  // Get EVs that are greater than 0
  const evYields = stats
    .filter((stat) => stat.effort > 0)
    .map((stat) => ({
      name: stat.stat.name,
      value: stat.effort,
    }));

  return (
    <S.Container>
      {/* EV Yield Section */}
      <S.Section>
        <S.SectionTitle>
          <Text as="h3">EV Yield</Text>
        </S.SectionTitle>
        <S.Card>
          {evYields.length > 0 ? (
            <S.EVGrid>
              {evYields.map((ev, index) => (
                <S.EVItem key={index}>
                  <S.EVName>{ev.name.replace("-", " ")}</S.EVName>
                  <S.EVValue>+{ev.value} EV</S.EVValue>
                </S.EVItem>
              ))}
              <S.EVTotal>
                <Text>Total EVs:</Text>
                <Text style={{ fontWeight: "bold", fontSize: "1.25rem" }}>
                  {totalEVs}
                </Text>
              </S.EVTotal>
            </S.EVGrid>
          ) : (
            <S.NoData>
              <Text>No EV yield from this Pokémon</Text>
            </S.NoData>
          )}
        </S.Card>
      </S.Section>

      <Divider variant="pokeball" />

      {/* Training Info Section */}
      <S.Section>
        <S.SectionTitle>
          <Text as="h3">Training Information</Text>
        </S.SectionTitle>
        <S.InfoGrid>
          <S.InfoCard>
            <S.InfoLabel>Base Experience</S.InfoLabel>
            <S.InfoValue>{baseExperience}</S.InfoValue>
            <S.InfoDescription>XP gained when defeated</S.InfoDescription>
          </S.InfoCard>

          <S.InfoCard>
            <S.InfoLabel>Capture Rate</S.InfoLabel>
            <S.InfoValue>{captureRate}</S.InfoValue>
            <S.CatchRateBar>
              <S.CatchRateFill rate={captureRate} />
            </S.CatchRateBar>
            <S.InfoDescription>
              {Math.round((captureRate / 255) * 100)}% at full health with
              Pokéball
            </S.InfoDescription>
          </S.InfoCard>

          <S.InfoCard>
            <S.InfoLabel>Base Happiness</S.InfoLabel>
            <S.InfoValue>{baseHappiness}</S.InfoValue>
            <S.HappinessBar>
              <S.HappinessFill happiness={baseHappiness} />
            </S.HappinessBar>
            <S.InfoDescription>Starting friendship level</S.InfoDescription>
          </S.InfoCard>

          <S.InfoCard>
            <S.InfoLabel>Growth Rate</S.InfoLabel>
            <S.GrowthRateBadge rate={growthRate}>
              {growthRate.replace("-", " ")}
              {/* Pixel Growth Curve Icon */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  marginLeft: "8px",
                  display: "inline-block",
                  verticalAlign: "text-bottom",
                }}
              >
                {/* Axes */}
                <path d="M2 22H22V20H4V2H2V22Z" fill="currentColor" />
                {/* Curve Points - Exponential-ish look */}
                <path
                  d="M6 18H8V16H6V18ZM8 16H10V14H8V16ZM10 14H12V11H10V14ZM12 11H14V8H12V11ZM14 8H16V4H14V8ZM16 4H18V2H16V4Z"
                  fill="currentColor"
                  fillOpacity="0.8"
                />
              </svg>
            </S.GrowthRateBadge>
            <S.InfoDescription>
              {getGrowthRateDescription(growthRate)}
            </S.InfoDescription>
          </S.InfoCard>
        </S.InfoGrid>
      </S.Section>
    </S.Container>
  );
};

// Helper function to get growth rate description
function getGrowthRateDescription(rate: string): string {
  const descriptions: Record<string, string> = {
    slow: "1,250,000 XP to level 100",
    medium: "1,000,000 XP to level 100",
    fast: "800,000 XP to level 100",
    "medium-slow": "1,059,860 XP to level 100",
    "slow-then-very-fast": "Varies (fluctuating)",
    "fast-then-very-slow": "Varies (fluctuating)",
  };
  return descriptions[rate] || "Experience needed to level up";
}

export default TrainingTab;
