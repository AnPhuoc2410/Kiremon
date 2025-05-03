import React from 'react';
import { Text } from '../../../components/ui';
import * as S from './StatsTab.style';

interface StatsTabProps {
  stats: Array<{
    base_stat?: number;
    stat?: {
      name?: string;
    };
  }>;
}

// Function to get color for stats based on stat value
const getStatColor = (value: number) => {
  if (value < 50) return "#FB7185"; // Low stat - red
  if (value < 80) return "#FBBF24"; // Medium stat - yellow/orange
  if (value < 110) return "#34D399"; // Good stat - green
  return "#818CF8"; // Excellent stat - purple/blue
};

const StatsTab: React.FC<StatsTabProps> = ({ stats }) => {
  // Calculate total stats
  const totalStats = stats?.reduce((sum, stat) => sum + (stat.base_stat || 0), 0) || 0;

  return (
    <S.StatsContainer>
      <Text as="h3" style={{ marginBottom: '16px' }}>Base Stats</Text>

      {stats?.map((stat, index) => {
        const pokemonBaseStat = stat?.base_stat ?? 0;
        const pokemonStatName = stat?.stat?.name?.replace('-', ' ');
        const statColor = getStatColor(pokemonBaseStat);

        return (
          <S.StatItem key={index}>
            <S.StatName>{pokemonStatName}</S.StatName>
            <S.StatValue>{pokemonBaseStat}</S.StatValue>
            <S.StatBarContainer>
              <S.StatBar value={pokemonBaseStat} color={statColor} />
            </S.StatBarContainer>
          </S.StatItem>
        );
      })}

      <S.TotalStats>
        <S.StatLabel>Total:</S.StatLabel>
        <S.StatTotal>{totalStats}</S.StatTotal>
      </S.TotalStats>
    </S.StatsContainer>
  );
};

export default StatsTab;