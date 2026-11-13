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

export const ChipGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
`;

export const FilterChip = styled.button<{ isActive: boolean }>`
  background: ${(p) => (p.isActive ? colors["sky-300"] : colors["gray-200"])};
  color: ${(p) => (p.isActive ? "#fff" : colors["gray-400"])};
  border: none;
  padding: 6px 12px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${(p) => (p.isActive ? colors["sky-300"] : colors["gray-300"])};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const StatsBar = styled.div`
  display: flex;
  gap: ${units.spacing.sm};
  align-items: center;
`;

export const StatBadge = styled.div<{ variant?: "score" | "streak" }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 700;
  background: ${(p) =>
    p.variant === "streak"
      ? "rgba(255, 107, 107, 0.15)"
      : "rgba(255, 212, 59, 0.2)"};
  color: ${(p) => (p.variant === "streak" ? "#d63031" : "#d35400")};
  border: 1px solid
    ${(p) =>
      p.variant === "streak"
        ? "rgba(255, 107, 107, 0.3)"
        : "rgba(255, 212, 59, 0.4)"};
`;

export const StageCard = styled.div`
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

export const DisplayScreen = styled.div`
  position: relative;
  width: 100%;
  max-width: 380px;
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle, #3a7bd5 0%, #00d2ff 100%);
  border-radius: 12px;
  border: 4px solid #2d3436;
  box-shadow:
    inset 0 0 20px rgba(0, 0, 0, 0.3),
    0 6px 12px rgba(0, 0, 0, 0.15);
  margin-bottom: ${units.spacing.base};
  overflow: hidden;

  /* Subtle retro scanline effect */
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.04) 0px,
      rgba(255, 255, 255, 0.04) 1px,
      transparent 1px,
      transparent 2px
    );
    pointer-events: none;
  }
`;

export const PokemonSpriteImg = styled.img<{ revealed: boolean }>`
  width: 220px;
  height: 220px;
  object-fit: contain;
  user-select: none;
  -webkit-user-drag: none;
  filter: ${(p) =>
    p.revealed
      ? "drop-shadow(0 10px 18px rgba(0, 0, 0, 0.35))"
      : "brightness(0) drop-shadow(0 0 12px rgba(0, 0, 0, 0.6))"};
  transform: ${(p) => (p.revealed ? "scale(1.06)" : "scale(1)")};
  transition:
    filter 0.6s cubic-bezier(0.34, 1.56, 0.64, 1),
    transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 2;
`;

export const HintsSection = styled.div`
  display: flex;
  gap: ${units.spacing.xs};
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: ${units.spacing.base};
`;

export const HintPill = styled.button<{ revealed?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: ${(p) => (p.revealed ? "#eef2ff" : "#f8f9fa")};
  color: ${(p) => (p.revealed ? "#4338ca" : "#636e72")};
  border: 1px dashed ${(p) => (p.revealed ? "#818cf8" : "#cbd5e1")};
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: ${(p) => (p.revealed ? "default" : "pointer")};
  transition: all 0.2s;

  &:hover:not(:disabled) {
    border-color: #6366f1;
    color: #4f46e5;
  }
`;

export const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${units.spacing.sm};
  width: 100%;
  max-width: 460px;
  margin-top: ${units.spacing.xs};

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

export const OptionChoiceBtn = styled.button<{
  status?: "default" | "correct" | "wrong";
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  text-transform: capitalize;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
  border: 2px solid;

  ${(p) => {
    if (p.status === "correct") {
      return `
        background: #ecfdf5;
        border-color: #10b981;
        color: #065f46;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
        transform: translateY(-2px);
      `;
    }
    if (p.status === "wrong") {
      return `
        background: #fef2f2;
        border-color: #ef4444;
        color: #991b1b;
        opacity: 0.85;
      `;
    }
    return `
      background: #ffffff;
      border-color: #e2e8f0;
      color: #1e293b;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);

      &:hover:not(:disabled) {
        border-color: #38bdf8;
        background: #f0f9ff;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(56, 189, 248, 0.2);
      }
    `;
  }}

  &:disabled {
    cursor: default;
  }

  span.key-tag {
    display: inline-block;
    background: #f1f5f9;
    color: #64748b;
    border-radius: 4px;
    padding: 2px 6px;
    font-size: 11px;
    font-weight: 800;
  }
`;

export const TypingForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 420px;
  gap: ${units.spacing.sm};
  position: relative;
`;

export const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const GuessInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 10px;
  border: 2px solid ${colors["gray-300"]};
  outline: none;
  background: #ffffff;
  transition: all 0.2s;

  &:focus {
    border-color: ${colors["sky-300"]};
    box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.15);
  }
`;

export const SuggestionsDropdown = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 200px;
  overflow-y: auto;
  background: #ffffff;
  border: 2px solid ${colors["sky-300"]};
  border-radius: 8px;
  margin-top: 4px;
  padding: 4px 0;
  list-style: none;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  z-index: 50;
`;

export const SuggestionItem = styled.li`
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  text-transform: capitalize;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: #f0f9ff;
    color: ${colors["sky-300"]};
  }
`;

export const RevealCard = styled.div<{ isCorrect: boolean }>`
  width: 100%;
  max-width: 440px;
  padding: 16px;
  border-radius: 12px;
  text-align: center;
  margin-top: ${units.spacing.sm};
  background: ${(p) => (p.isCorrect ? "#ecfdf5" : "#fef2f2")};
  border: 2px solid ${(p) => (p.isCorrect ? "#34d399" : "#f87171")};
  animation: popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);

  @keyframes popIn {
    0% {
      opacity: 0;
      transform: scale(0.92);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

export const ActionsRow = styled.div`
  display: flex;
  gap: ${units.spacing.sm};
  justify-content: center;
  margin-top: ${units.spacing.base};
  flex-wrap: wrap;
`;
