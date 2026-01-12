import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Text } from "../../../components/ui";
import * as S from "./StatsTab.style";

interface StatsTabProps {
  stats: Array<{
    base_stat?: number;
    stat?: {
      name?: string;
    };
  }>;
  color?: string;
}

// Function to get color for stats based on stat value
const getStatColor = (value: number) => {
  if (value < 50) return "#FB7185"; // Low stat - red
  if (value < 80) return "#FBBF24"; // Medium stat - yellow/orange
  if (value < 110) return "#34D399"; // Good stat - green
  return "#818CF8"; // Excellent stat - purple/blue
};

// Custom square pixel dot for Radar Chart
const CustomPixelDot = (props: any) => {
  const { cx, cy, stroke } = props;
  return (
    <rect
      x={cx - 3}
      y={cy - 3}
      width={6}
      height={6}
      fill={stroke}
      strokeWidth={0}
    />
  );
};

// Custom Tooltip
const CustomTooltip = ({ active, payload, color }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          border: `2px solid ${color}`,
          padding: "8px 12px",
          fontFamily: "'Press Start 2P', cursive, sans-serif", // Assuming pixel font exists or falls back
          fontSize: "10px",
          boxShadow: "4px 4px 0px rgba(0,0,0,0.1)",
        }}
      >
        <p
          style={{
            margin: 0,
            fontWeight: "bold",
            textTransform: "capitalize",
            fontSize: "12px",
          }}
        >
          {data.subject?.replace("-", " ")}
        </p>
        <p style={{ margin: "4px 0 0", color: color, fontSize: "12px" }}>
          Value: {data.value}
        </p>
      </div>
    );
  }
  return null;
};

const StatsTab: React.FC<StatsTabProps> = ({ stats, color = "#34D399" }) => {
  // Calculate total stats
  const totalStats =
    stats?.reduce((sum, stat) => sum + (stat.base_stat || 0), 0) || 0;

  // Prepare data for Radar Chart
  const chartData = stats?.map((stat) => ({
    subject: stat.stat?.name,
    value: stat.base_stat || 0,
    fullMark: 255,
  }));

  const formatStatName = (name?: string) => {
    if (!name) return "";
    switch (name) {
      case "hp":
        return "HP";
      case "attack":
        return "Atk";
      case "defense":
        return "Def";
      case "special-attack":
        return "SpA";
      case "special-defense":
        return "SpD";
      case "speed":
        return "Spe";
      default:
        return name;
    }
  };

  return (
    <S.StatsContainer>
      <S.StatsList>
        <Text as="h3" style={{ marginBottom: "16px" }}>
          Base Stats
        </Text>

        {stats?.map((stat, index) => {
          const pokemonBaseStat = stat?.base_stat ?? 0;
          const pokemonStatName = stat?.stat?.name?.replace("-", " ");
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
      </S.StatsList>

      <S.ChartContainer>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis
              dataKey="subject"
              tickFormatter={formatStatName}
              tick={{
                fill: "#4b5563",
                fontSize: 10,
                fontWeight: 600,
                fontFamily: "'Press Start 2P', cursive, sans-serif",
              }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 150]}
              tick={false}
              axisLine={false}
            />
            <Radar
              name="Stats"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fill={color}
              fillOpacity={0.4}
              dot={<CustomPixelDot />}
            />
            <Tooltip
              content={<CustomTooltip color={color} />}
              cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: "4 4" }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </S.ChartContainer>
    </S.StatsContainer>
  );
};

export default StatsTab;
