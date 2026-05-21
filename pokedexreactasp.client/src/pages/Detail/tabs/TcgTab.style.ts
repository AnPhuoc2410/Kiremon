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
  width: min(1120px, 100%);
  max-height: 90vh;
  overflow: auto;
  background: linear-gradient(145deg, #0f172a 0%, #1f2937 100%);
  border-radius: 14px;
  padding: 20px;
  display: grid;
  gap: 18px;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
`;

export const CloseButton = styled.button`
  border: none;
  background: rgba(255, 255, 255, 0.18);
  color: #f8fafc;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
`;

export const DetailLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr minmax(360px, 460px);
  gap: 22px;
  align-items: center;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

export const CardStage = styled.div`
  display: grid;
  place-items: center;
  perspective: 1400px;
  min-height: 580px;

  @media (max-width: 860px) {
    min-height: auto;
  }
`;

export const DetailImage = styled.img`
  width: min(480px, 100%);
  border-radius: 16px;
  background: #f9fafb;
  box-shadow:
    0 30px 40px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.15);
  transform: rotateY(-10deg) rotateX(4deg);
  transition: transform 0.25s ease;

  &:hover {
    transform: rotateY(-4deg) rotateX(2deg) translateY(-4px);
  }
`;

export const DetailBlock = styled.div`
  display: grid;
  gap: 10px;
  background: rgba(107, 114, 128, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(8px);
  border-radius: 14px;
  padding: 16px;
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
  background: rgba(15, 23, 42, 0.6);
  color: #e2e8f0;
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
