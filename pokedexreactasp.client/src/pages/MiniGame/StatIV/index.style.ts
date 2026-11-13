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
  max-width: 1020px;
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

export const StatTray = styled.div`
  width: 100%;
  background: #f8fafc;
  border: 2px dashed #cbd5e1;
  border-radius: 14px;
  padding: 14px 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: ${units.spacing.lg};
`;

export const StatPillList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
`;

export const StatDockPill = styled.button<{
  colorHex: string;
  isAssigned: boolean;
  isActive: boolean;
}>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 700;
  cursor: ${(p) => (p.isAssigned ? "default" : "pointer")};
  opacity: ${(p) => (p.isAssigned ? 0.35 : 1)};
  border: 2px solid ${(p) => p.colorHex};
  background: ${(p) => (p.isActive ? p.colorHex : "#ffffff")};
  color: ${(p) => (p.isActive ? "#ffffff" : "#1e293b")};
  transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
  box-shadow: ${(p) =>
    p.isActive ? `0 4px 14px ${p.colorHex}55` : "0 2px 4px rgba(0,0,0,0.04)"};

  &:hover:not(:disabled) {
    transform: ${(p) => (p.isAssigned ? "none" : "translateY(-2px)")};
  }

  span.dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${(p) => (p.isActive ? "#ffffff" : p.colorHex)};
  }
`;

export const PokemonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${units.spacing.base};
  width: 100%;

  @media (max-width: 860px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 540px) {
    grid-template-columns: 1fr;
  }
`;

export const PokemonCard = styled.div<{
  isAssigned: boolean;
  colorHex?: string;
}>`
  background: #ffffff;
  border-radius: 14px;
  border: 2px solid
    ${(p) => (p.isAssigned && p.colorHex ? p.colorHex : "#e2e8f0")};
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  position: relative;
  box-shadow: ${(p) =>
    p.isAssigned && p.colorHex
      ? `0 6px 16px ${p.colorHex}22`
      : "0 2px 8px rgba(0,0,0,0.04)"};
  transition: all 0.2s ease;
`;

export const PokemonImg = styled.img`
  width: 110px;
  height: 110px;
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
  user-select: none;
`;

export const SlotButton = styled.button<{
  isAssigned: boolean;
  colorHex?: string;
}>`
  width: 100%;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  border: 2px dashed
    ${(p) => (p.isAssigned && p.colorHex ? p.colorHex : "#94a3b8")};
  background: ${(p) =>
    p.isAssigned && p.colorHex ? `${p.colorHex}18` : "#f8fafc"};
  color: ${(p) => (p.isAssigned && p.colorHex ? "#0f172a" : "#64748b")};
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s;

  &:hover {
    border-color: ${(p) => (p.colorHex ? p.colorHex : "#0284c7")};
    background: #f0f9ff;
  }
`;

export const StatBarList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 6px;
`;

export const StatBarRow = styled.div<{ isTarget: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: ${(p) => (p.isTarget ? "800" : "500")};
  color: ${(p) => (p.isTarget ? "#0f172a" : "#64748b")};

  span.val {
    width: 28px;
    text-align: right;
  }
`;

export const BarTrack = styled.div`
  flex: 1;
  height: 5px;
  background: #f1f5f9;
  border-radius: 3px;
  overflow: hidden;
`;

export const BarFill = styled.div<{
  widthPct: number;
  colorHex: string;
  isTarget: boolean;
}>`
  height: 100%;
  width: ${(p) => p.widthPct}%;
  background: ${(p) => (p.isTarget ? p.colorHex : "#cbd5e1")};
  border-radius: 3px;
`;

/* modern-web-guidance: <dialog> styling */
export const NativeDialog = styled.dialog`
  border: none;
  border-radius: 16px;
  padding: 0;
  background: #ffffff;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-width: 520px;
  width: calc(100% - 32px);
  margin: auto;
  overscroll-behavior: contain;

  &::backdrop {
    background: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(4px);
    overflow: hidden;
    overscroll-behavior: contain;
  }
`;

export const ModalContent = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;
