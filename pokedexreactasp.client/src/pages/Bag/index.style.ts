import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

import { colors, units } from "@/components/utils";

export {
  MainContent,
  SidebarContainer,
  SidebarToggle,
  SidebarOverlay,
} from "@/pages/Market/Market.styles";

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
