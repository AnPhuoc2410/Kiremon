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
  gap: 14px;
  position: relative;
  font-family:
    "Inter",
    "Plus Jakarta Sans",
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;

  * {
    font-family:
      "Inter",
      "Plus Jakarta Sans",
      system-ui,
      -apple-system,
      "Segoe UI",
      sans-serif !important;
    text-shadow: none !important;
  }
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
    rgba(249, 115, 22, 0.22) 0%,
    rgba(251, 146, 60, 0.14) 40%,
    rgba(249, 115, 22, 0) 72%
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
    0 0 40px rgba(249, 115, 22, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.15);
  transform: rotateX(var(--tiltX, 0deg)) rotateY(var(--tiltY, 0deg))
    scale(var(--scale, 1));
  transition: transform 200ms ease-in-out;
  position: relative;
  z-index: 1;
`;

export const DetailBlock = styled.div`
  display: grid;
  gap: 8px;
  max-height: calc(85vh - 110px);
  overflow-y: auto;
  padding-right: 8px;
  padding-bottom: 2.5rem;
  min-height: 0;
`;

export const ScrollArea = styled.div`
  display: grid;
  gap: 8px;
  background: rgba(107, 114, 128, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(10px);
  border-radius: 14px;
  padding: 14px 14px 2.5rem;

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
  padding: 10px 12px;
  display: grid;
  gap: 6px;
`;

export const AbilityChunk = styled(InfoChunk)`
  margin-top: 1.25rem;
  padding: 1rem;
`;

export const ChunkTitle = styled.h4`
  margin: 0;
  color: #94a3b8;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  border-bottom: 1px solid #1e293b;
  padding-bottom: 4px;
  margin-bottom: 6px;
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
  font-size: 1.25rem;
  font-weight: 800;
`;

export const TypePill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 999px;
  padding: 6px 12px;
  background: rgba(249, 115, 22, 0.16);
  color: #fdba74;
  border: 1px solid rgba(249, 115, 22, 0.35);
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
  padding: 12px 10px 10px;
  display: grid;
  gap: 4px;
`;

export const AttackHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`;

export const AttackName = styled.span`
  color: #ffffff;
  font-size: 1rem;
  font-weight: 700;
`;

export const AttackDamage = styled.span`
  color: #fbbf24;
  font-size: 1rem;
  font-weight: 800;
`;

export const AbilityTypeBadge = styled.span`
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 2px 10px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: rgba(245, 158, 11, 0.1);
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.2);
`;

export const AttackDescription = styled.p`
  margin: 0;
  color: #94a3b8;
  font-size: 0.875rem;
  line-height: 1.625;
  margin-top: 0.375rem;
  font-family:
    "Inter",
    "Plus Jakarta Sans",
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
`;

export const Label = styled.span`
  color: #64748b;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
`;

export const Value = styled.span`
  color: #f1f5f9;
  font-size: 0.875rem;
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
  background: rgba(30, 41, 59, 0.8);
  color: #cbd5e1;
  border: 1px solid rgba(51, 65, 85, 0.5);
  border-radius: 6px;
  font-size: 11px;
  padding: 2px 8px;
  font-weight: 700;
  letter-spacing: 0.04em;
`;

export const LegalBadge = styled.span`
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  background: rgba(16, 185, 129, 0.1);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.2);
  padding: 4px 10px;
  font-size: 0.75rem;
  font-weight: 500;
`;

export const PremiumTitle = styled.h2`
  margin: 0;
  font-size: 2.25rem;
  line-height: 1.1;
  font-weight: 900;
  color: #fff;
  background: linear-gradient(to bottom, #ffffff, #fed7aa);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export const HeaderSub = styled.p`
  margin: 0;
  color: #34d399;
  font-size: 0.85rem;
`;

export const DetailText = styled.p`
  margin: 0;
  color: #94a3b8;
  font-size: 0.875rem;
  line-height: 1.6;
  font-family:
    "Inter",
    "Plus Jakarta Sans",
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
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
