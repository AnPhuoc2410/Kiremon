import styled from "@emotion/styled";

export const StatsContainer = styled.div`
  padding: 16px 0;
`;

export const StatItem = styled.div`
  display: grid;
  grid-template-columns: 120px 40px 1fr;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

export const StatName = styled.span`
  text-transform: capitalize;
  font-weight: 500;
  font-size: 14px;
  color: #4b5563;
`;

export const StatValue = styled.span`
  font-weight: 600;
  font-size: 16px;
  text-align: center;
`;

export const StatBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background-color: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
`;

export const StatBar = styled.div<{ value: number; color: string }>`
  height: 100%;
  width: ${(props) => Math.min(props.value / 2, 100)}%;
  background-color: ${(props) => props.color};
  border-radius: 4px;
  transition: width 0.3s ease-in-out;
`;

export const TotalStats = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
  font-weight: 600;
  font-size: 1rem;
`;

export const StatLabel = styled.span`
  margin-right: 8px;
  color: #6b7280;
`;

export const StatTotal = styled.span`
  color: #111827;
`;
