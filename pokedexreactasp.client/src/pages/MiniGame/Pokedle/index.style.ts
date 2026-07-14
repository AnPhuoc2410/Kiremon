import styled from "@emotion/styled";
import { FlexColumn, FlexRow, FlexCenter } from "@/styles";
import { colors } from "@/components/utils";
import { keyframes } from "@emotion/react";

export const GameContainer = styled(FlexColumn)`
  align-items: center;
  padding: 16px;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  gap: 24px;
`;

export const GameCard = styled(FlexColumn)`
  background-color: white;
  border-radius: 16px;
  padding: 24px;
  width: 100%;
  gap: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: relative;
`;

export const HeaderArea = styled(FlexRow)`
  justify-content: space-between;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
  gap: 16px;
`;

export const ModeSwitch = styled(FlexRow)`
  background: ${colors.background.light};
  border-radius: 20px;
  padding: 4px;
  gap: 4px;
`;

export const ModeButton = styled.button<{ isActive: boolean }>`
  padding: 8px 16px;
  border-radius: 16px;
  border: none;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${({ isActive }) =>
    isActive ? colors.primary[500] : "transparent"};
  color: ${({ isActive }) => (isActive ? "white" : colors.text.secondary)};

  &:hover {
    color: ${({ isActive }) => (!isActive ? colors.text.primary : "white")};
  }
`;

export const GuessButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 14px 24px;
  border-radius: 12px;
  border: 2px solid ${colors.primary[500]};
  background: ${colors.primary[500]};
  color: white;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${colors.primary[600]};
    border-color: ${colors.primary[600]};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

/* ── Search Modal ───────────────────────────────────────── */

export const SearchModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

export const SearchModalPanel = styled.div`
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 700px;
  height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

export const SearchModalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid ${colors["gray-200"]};
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;

  input {
    flex: 1;
  }

  button {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: ${colors["gray-500"]};
    padding: 4px 8px;
    border-radius: 8px;
    transition: background 0.15s ease;

    &:hover {
      background: ${colors["gray-100"]};
      color: ${colors["gray-900"]};
    }
  }
`;

export const SearchModalGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 12px;
  padding: 16px;
`;

/* ── Guess Results Grid ─────────────────────────────────── */

export const GridContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  padding-bottom: 16px;
`;

export const GridTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 600px;
`;

export const GridHeader = styled.div`
  display: grid;
  grid-template-columns: 80px repeat(6, 1fr);
  gap: 8px;
  padding: 0 8px;

  span {
    font-size: 12px;
    font-weight: bold;
    text-transform: uppercase;
    color: ${colors.text.secondary};
    text-align: center;
  }
`;

export const GridRow = styled.div`
  display: grid;
  grid-template-columns: 80px repeat(6, 1fr);
  gap: 8px;
`;

export const TileCell = styled(FlexCenter)<{
  status?: "correct" | "partial" | "incorrect" | "default";
}>`
  background: ${({ status }) => {
    switch (status) {
      case "correct":
        return "#4ADE80";
      case "partial":
        return "#FBBF24";
      case "incorrect":
        return "#F87171";
      default:
        return colors.background.light;
    }
  }};
  color: ${({ status }) =>
    status && status !== "default" ? "white" : colors.text.primary};
  border-radius: 8px;
  height: 80px;
  padding: 8px;
  font-weight: bold;
  font-size: 14px;
  text-align: center;
  border: 2px solid
    ${({ status }) =>
      status && status !== "default" ? "transparent" : colors["gray-200"]};
  text-transform: capitalize;
  transition: all 0.3s ease;
  flex-direction: column;
  gap: 4px;

  img {
    width: 60px;
    height: 60px;
    object-fit: contain;
  }

  .arrow {
    font-size: 18px;
  }
`;

export const WinOverlay = styled(FlexCenter)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(6px);
  z-index: 2000;
`;

const popIn = keyframes`
  from { opacity: 0; transform: scale(0.8) translateY(20px); }
  to   { opacity: 1; transform: scale(1)   translateY(0);    }
`;

export const WinCard = styled(FlexColumn)`
  background: white;
  padding: 40px 48px;
  border-radius: 20px;
  align-items: center;
  text-align: center;
  gap: 16px;
  border: 2px solid #4ade80;
  box-shadow:
    0 0 60px rgba(74, 222, 128, 0.35),
    0 20px 60px rgba(0, 0, 0, 0.3);
  animation: ${popIn} 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  max-width: 380px;
  width: 90%;

  img {
    width: 150px;
    height: 150px;
    filter: drop-shadow(0 8px 20px rgba(74, 222, 128, 0.4));
  }

  h2 {
    color: #4ade80;
    margin: 0;
    font-size: 28px;
  }

  strong {
    color: ${colors.primary[500]};
  }

  p {
    margin: 0;
    color: ${colors.text.secondary};
  }
`;

/* ── Filter Bar (inside Search Modal) ───────────────────── */

export const FilterBar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 16px;
  border-bottom: 1px solid ${colors["gray-200"]};
  background: ${colors.background.light};
`;

export const FilterSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const FilterLabel = styled.span`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: ${colors.text.secondary};
  min-width: 32px;
`;

export const FilterChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

/** Pokémon type → badge colour map */
const TYPE_COLORS: Record<string, string> = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

export const FilterChip = styled.button<{
  isActive: boolean;
  typeColor?: string;
}>`
  padding: 4px 10px;
  border-radius: 20px;
  border: 1.5px solid
    ${({ isActive, typeColor }) =>
      isActive
        ? typeColor
          ? (TYPE_COLORS[typeColor] ?? colors.primary[500])
          : colors.primary[500]
        : colors["gray-200"]};
  background: ${({ isActive, typeColor }) =>
    isActive
      ? typeColor
        ? (TYPE_COLORS[typeColor] ?? colors.primary[500])
        : colors.primary[500]
      : "white"};
  color: ${({ isActive }) => (isActive ? "white" : colors.text.secondary)};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  text-transform: capitalize;
  transition: all 0.15s ease;
  line-height: 1;

  &:hover {
    border-color: ${({ typeColor }) =>
      typeColor
        ? (TYPE_COLORS[typeColor] ?? colors.primary[500])
        : colors.primary[500]};
    color: ${({ isActive, typeColor }) =>
      isActive
        ? "white"
        : typeColor
          ? (TYPE_COLORS[typeColor] ?? colors.primary[500])
          : colors.primary[500]};
  }
`;

export const ClearFilters = styled.button`
  align-self: flex-end;
  background: none;
  border: none;
  font-size: 12px;
  color: ${colors.primary[500]};
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 6px;
  font-weight: 600;

  &:hover {
    background: ${colors.primary[500] ?? "#ede9fe"};
  }
`;
