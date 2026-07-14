import styled from "@emotion/styled";
import { colors } from "@/components/utils";
import {
  Container as BaseContainer,
  FlexBetween,
  TabsContainer as BaseTabsContainer,
  Tab as BaseTab,
  SlotCard,
  ActionButton as BaseActionButton,
  EmptyState as BaseEmptyState,
  GridContainer,
  ProgressBar,
} from "@/styles";

// ============ LAYOUT ============
export const Container = styled(BaseContainer)`
  padding: 0 16px;
  margin-bottom: 120px;

  @media (min-width: 1024px) {
    padding: 0 128px;
  }
`;

export const Header = styled(FlexBetween)`
  margin: 16px 0;
`;

// ============ TABS ============
export const TabsContainer = BaseTabsContainer;

export const Tab = styled(BaseTab)<{ active?: boolean }>`
  border-bottom: ${(props) =>
    props.active ? `3px solid ${colors["sky-500"]}` : "3px solid transparent"};
  color: ${(props) => (props.active ? colors["sky-600"] : colors["gray-600"])};
  font-weight: ${(props) => (props.active ? 600 : 400)};

  &:hover {
    color: ${(props) =>
      props.active ? colors["sky-600"] : colors["gray-800"]};
    border-bottom: ${(props) =>
      props.active
        ? `3px solid ${colors["sky-500"]}`
        : `3px solid ${colors["gray-300"]}`};
  }
`;

// ============ TEAM SECTION ============
export const TeamSection = styled.div`
  margin-bottom: 2rem;
`;

export const TeamHeader = styled(FlexBetween)`
  margin-bottom: 1rem;
`;

export const TeamTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
`;

export const PokemonGrid = styled(GridContainer)`
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
`;

// ============ TEAM SLOT ============
export const TeamSlot = SlotCard;

export const PokemonActions = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: flex;
  gap: 0.5rem;
`;

export const ActionButton = styled(BaseActionButton)`
  padding: 0.25rem;
  border-radius: 50%;
`;

// ============ TYPE BADGE ============
export const TypeBadge = styled.span<{ type: string }>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  margin: 0.25rem;
  background-color: ${(props) => {
    const typeColors: Record<string, string> = {
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
    return typeColors[props.type.toLowerCase()] || "#777";
  }};
  color: ${(props) => {
    const lightTextTypes = ["electric", "ice", "ground", "steel"];
    return lightTextTypes.includes(props.type.toLowerCase()) ? "#000" : "#fff";
  }};
`;

// ============ STATS ============
export const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

export const StatCard = styled.div`
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  background: white;
`;

export const StatBar = styled.div<{ value: number; max?: number }>`
  height: 8px;
  width: 100%;
  background-color: ${colors["gray-200"]};
  border-radius: 4px;
  margin-top: 4px;
  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${(props) =>
      Math.min((props.value / (props.max || 255)) * 100, 100)}%;
    background-color: ${(props) => {
      if (props.value >= 80) return colors["green-500"];
      if (props.value >= 50) return colors["yellow-500"];
      return colors["red-500"];
    }};
    border-radius: 4px;
    transition: width 0.5s ease;
  }
`;

export const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

export const StatLabel = styled.span`
  font-weight: 500;
  font-size: 0.875rem;
  color: ${colors["gray-700"]};
`;

export const StatValue = styled.span`
  font-weight: 600;
  color: ${colors["gray-900"]};
`;

// ============ MOVES ============
export const MovesContainer = styled.div`
  margin-top: 1rem;
`;

export const MovesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.5rem;
`;

export const MoveItem = styled.div<{ selected?: boolean }>`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid
    ${(props) => (props.selected ? colors["sky-500"] : colors["gray-300"])};
  background-color: ${(props) =>
    props.selected ? colors["sky-100"] : "white"};
  cursor: pointer;

  &:hover {
    border-color: ${colors["sky-400"]};
    background-color: ${colors["gray-100"]};
  }
`;

// ============ EMPTY STATE ============
export const EmptyState = styled(BaseEmptyState)`
  padding: 2rem;
  text-align: center;
  margin: 2rem 0;
`;

// ============ BUTTONS ============
export const ButtonsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

// ============ MODAL ============
export const Modal = styled.div`
  padding: 1.5rem;
  max-width: 500px;
  width: 100%;
`;

// ============ COMBAT SIMULATOR ============
export const CombatSimulatorContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const TeamSide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const BattleLog = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid ${colors["gray-300"]};
  border-radius: 8px;
  font-size: 0.875rem;
  line-height: 1.5;
`;

export const LogEntry = styled.div<{
  type?: "attack" | "info" | "critical" | "heal";
  attacker?: "player" | "computer";
}>`
  padding: 0.25rem 0;
  color: ${(props) => {
    if (props.type === "info") return colors["gray-700"];
    if (props.type === "heal") return colors["green-600"];
    if (props.attacker === "player") return colors["sky-600"];
    if (props.attacker === "computer") return colors["red-600"];
    return colors["gray-700"];
  }};
  font-weight: ${(props) => (props.type === "critical" ? 700 : 400)};
`;

export const ArenaContainer = styled.div`
  width: 100%;
  max-width: 600px;
  height: 400px;
  margin: 1rem auto;
  border-radius: 12px;
  border: 4px solid ${colors["gray-800"]};
  background-image: url("/static/arena_bg.png");
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

export const BattlerContainer = styled.div<{ isPlayer: boolean }>`
  position: absolute;
  bottom: ${(props) => (props.isPlayer ? "10px" : "120px")};
  ${(props) => (props.isPlayer ? "left: 130px;" : "right: 110px;")}
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: ${(props) => (props.isPlayer ? 10 : 5)};
`;

export const BattlerSprite = styled.img<{ isPlayer: boolean }>`
  width: 120px;
  height: 120px;
  object-fit: contain;
  image-rendering: pixelated;
`;

export const HpBox = styled.div`
  background: white;
  border: 2px solid ${colors["gray-800"]};
  border-radius: 8px;
  padding: 4px 8px;
  min-width: 120px;
  text-align: center;
  margin-bottom: 8px;
`;

export const HpBarOuter = styled.div`
  width: 100%;
  height: 8px;
  background: ${colors["gray-300"]};
  border-radius: 4px;
  overflow: hidden;
  margin-top: 4px;
  border: 1px solid ${colors["gray-600"]};
`;

export const HpBarInner = styled.div<{ percentage: number }>`
  width: ${(props) => props.percentage}%;
  height: 100%;
  background-color: ${(props) => {
    if (props.percentage > 50) return colors["green-500"];
    if (props.percentage > 20) return colors["yellow-500"];
    return colors["red-500"];
  }};
  transition: width 0.3s ease-out;
`;
