import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

import { colors, units } from "@/components/utils";

const bagGlow = keyframes`
  0%, 100% { opacity: 0.35; }
  50% { opacity: 0.5; }
`;

export const Page = styled.section`
  max-width: ${units.screenSize["xl"]};
  width: 100%;
  margin: 0 auto;
  padding: 10px 16px 130px;
  text-align: center;

  @media screen and (min-width: ${units.screenSize["xl"]}) {
    padding: 10px 0 130px;
  }
`;

export const BagInner = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
  text-align: left;
`;

export const BagWorkspace = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  align-items: start;

  @media (min-width: ${units.screenSize["md"]}) {
    grid-template-columns: minmax(220px, 1fr) minmax(0, 2fr);
    gap: 20px;
  }
`;

/* ── Combat team panel (left) ── */
export const PartyPanel = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 14px 12px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.08),
    0 1px 4px rgba(0, 0, 0, 0.04);
`;

export const PartyPanelTitle = styled.h2`
  margin: 0;
  padding: 0 4px 8px;
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${colors["gray-700"]};
  border-bottom: 2px solid ${colors["gray-200"]};
`;

export const PartySlots = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;

  @media (min-width: ${units.screenSize["md"]}) {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`;

export const PartyCard = styled.div<{ $isEmpty?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 64px;
  padding: 8px 10px;
  border-radius: 12px;
  background: ${(p) => (p.$isEmpty ? "rgba(0,0,0,0.02)" : "#fff")};
  border: 2px solid
    ${(p) => (p.$isEmpty ? "rgba(0,0,0,0.06)" : "rgba(0,0,0,0.08)")};
  box-shadow: ${(p) =>
    p.$isEmpty ? "none" : "0 2px 6px rgba(0,0,0,0.06)"};
  position: relative;
`;

export const PartySpriteWrap = styled.div`
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    image-rendering: pixelated;
  }
`;

export const PartyDetails = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const PartyNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
`;

export const PartyName = styled.span`
  font-size: 0.78rem;
  font-weight: 700;
  color: ${colors["gray-900"]};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: capitalize;
`;

export const PartyHpRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const PartyHpBar = styled.div`
  height: 6px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

export const PartyHpFill = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${(p) => p.$percent}%;
  border-radius: inherit;
  background: linear-gradient(90deg, #4ade80 0%, #22c55e 100%);
`;

export const PartyHpText = styled.span`
  font-size: 0.62rem;
  font-weight: 600;
  color: ${colors["gray-600"]};
`;

export const PartyLevel = styled.span`
  flex-shrink: 0;
  align-self: flex-end;
  font-size: 0.68rem;
  font-weight: 700;
  color: ${colors["gray-600"]};
`;

export const PartyEmptySlot = styled.span`
  margin: auto;
  font-size: 0.9rem;
  color: ${colors["gray-400"]};
`;

export const PartyHint = styled.p`
  margin: 0;
  padding: 0 4px;
  font-size: 0.75rem;
  line-height: 1.5;
  color: ${colors["gray-600"]};

  a {
    color: ${colors["blue-600"]};
    font-weight: 600;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

/* ── Category strip (top of bag panel) ── */
export const CategoryStrip = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px 4px;
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.65) transparent;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.7);
    border-radius: 999px;
  }
`;

export const CategoryStripTab = styled.button<{
  $active?: boolean;
  $accent: string;
}>`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 34px;
  padding: 0 12px;
  border: 2px solid
    ${(p) => (p.$active ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.5)")};
  border-radius: 999px;
  background: ${(p) =>
    p.$active ? p.$accent : "rgba(255,255,255,0.65)"};
  color: ${(p) => (p.$active ? "#fff" : "rgba(0,0,0,0.72)")};
  font-size: 0.78rem;
  font-weight: ${(p) => (p.$active ? 700 : 600)};
  white-space: nowrap;
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease,
    transform 0.15s ease;

  .label {
    text-transform: capitalize;
  }

  .count {
    font-size: 0.72rem;
    opacity: 0.85;
  }

  &:hover {
    background: ${(p) =>
      p.$active ? p.$accent : "rgba(255,255,255,0.88)"};
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid rgba(0, 0, 0, 0.35);
    outline-offset: 2px;
  }
`;

export const ContentColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  border-radius: 14px;
  overflow: hidden;
  box-shadow:
    0 8px 24px rgba(180, 110, 20, 0.18),
    0 2px 8px rgba(0, 0, 0, 0.08);
  background: linear-gradient(160deg, #f8d84a 0%, #f0a830 48%, #e88828 100%);
  position: relative;
  isolation: isolate;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      radial-gradient(
        circle at 85% 20%,
        rgba(255, 255, 255, 0.22) 0%,
        transparent 42%
      ),
      radial-gradient(
        circle at 10% 80%,
        rgba(255, 200, 80, 0.18) 0%,
        transparent 38%
      );
    pointer-events: none;
    z-index: 0;
    animation: ${bagGlow} 6s ease-in-out infinite;
  }

  &::after {
    content: "";
    position: absolute;
    top: -40px;
    right: -60px;
    width: 220px;
    height: 220px;
    border-radius: 50%;
    border: 28px solid rgba(255, 255, 255, 0.08);
    pointer-events: none;
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }
`;

export const ListToolbar = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px 10px;
  min-height: 52px;
`;

export const ToolbarTitle = styled.div<{ $accent: string }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 0 22px 0 16px;
  font-weight: 800;
  font-size: 0.95rem;
  color: #fff;
  text-transform: capitalize;
  letter-spacing: 0.03em;
  background: ${(p) => p.$accent};
  transform: skewX(-12deg);
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.12);

  span {
    display: inline-block;
    transform: skewX(12deg);
  }
`;

export const ToolbarActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.78rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.55);
  padding-bottom: 2px;
`;

export const SortSelect = styled.select`
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 6px;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.72);
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.72);
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid rgba(0, 0, 0, 0.25);
    outline-offset: 1px;
  }
`;

export const ItemList = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 240px;
  max-height: 340px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 10px 4px 6px;
  margin-right: 4px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.65) transparent;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.7);
    border-radius: 999px;
  }

  @media (min-width: ${units.screenSize["md"]}) {
    max-height: 420px;
  }

  @media (min-width: ${units.screenSize["lg"]}) {
    max-height: 480px;
  }
`;

export const ItemListOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(248, 216, 74, 0.45);
  pointer-events: none;
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.55);
  z-index: 2;
`;

export const EmptyList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 56px 16px;
  color: rgba(0, 0, 0, 0.5);
  font-size: 0.92rem;
  font-weight: 600;
`;

export const DescriptionBox = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: auto;
  min-height: 130px;
  background: rgba(255, 255, 255, 0.88);
  border-top: 2px solid rgba(0, 0, 0, 0.06);
`;

export const DescriptionHeader = styled.div<{ $accent: string }>`
  position: relative;
  display: inline-flex;
  align-self: flex-start;
  align-items: center;
  min-height: 36px;
  margin: 0 0 -1px 12px;
  padding: 0 24px 0 16px;
  background: ${(p) => p.$accent};
  color: #fff;
  font-weight: 800;
  font-size: 0.92rem;
  text-transform: capitalize;
  letter-spacing: 0.02em;
  transform: skewX(-12deg);
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.1);

  span {
    display: inline-block;
    transform: skewX(12deg);
  }
`;

export const DescriptionBody = styled.div`
  padding: 14px 16px 18px;
  font-size: 0.88rem;
  line-height: 1.6;
  color: ${colors["gray-800"]};
  white-space: pre-wrap;
`;

export const Pager = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  align-items: center;
  padding: 10px 14px 12px;
  background: rgba(0, 0, 0, 0.04);
  border-top: 1px solid rgba(0, 0, 0, 0.06);
`;

export const EmptyBag = styled.div`
  padding: 48px 16px;
  text-align: center;
  color: ${colors["gray-600"]};
`;
