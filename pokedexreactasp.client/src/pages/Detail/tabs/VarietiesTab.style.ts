import styled from "@emotion/styled";

export const VarietiesContainer = styled.div`
  margin-bottom: 24px;
`;

export const VarietiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
  margin-top: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 12px;
  }
`;

export const DefaultBadge = styled.span`
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 10;
  display: inline-block;
  padding: 4px 10px;
  background-color: #fef3c7;
  color: #d97706;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1px solid #fcd34d;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const CurrentBadge = styled.span`
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
  display: inline-block;
  padding: 4px 10px;
  background-color: #dbeafe;
  color: #1d4ed8;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1px solid #93c5fd;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;
