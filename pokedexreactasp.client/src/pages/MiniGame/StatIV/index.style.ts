import styled from "@emotion/styled";
import { colors, units } from "@/components/utils";
import { CenteredPage, GameCard as BaseGameCard, FlexCenter } from "@/styles";

export const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: calc(100vh - 80px);
  padding: ${units.spacing.xl};
  padding-top: ${units.spacing.lg};
  position: relative;
`;

export const GameCard = styled(BaseGameCard)`
  width: 100%;
  max-width: 1000px;
  padding: ${units.spacing.lg};
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: ${units.spacing.xl};
`;

export const RulesContainer = styled.div`
  padding: ${units.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${units.spacing.sm};
`;

export const RuleTitle = styled.h3`
  font-size: ${units.fontSize.md};
  font-weight: 700;
  color: ${colors["gray-800"]};
  margin: 0;
`;

export const RuleText = styled.p`
  font-size: ${units.fontSize.sm};
  color: ${colors["gray-600"]};
  margin: 0;
  line-height: 1.5;
`;

export const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${units.spacing.lg};
  width: 100%;
`;

export const StatCard = styled.div<{ isComplete?: boolean; colorHex?: string }>`
  background: ${(props) =>
    props.isComplete ? props.colorHex || colors["blue-500"] : "white"};
  border: 2px solid
    ${(props) =>
      props.isComplete
        ? props.colorHex || colors["blue-400"]
        : colors["gray-200"]};
  border-radius: 12px;
  padding: ${units.spacing.base};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${units.spacing.sm};
  transition: all 0.2s ease;
  position: relative;
`;

export const PokemonImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: contain;
`;

export const PillContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${units.spacing.xs};
  width: 100%;
  margin-top: ${units.spacing.sm};
`;

export const StatPill = styled.button<{
  isSelected?: boolean;
  isDisabled?: boolean;
  colorHex?: string;
  isRevealed?: boolean;
}>`
  padding: ${units.spacing.xs} ${units.spacing.sm};
  border-radius: 16px;
  border: 2px solid
    ${(props) =>
      props.isSelected
        ? props.colorHex || colors["blue-500"]
        : colors["gray-300"]};
  background: ${(props) =>
    props.isSelected ? props.colorHex || colors["blue-500"] : "transparent"};
  color: ${(props) => (props.isSelected ? "white" : colors["gray-600"])};
  font-size: ${units.fontSize.sm};
  font-weight: bold;
  cursor: ${(props) => (props.isDisabled ? "not-allowed" : "pointer")};
  opacity: ${(props) =>
    props.isDisabled && !props.isSelected && !props.isRevealed ? 0.3 : 1};
  transition: all 0.2s;

  &:hover {
    transform: ${(props) => (props.isDisabled ? "none" : "translateY(-2px)")};
    box-shadow: ${(props) =>
      props.isDisabled ? "none" : "0 2px 4px rgba(0,0,0,0.1)"};
  }
`;

export const RevealBadge = styled.div`
  position: absolute;
  top: -12px;
  right: -12px;
  font-size: ${units.fontSize.lg};
  font-weight: bold;
  color: white;
  background: ${colors["indigo-500"]};
  padding: 8px 16px;
  border-radius: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transform: rotate(5deg);
`;

export const ScoreBoard = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: white;
  border: 2px solid ${colors["gray-200"]};
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: ${units.spacing.lg};
  width: 100%;
`;

export const ScoreItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${units.spacing.xs};
`;

export const ScoreLabel = styled.div`
  font-size: ${units.fontSize.md};
  color: ${colors["gray-600"]};
  font-weight: 600;
`;

export const ScoreValue = styled.div<{ highlight?: boolean }>`
  font-size: ${units.fontSize.xl};
  font-weight: 800;
  color: ${(props) =>
    props.highlight ? colors["green-500"] : colors["gray-800"]};
`;
