import styled from "@emotion/styled";

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
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  z-index: 3000;
  display: grid;
  place-items: center;
  padding: 20px;
`;

export const ModalContent = styled.div`
  width: 100%;
  max-width: 80rem;
  max-height: 85vh;
  overflow: auto;
  background: rgba(2, 6, 23, 0.9);
  border-radius: 16px;
  border: 1px solid #1e293b;
  backdrop-filter: blur(12px);
  padding: 22px;
  display: grid;
  gap: 18px;
  position: relative;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  padding-right: 50px;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 14px;
  right: 14px;
  width: 38px;
  height: 38px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(15, 23, 42, 0.55);
  color: #f8fafc;
  border-radius: 999px;
  cursor: pointer;
  display: grid;
  place-items: center;
  font-size: 22px;
  line-height: 1;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(30, 41, 59, 0.8);
  }
`;

export const DetailLayout = styled.div`
  display: grid;
  grid-template-columns: 45% 55%;
  gap: 22px;
  align-items: start;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

export const CardStage = styled.div`
  display: grid;
  place-items: center;
  perspective: 1400px;
  min-height: 580px;
  position: relative;

  @media (max-width: 860px) {
    min-height: auto;
  }
`;

export const CardGlow = styled.div`
  position: absolute;
  width: 360px;
  height: 360px;
  border-radius: 999px;
  background: radial-gradient(
    circle,
    rgba(34, 197, 94, 0.36) 0%,
    rgba(34, 197, 94, 0.18) 42%,
    rgba(34, 197, 94, 0) 72%
  );
  filter: blur(18px);
  z-index: 0;
`;

export const DetailImage = styled.img`
  width: min(430px, 100%);
  border-radius: 16px;
  background: #f9fafb;
  box-shadow:
    0 30px 40px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.15);
  transform: rotateX(var(--tiltX, 0deg)) rotateY(var(--tiltY, 0deg))
    scale(var(--scale, 1));
  transition: transform 200ms ease-in-out;
  position: relative;
  z-index: 1;
`;

export const DetailBlock = styled.div`
  display: grid;
  gap: 12px;
  max-height: 75vh;
  overflow-y: auto;
  padding-right: 8px;
`;

export const ScrollArea = styled.div`
  display: grid;
  gap: 12px;
  background: rgba(107, 114, 128, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(10px);
  border-radius: 14px;
  padding: 16px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(100, 116, 139, 0.6);
    border-radius: 999px;
  }
`;

export const InfoChunk = styled.div`
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(30, 41, 59, 0.6);
  border-radius: 12px;
  padding: 12px;
  display: grid;
  gap: 8px;
`;

export const ChunkTitle = styled.h4`
  margin: 0;
  color: #dcfce7;
  font-size: 0.95rem;
  letter-spacing: 0.02em;
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
  color: #4ade80;
  font-size: 1.25rem;
  font-weight: 800;
`;

export const TypePill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 999px;
  padding: 6px 12px;
  background: rgba(34, 197, 94, 0.14);
  color: #86efac;
  border: 1px solid rgba(34, 197, 94, 0.3);
  font-size: 0.8rem;
  font-weight: 600;
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
`;

export const AttackRow = styled.div`
  border: 1px solid rgba(30, 41, 59, 0.6);
  background: rgba(15, 23, 42, 0.45);
  border-radius: 10px;
  padding: 10px;
  display: grid;
  gap: 6px;
`;

export const AttackHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`;

export const AttackName = styled.span`
  color: #f8fafc;
  font-weight: 700;
`;

export const AttackDamage = styled.span`
  color: #86efac;
  font-weight: 700;
`;

export const Label = styled.span`
  color: #e5e7eb;
  font-size: 0.85rem;
`;

export const Value = styled.span`
  color: #f9fafb;
  font-size: 0.95rem;
`;

export const BadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  background: rgba(34, 197, 94, 0.22);
  color: #dcfce7;
  font-size: 0.75rem;
  padding: 4px 10px;
  font-weight: 600;
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
