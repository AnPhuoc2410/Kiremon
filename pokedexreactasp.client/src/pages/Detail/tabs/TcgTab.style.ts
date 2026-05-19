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
  width: min(980px, 100%);
  max-height: 90vh;
  overflow: auto;
  background: #ffffff;
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
  background: #111827;
  color: #ffffff;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
`;

export const DetailLayout = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 18px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

export const DetailImage = styled.img`
  width: 100%;
  border-radius: 10px;
  background: #f9fafb;
`;

export const DetailBlock = styled.div`
  display: grid;
  gap: 10px;
`;

export const Label = styled.span`
  color: #6b7280;
  font-size: 0.85rem;
`;

export const Value = styled.span`
  color: #111827;
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
  background: #eef2ff;
  color: #3730a3;
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
