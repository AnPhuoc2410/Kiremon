import styled from "@emotion/styled";

export const StatsContainer = styled.div`
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 32px;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    gap: 48px;
  }
`;

export const StatsList = styled.div`
  flex: 1;
  width: 100%;
`;

export const ChartContainer = styled.div`
  flex: 1;
  width: 100%;
  height: 300px; /* Explicit height for Recharts */
  min-width: 0; /* Fix for flexbox overflow */
  max-width: 500px;
  margin: 0 auto;

  @media (min-width: 768px) {
    height: 400px; /* Larger chart on desktop */
  }
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
  height: 12px;
  background-color: #e5e7eb;
  overflow: hidden;
`;

export const StatBar = styled.div<{ value: number; color: string }>`
  height: 100%;
  width: ${(props) => Math.min(props.value / 2, 100)}%;
  background-color: ${(props) => props.color};
  transition: width 0.3s ease-in-out;
`;

export const TotalStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  padding: 16px;
  border: 2px solid #e5e7eb;
  background-color: #f9fafb;
  font-weight: 700;
  font-size: 1.125rem;
  /* Pixel font if globally available usually inherits, but we can enforce if needed */
`;

export const StatLabel = styled.span`
  color: #6b7280;
  text-transform: uppercase;
  font-size: 0.875rem;
  font-weight: 600;
`;

export const StatTotal = styled.span`
  color: #111827;
  font-size: 1.25rem;
`;
