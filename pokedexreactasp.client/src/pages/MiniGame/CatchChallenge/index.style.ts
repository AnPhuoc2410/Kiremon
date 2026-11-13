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

export const StatPill = styled.div<{ variant?: "fire" | "ball" | "score" }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 700;
  background: ${(p) => {
    if (p.variant === "fire") return "rgba(239, 68, 68, 0.12)";
    if (p.variant === "ball") return "rgba(59, 130, 246, 0.15)";
    return "rgba(234, 179, 8, 0.15)";
  }};
  color: ${(p) => {
    if (p.variant === "fire") return "#b91c1c";
    if (p.variant === "ball") return "#1d4ed8";
    return "#b45309";
  }};
  border: 1px solid
    ${(p) => {
      if (p.variant === "fire") return "rgba(239, 68, 68, 0.25)";
      if (p.variant === "ball") return "rgba(59, 130, 246, 0.3)";
      return "rgba(234, 179, 8, 0.3)";
    }};
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

export const SafariField = styled.div<{ isAiming: boolean }>`
  width: 100%;
  height: 340px;
  background: radial-gradient(
    circle at 50% 100%,
    #86efac 0%,
    #4ade80 40%,
    #16a34a 100%
  );
  border-radius: 14px;
  border: 3px solid #14532d;
  box-shadow:
    inset 0 -10px 20px rgba(0, 0, 0, 0.15),
    0 8px 16px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  cursor: ${(p) => (p.isAiming ? "crosshair" : "default")};
  user-select: none;

  /* Safari grass texture pattern */
  &::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: repeating-linear-gradient(
      90deg,
      rgba(22, 101, 52, 0.2) 0px,
      rgba(22, 101, 52, 0.2) 6px,
      transparent 6px,
      transparent 12px
    );
    pointer-events: none;
  }
`;

export const PokemonTargetWrapper = styled.div<{ x: number; y: number }>`
  position: absolute;
  left: ${(p) => p.x}%;
  top: ${(p) => p.y}%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    left 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    top 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  pointer-events: auto;
`;

export const TargetRing = styled.div`
  position: absolute;
  width: 110px;
  height: 110px;
  border: 2px dashed rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  animation: pulseRing 1.5s infinite ease-in-out;
  pointer-events: none;

  @keyframes pulseRing {
    0% {
      transform: scale(1.2);
      opacity: 0.8;
      border-color: #facc15;
    }
    50% {
      transform: scale(0.9);
      opacity: 0.5;
      border-color: #4ade80;
    }
    100% {
      transform: scale(1.2);
      opacity: 0.8;
      border-color: #facc15;
    }
  }
`;

export const PokemonSprite = styled.img`
  width: 100px;
  height: 100px;
  object-fit: contain;
  filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.35));
  transition: transform 0.2s ease;
  user-select: none;
  -webkit-user-drag: none;

  &:hover {
    transform: scale(1.1);
  }
`;

export const BallWobbleContainer = styled.div<{
  x: number;
  y: number;
  wobbleState: string;
}>`
  position: absolute;
  left: ${(p) => p.x}%;
  top: ${(p) => p.y}%;
  transform: translate(-50%, -50%);
  z-index: 20;

  ${(p) => {
    if (p.wobbleState === "shake-left") {
      return `animation: shakeL 0.35s ease-in-out;`;
    }
    if (p.wobbleState === "shake-right") {
      return `animation: shakeR 0.35s ease-in-out;`;
    }
    if (p.wobbleState === "gotcha") {
      return `animation: gotchaBounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);`;
    }
    return "";
  }}

  @keyframes shakeL {
    0%,
    100% {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    50% {
      transform: translate(-50%, -50%) rotate(-28deg);
    }
  }
  @keyframes shakeR {
    0%,
    100% {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    50% {
      transform: translate(-50%, -50%) rotate(28deg);
    }
  }
  @keyframes gotchaBounce {
    0% {
      transform: translate(-50%, -50%) scale(1);
    }
    50% {
      transform: translate(-50%, -50%) scale(1.3);
      filter: drop-shadow(0 0 12px #facc15);
    }
    100% {
      transform: translate(-50%, -50%) scale(1.1);
    }
  }
`;

export const BallIconGraphic = styled.div<{ ballType: string }>`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 3px solid #1e293b;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);

  /* Top half */
  background: ${(p) => {
    if (p.ballType === "great") return "#2563eb";
    if (p.ballType === "ultra") return "#eab308";
    if (p.ballType === "master") return "#7e22ce";
    return "#ef4444";
  }};

  /* Bottom half */
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: #ffffff;
    border-top: 3px solid #1e293b;
  }

  /* Center button */
  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 12px;
    height: 12px;
    background: #ffffff;
    border: 3px solid #1e293b;
    border-radius: 50%;
    z-index: 2;
  }
`;

export const AccuracyToast = styled.div<{ text: string }>`
  position: absolute;
  top: 18px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(15, 23, 42, 0.85);
  color: #ffffff;
  padding: 6px 18px;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.05em;
  backdrop-filter: blur(4px);
  z-index: 30;
  animation: floatUp 0.6s ease-out;

  @keyframes floatUp {
    0% {
      opacity: 0;
      transform: translate(-50%, 10px);
    }
    100% {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }
`;

export const BallSelectorDock = styled.div`
  display: flex;
  gap: ${units.spacing.sm};
  align-items: center;
  justify-content: center;
  margin-top: ${units.spacing.base};
  flex-wrap: wrap;
`;

export const BallDockItem = styled.button<{
  isSelected: boolean;
  disabled?: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  border-radius: 12px;
  background: ${(p) => (p.isSelected ? "#f0fdf4" : "#ffffff")};
  border: 2px solid ${(p) => (p.isSelected ? "#22c55e" : "#e2e8f0")};
  cursor: ${(p) => (p.disabled ? "not-allowed" : "pointer")};
  opacity: ${(p) => (p.disabled ? 0.45 : 1)};
  transition: all 0.2s;

  &:hover:not(:disabled) {
    border-color: #22c55e;
    transform: translateY(-2px);
  }

  span.qty {
    font-size: 12px;
    font-weight: 800;
    color: #64748b;
    background: #f1f5f9;
    padding: 2px 6px;
    border-radius: 4px;
  }
`;

export const CatchResultCard = styled.div<{ status: "caught" | "fled" }>`
  width: 100%;
  max-width: 480px;
  padding: 16px;
  border-radius: 12px;
  text-align: center;
  margin-top: ${units.spacing.base};
  background: ${(p) => (p.status === "caught" ? "#ecfdf5" : "#fef2f2")};
  border: 2px solid ${(p) => (p.status === "caught" ? "#34d399" : "#f87171")};
  animation: popUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);

  @keyframes popUp {
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
