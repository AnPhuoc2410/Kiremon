import styled from "@emotion/styled";
import { colors, units } from "../../components/utils";

export const Container = styled.div({
  padding: "0 16px",
  marginBottom: "60px",
  "@media (min-width: 1024px)": {
    padding: "0 128px",
  },
});

export const Header = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  margin: "16px 0",
});

export const TabsContainer = styled.div({
  display: "flex",
  width: "100%",
  marginBottom: "1rem",
  borderBottom: `1px solid ${colors["gray-300"]}`,
  overflowX: "auto",
  position: "sticky",
  top: 0,
  background: "#fff",
  zIndex: 10
});

export const Tab = styled.div<{ active?: boolean }>(({ active }) => ({
  padding: "0.75rem 1.25rem",
  cursor: "pointer",
  borderBottom: active ? `3px solid ${colors["sky-500"]}` : "3px solid transparent",
  color: active ? colors["sky-600"] : colors["gray-600"],
  fontWeight: active ? 600 : 400,
  transition: "all 0.2s",
  whiteSpace: "nowrap",

  "&:hover": {
    color: active ? colors["sky-600"] : colors["gray-800"],
    borderBottom: active ? `3px solid ${colors["sky-500"]}` : `3px solid ${colors["gray-300"]}`
  }
}));

export const TeamSection = styled.div({
  marginBottom: "2rem",
});

export const TeamHeader = styled.div({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "1rem"
});

export const TeamTitle = styled.h3({
  fontSize: "1.25rem",
  fontWeight: 600,
  margin: 0
});

export const PokemonGrid = styled.div({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
  gap: "1rem"
});

export const TeamSlot = styled.div<{ isEmpty?: boolean }>(({ isEmpty }) => ({
  borderRadius: "8px",
  padding: "1rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  background: isEmpty ? colors["gray-100"] : "white",
  border: `2px dashed ${isEmpty ? colors["gray-300"] : colors["sky-300"]}`,
  minHeight: "200px",
  cursor: "pointer",
  transition: "all 0.2s",
  position: "relative",
  boxShadow: isEmpty ? "none" : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",

  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: isEmpty
      ? "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)"
      : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
  }
}));

export const PokemonActions = styled.div({
  position: "absolute",
  top: "0.5rem",
  right: "0.5rem",
  display: "flex",
  gap: "0.5rem"
});

export const ActionButton = styled.button({
  background: "transparent",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0.25rem",
  borderRadius: "50%",
  transition: "all 0.2s",

  "&:hover": {
    background: colors["gray-200"]
  }
});

export const TypeBadge = styled.span<{ type: string }>(({ type }) => {
  const typeColors: Record<string, { bg: string, text: string }> = {
    normal: { bg: "#A8A77A", text: "#fff" },
    fire: { bg: "#EE8130", text: "#fff" },
    water: { bg: "#6390F0", text: "#fff" },
    electric: { bg: "#F7D02C", text: "#000" },
    grass: { bg: "#7AC74C", text: "#fff" },
    ice: { bg: "#96D9D6", text: "#000" },
    fighting: { bg: "#C22E28", text: "#fff" },
    poison: { bg: "#A33EA1", text: "#fff" },
    ground: { bg: "#E2BF65", text: "#000" },
    flying: { bg: "#A98FF3", text: "#fff" },
    psychic: { bg: "#F95587", text: "#fff" },
    bug: { bg: "#A6B91A", text: "#fff" },
    rock: { bg: "#B6A136", text: "#fff" },
    ghost: { bg: "#735797", text: "#fff" },
    dragon: { bg: "#6F35FC", text: "#fff" },
    dark: { bg: "#705746", text: "#fff" },
    steel: { bg: "#B7B7CE", text: "#000" },
    fairy: { bg: "#D685AD", text: "#fff" }
  };

  const colorInfo = typeColors[type.toLowerCase()] || { bg: "#777", text: "#fff" };

  return {
    display: "inline-block",
    padding: "0.25rem 0.5rem",
    borderRadius: "4px",
    fontSize: "0.75rem",
    fontWeight: 600,
    textTransform: "uppercase",
    backgroundColor: colorInfo.bg,
    color: colorInfo.text,
    margin: "0.25rem"
  };
});

export const StatsContainer = styled.div({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "1rem",
  marginTop: "1rem"
});

export const StatCard = styled.div({
  padding: "1rem",
  borderRadius: "8px",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  background: "white"
});

export const StatBar = styled.div<{ value: number, max?: number }>(({ value, max = 255 }) => {
  const percentage = Math.min((value / max) * 100, 100);
  let color = colors["red-500"];

  if (value >= 80) color = colors["green-500"];
  else if (value >= 50) color = colors["yellow-500"];

  return {
    height: "8px",
    width: "100%",
    backgroundColor: colors["gray-200"],
    borderRadius: "4px",
    marginTop: "4px",
    position: "relative",

    "&::after": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      height: "100%",
      width: `${percentage}%`,
      backgroundColor: color,
      borderRadius: "4px",
      transition: "width 0.5s ease"
    }
  };
});

export const StatRow = styled.div({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "0.5rem"
});

export const StatLabel = styled.span({
  fontWeight: 500,
  fontSize: "0.875rem",
  color: colors["gray-700"]
});

export const StatValue = styled.span({
  fontWeight: 600,
  color: colors["gray-900"]
});

export const MovesContainer = styled.div({
  marginTop: "1rem"
});

export const MovesList = styled.div({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
  gap: "0.5rem"
});

export const MoveItem = styled.div<{ selected?: boolean }>(({ selected }) => ({
  padding: "0.5rem",
  borderRadius: "4px",
  border: `1px solid ${selected ? colors["sky-500"] : colors["gray-300"]}`,
  backgroundColor: selected ? colors["sky-100"] : "white",
  cursor: "pointer",

  "&:hover": {
    borderColor: colors["sky-400"],
    backgroundColor: colors["gray-100"]
  }
}));

export const EmptyState = styled.div({
  padding: "2rem",
  textAlign: "center",
  color: colors["gray-500"],
  margin: "2rem 0"
});

export const ButtonsContainer = styled.div({
  display: "flex",
  gap: "1rem",
  marginTop: "1rem",
  flexWrap: "wrap"
});

export const Modal = styled.div({
  padding: "1.5rem",
  maxWidth: "500px",
  width: "100%"
});

export const CombatSimulatorContainer = styled.div({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "2rem",
  marginTop: "2rem",

  "@media (max-width: 768px)": {
    gridTemplateColumns: "1fr",
  }
});

export const TeamSide = styled.div({
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
});

export const BattleLog = styled.div({
  marginTop: "1rem",
  padding: "1rem",
  maxHeight: "300px",
  overflowY: "auto",
  border: `1px solid ${colors["gray-300"]}`,
  borderRadius: "8px",
  fontSize: "0.875rem",
  lineHeight: 1.5
});

export const LogEntry = styled.div<{ type?: 'attack' | 'info' | 'critical' | 'heal' }>(({ type }) => {
  let textColor;

  switch (type) {
    case 'attack':
      textColor = colors["red-600"];
      break;
    case 'critical':
      textColor = colors["orange-600"];
      break;
    case 'heal':
      textColor = colors["green-600"];
      break;
    case 'info':
    default:
      textColor = colors["gray-700"];
  }

  return {
    padding: "0.25rem 0",
    color: textColor
  };
});
