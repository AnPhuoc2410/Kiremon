import styled from "@emotion/styled";
import { colors } from "../components/utils";

// ============ BASE CARD ============
export const BaseCard = styled.div<{
  variant?: "default" | "bordered" | "elevated";
  radius?: "sm" | "md" | "lg";
}>`
  background: white;
  border-radius: ${props => {
    switch (props.radius) {
      case "sm": return "8px";
      case "lg": return "16px";
      default: return "14px";
    }
  }};

  ${props => {
    switch (props.variant) {
      case "bordered":
        return `border: 1px solid ${colors["gray-200"]};`;
      case "elevated":
        return `box-shadow: 0 12px 40px rgba(15, 23, 42, 0.12);`;
      default:
        return `box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);`;
    }
  }}
`;

// ============ AUTH CARD ============
export const AuthCard = styled(BaseCard)<{ width?: string; accentColor?: string }>`
  width: ${props => props.width || "420px"};
  max-width: 100%;
  background: linear-gradient(180deg, #ffffff, #fbfdff);
  padding: 28px;
  box-shadow: 0 12px 40px rgba(15, 23, 42, 0.12);
  border-top: 6px solid ${props => props.accentColor || colors["red-500"]};
  transition: transform 160ms ease, box-shadow 160ms ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 18px 50px rgba(15, 23, 42, 0.14);
  }
`;

// ============ STAT CARD ============
export const StatCard = styled(BaseCard)`
  flex: 1;
  min-width: 160px;
  background: ${colors["gray-100"]};
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid ${colors["gray-200"]};
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

export const StatIcon = styled.div<{ $color?: "blue" | "green" | "red" | "yellow" }>`
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;

  background: ${props => {
    switch (props.$color) {
      case "green":
        return `linear-gradient(135deg, ${colors["green-400"]} 0%, ${colors["green-500"]} 100%)`;
      case "red":
        return `linear-gradient(135deg, ${colors["red-400"]} 0%, ${colors["red-500"]} 100%)`;
      case "yellow":
        return `linear-gradient(135deg, ${colors["yellow-400"]} 0%, ${colors["yellow-500"]} 100%)`;
      default:
        return `linear-gradient(135deg, ${colors["blue-400"]} 0%, ${colors["blue-500"]} 100%)`;
    }
  }};

  svg {
    width: 28px;
    height: 28px;
  }
`;

export const StatInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StatValue = styled.span`
  font-size: 32px;
  font-weight: 700;
  color: ${colors["gray-900"]};
`;

export const StatLabel = styled.span`
  font-size: 14px;
  color: ${colors["gray-500"]};
  font-weight: 500;
`;

// ============ GAME CARD ============
export const GameCard = styled(BaseCard)`
  width: 100%;
  max-width: 640px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

// ============ INFO CARD ============
export const InfoCard = styled(BaseCard)`
  padding: 16px;
  background: ${colors["gray-500"]};
  border: 1px solid ${colors["gray-200"]};
`;

// ============ SLOT CARD (for team/inventory) ============
export const SlotCard = styled.div<{ isEmpty?: boolean }>`
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${props => props.isEmpty ? colors["gray-100"] : "white"};
  border: 2px dashed ${props => props.isEmpty ? colors["gray-300"] : colors["sky-300"]};
  min-height: 200px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  box-shadow: ${props => props.isEmpty
    ? "none"
    : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
  };

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.isEmpty
      ? "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)"
      : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
    };
  }
`;

// ============ STATS HEADER (multiple stat cards row) ============
export const StatsHeader = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 600px) {
    gap: 12px;
  }
`;
