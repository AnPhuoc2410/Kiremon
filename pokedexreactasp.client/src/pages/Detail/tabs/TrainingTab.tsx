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
