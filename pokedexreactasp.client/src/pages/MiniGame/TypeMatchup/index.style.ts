import styled from "@emotion/styled";
import { colors, units } from "@/components/utils";

export const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: calc(100vh - 80px);
  padding: ${units.spacing.base};
  padding-bottom: ${units.spacing["2xl"]};
  position: relative;
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
`;

export const ControlBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${units.spacing.sm};
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: ${units.spacing.base};
`;

export const ModeButtonGroup = styled.div`
  display: flex;
  gap: 6px;
  background: ${colors["gray-200"]};
  padding: 4px;
  border-radius: 9999px;
`;

export const ModeTabBtn = styled.button<{ isActive: boolean }>`
  background: ${(p) => (p.isActive ? "#ffffff" : "transparent")};
  color: ${(p) => (p.isActive ? "#1e293b" : "#64748b")};
  box-shadow: ${(p) => (p.isActive ? "0 2px 6px rgba(0,0,0,0.1)" : "none")};
  border: none;
  padding: 6px 14px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: #1e293b;
  }
`;

export const ScoreBar = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const StatPill = styled.div<{ variant?: "fire" | "gold" }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 700;
  background: ${(p) =>
    p.variant === "fire"
      ? "rgba(239, 68, 68, 0.12)"
      : "rgba(234, 179, 8, 0.15)"};
  color: ${(p) => (p.variant === "fire" ? "#b91c1c" : "#b45309")};
  border: 1px solid
    ${(p) =>
      p.variant === "fire"
        ? "rgba(239, 68, 68, 0.25)"
        : "rgba(234, 179, 8, 0.3)"};
`;

export const ArenaCard = styled.div`
  width: 100%;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 2px solid ${colors["gray-200"]};
  padding: ${units.spacing.lg};
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;

  @media (max-width: 640px) {
    padding: ${units.spacing.base};
  }
`;

export const TimerTrack = styled.div`
  width: 100%;
  height: 8px;
  background: ${colors["gray-200"]};
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: ${units.spacing.base};
`;

export const TimerFill = styled.div<{ pct: number; isUrgent: boolean }>`
  height: 100%;
  width: ${(p) => p.pct}%;
  background: ${(p) => (p.isUrgent ? "#ef4444" : "#0284c7")};
  border-radius: 4px;
  transition:
    width 1s linear,
    background 0.3s;
`;

export const MatchupStage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${units.spacing.base};
  margin: ${units.spacing.base} 0;
  flex-wrap: wrap;
  width: 100%;
`;

export const CombatantBox = styled.div<{ role: "attack" | "defend" }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
  background: ${(p) => (p.role === "attack" ? "#fef3c7" : "#f1f5f9")};
  border: 2px solid ${(p) => (p.role === "attack" ? "#f59e0b" : "#cbd5e1")};
  border-radius: 12px;
  min-width: 150px;

  span.label {
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: ${(p) => (p.role === "attack" ? "#92400e" : "#475569")};
  }
`;

export const VsBadge = styled.div`
  font-size: 20px;
  font-weight: 900;
  color: #94a3b8;
  font-style: italic;
`;

export const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${units.spacing.sm};
  width: 100%;
  max-width: 580px;
  margin-top: ${units.spacing.sm};

  @media (max-width: 540px) {
    grid-template-columns: 1fr;
  }
`;

export const OptionButton = styled.button<{
  correct?: boolean;
  wrong?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
  border: 2px solid;

  ${(p) => {
    if (p.correct) {
      return `
        background: #ecfdf5;
        border-color: #10b981;
        color: #065f46;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
        transform: translateY(-2px);
      `;
    }
    if (p.wrong) {
      return `
        background: #fef2f2;
        border-color: #ef4444;
        color: #991b1b;
      `;
    }
    return `
      background: #ffffff;
      border-color: #e2e8f0;
      color: #1e293b;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);

      &:hover:not(:disabled) {
        border-color: #0284c7;
        background: #f0f9ff;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(2, 132, 199, 0.18);
      }
    `;
  }}

  &:disabled {
    cursor: default;
  }

  span.key-tag {
    background: #f1f5f9;
    color: #64748b;
    border-radius: 4px;
    padding: 2px 6px;
    font-size: 11px;
    font-weight: 800;
  }
`;

export const FeedbackBanner = styled.div<{ isCorrect: boolean }>`
  width: 100%;
  max-width: 580px;
  padding: 14px;
  border-radius: 10px;
  text-align: center;
  margin-top: ${units.spacing.base};
  background: ${(p) => (p.isCorrect ? "#ecfdf5" : "#fef2f2")};
  border: 2px solid ${(p) => (p.isCorrect ? "#34d399" : "#f87171")};
  animation: popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

  @keyframes popIn {
    0% {
      opacity: 0;
      transform: scale(0.95);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
`;
