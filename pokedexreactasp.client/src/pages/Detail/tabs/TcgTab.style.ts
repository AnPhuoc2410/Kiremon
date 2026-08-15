import styled from "@emotion/styled";
import { colors } from "@/components/utils";

export const Section = styled.div`
  display: grid;
  gap: 16px;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
`;

export const FilterRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(160px, 1fr));
  gap: 10px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const Select = styled.select`
  width: 100%;
  height: 40px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 0 10px;
  background: #fff;
  color: #111827;
`;

export const CardItem = styled.button`
  width: 100%;
  border: none;
  background: #ffffff;
  padding: 12px;
  text-align: left;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  border-radius: 10px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.15);
  }
`;

export const CardImage = styled.img`
  width: 100%;
  height: 280px;
  object-fit: contain;
  border-radius: 8px;
  background: #f3f4f6;
`;

export const CardMeta = styled.div`
  margin-top: 10px;
  display: grid;
  gap: 4px;
`;

export const MetaLine = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: #4b5563;
`;

export const Title = styled.h4`
  margin: 0;
  font-size: 1rem;
  color: #111827;
`;

export const Paginator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
`;

export const PagerButton = styled.button`
  min-height: 40px;
  border: 2px solid ${colors["gray-900"]};
  border-radius: 10px;
  padding: 0 16px;
  background: ${colors["yellow-300"]};
  color: ${colors["gray-900"]};
  cursor: pointer;
  font-weight: 800;
  text-transform: uppercase;
  box-shadow: inset -4px -4px ${colors["yellow-500"]};
  transition:
    transform 0.16s ease,
    background-color 0.16s ease,
    opacity 0.16s ease;

  &:hover:not(:disabled) {
    background: ${colors["yellow-200"]};
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
    box-shadow: inset 4px 4px ${colors["yellow-500"]};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    background: ${colors["gray-200"]};
    box-shadow: inset -4px -4px ${colors["gray-300"]};
  }
`;

export const PageCount = styled.span`
  color: ${colors["gray-900"]};
  font-weight: 800;
  padding: 0 16px;
  min-height: 40px;
  display: flex;
  align-items: center;
  border: 2px solid ${colors["gray-900"]};
  border-radius: 10px;
  background: #ffffff;
  box-shadow: inset -3px -3px ${colors["gray-200"]};
`;

import { keyframes } from "@emotion/react";

const fadeSlideUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const overlayFade = keyframes`
  from { opacity: 0; backdrop-filter: blur(0px); }
  to { opacity: 1; backdrop-filter: blur(6px); }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(248, 250, 252, 0.85);
  z-index: 3000;
  display: grid;
  place-items: center;
  padding: 20px;
  animation: ${overlayFade} 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
`;

export const ModalContent = styled.div`
  width: 100%;
  max-width: 82rem;
  max-height: 85vh;
  overflow: auto;
  background: #ffffff;
  border-radius: 16px;
  border: 4px solid #020617;
  padding: 28px;
  display: grid;
  gap: 16px;
  position: relative;
  box-shadow: 12px 12px 0 #020617;
  animation: ${fadeSlideUp} 0.5s cubic-bezier(0.32, 0.72, 0, 1) forwards;
  transform-origin: bottom center;

  &::-webkit-scrollbar {
    width: 0px;
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 44px;
  height: 44px;
  border: 3px solid #020617;
  background: #f1f5f9;
  color: #020617;
  border-radius: 12px;
  cursor: pointer;
  display: grid;
  place-items: center;
  font-size: 26px;
  line-height: 1;
  font-weight: 900;
  box-shadow: 4px 4px 0 #020617;
  transition: all 0.1s ease;
  z-index: 10;

  &:hover {
    background: #e2e8f0;
    transform: translate(-1px, -1px);
    box-shadow: 5px 5px 0 #020617;
  }

  &:active {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 #020617;
  }
`;

export const DetailLayout = styled.div`
  display: grid;
  grid-template-columns: 42% 58%;
  gap: 32px;
  align-items: start;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

export const CardStage = styled.div`
  display: grid;
  place-items: center;
  perspective: 1400px;
  min-height: 600px;
  position: relative;
  border: 3px solid #020617;
  border-radius: 20px;
  background: #f1f5f9;
  box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.05);

  @media (max-width: 960px) {
    min-height: auto;
    padding: 30px;
  }
`;

export const CardGlow = styled.div`
  position: absolute;
  width: 80%;
  height: 80%;
  border-radius: 999px;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0) 70%
  );
  filter: blur(24px);
  z-index: 0;
`;

export const DetailImage = styled.img`
  width: min(440px, 90%);
  border-radius: 20px;
  box-shadow:
    0 40px 50px rgba(0, 0, 0, 0.7),
    0 0 0 2px rgba(255, 255, 255, 0.1);
  transform: rotateX(var(--tiltX, 0deg)) rotateY(var(--tiltY, 0deg))
    scale(var(--scale, 1));
  transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  z-index: 1;
`;

export const DetailBlock = styled.div`
  display: grid;
  gap: 12px;
  max-height: calc(85vh - 56px);
  overflow-y: auto;
  padding-right: 12px;
  min-height: 0;

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
`;

export const ScrollArea = styled.div`
  display: grid;
  gap: 16px;
  padding-bottom: 2rem;
`;

export const InfoChunk = styled.div`
  background: #f8fafc;
  border: 3px solid #020617;
  border-radius: 16px;
  padding: 20px;
  display: grid;
  gap: 12px;
  box-shadow: 4px 4px 0 rgba(2, 6, 23, 1);
`;

export const AbilityChunk = styled(InfoChunk)`
  margin-top: 1.25rem;
  padding: 1rem;
`;

export const ChunkTitle = styled.h4`
  margin: 0;
  color: #475569;
  font-size: 0.85rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  border-bottom: 2px solid #cbd5e1;
  padding-bottom: 8px;
  margin-bottom: 8px;
`;

export const DataRow = styled.div`
  display: grid;
  gap: 2px;
`;

export const StatsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

export const HpValue = styled.span`
  color: #f43f5e;
  font-size: 2rem;
  font-family: "VT323", monospace;
  font-weight: 400;
  line-height: 1;
`;

export const TypePill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 8px;
  padding: 4px 14px;
  background: #ffffff;
  color: #0f172a;
  border: 2px solid #020617;
  font-size: 0.85rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
`;

export const AttackRow = styled.div`
  border: 2px solid #020617;
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  display: grid;
  gap: 8px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  box-shadow: 2px 2px 0 rgba(2, 6, 23, 1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 4px 4px 0 rgba(2, 6, 23, 1);
  }
`;

export const AttackHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`;

export const AttackName = styled.span`
  color: #0f172a;
  font-size: 1.25rem;
  font-weight: 800;
`;

export const AttackDamage = styled.span`
  color: #e11d48;
  font-size: 1.5rem;
  font-family: "VT323", monospace;
  line-height: 1;
`;

export const AbilityTypeBadge = styled.span`
  display: inline-flex;
  align-items: center;
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  background: #fef3c7;
  color: #b45309;
  border: 2px solid #d97706;
`;

export const AttackDescription = styled.p`
  margin: 0;
  color: #475569;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-top: 6px;
`;

export const Label = styled.span`
  color: #64748b;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.15em;
`;

export const Value = styled.span`
  color: #0f172a;
  font-size: 0.95rem;
  font-weight: 600;
`;

export const BadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  background: #ffffff;
  color: #0f172a;
  border: 2px solid #020617;
  border-radius: 8px;
  font-size: 0.8rem;
  padding: 4px 10px;
  font-weight: 700;
  letter-spacing: 0.05em;
`;

export const LegalBadge = styled.span`
  display: inline-flex;
  align-items: center;
  border-radius: 8px;
  background: #064e3b;
  color: #34d399;
  border: 2px solid #022c22;
  padding: 4px 12px;
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const PremiumTitle = styled.h2`
  margin: 0;
  font-size: 3.5rem;
  line-height: 1;
  font-weight: 400;
  color: #020617;
  font-family: "VT323", monospace;
  text-transform: uppercase;
  letter-spacing: 0.02em;
`;

export const HeaderSub = styled.p`
  margin: 0;
  color: #3b82f6;
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-top: 4px;
`;

export const DetailText = styled.p`
  margin: 0;
  color: #475569;
  font-size: 0.95rem;
  line-height: 1.6;
`;

export const EmptyBox = styled.div`
  padding: 24px;
  border-radius: 12px;
  background: #f8fafc;
  color: #475569;
  text-align: center;
`;

export const ErrorBox = styled.div`
  padding: 18px;
  border-radius: 10px;
  background: #fef2f2;
  color: #991b1b;
  display: grid;
  gap: 10px;
`;
