import styled from "@emotion/styled";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 8px 0;
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;

  h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0;
    text-transform: uppercase;
  }
`;

export const IconWrapper = styled.div`
  display: none;
`;

export const Card = styled.div`
  padding: 16px;
`;

export const EVGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
`;

export const EVItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
`;

export const EVName = styled.div`
  font-size: 1rem;
  font-weight: 600;
  text-transform: capitalize;
`;

export const EVValue = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: #3b82f6;
  padding: 4px 10px;
`;

export const EVTotal = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  padding: 14px;
  margin-top: 8px;

  p {
    font-size: 1rem;
    color: #b45309;
  }
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
`;

export const InfoCard = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const InfoLabel = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
`;

export const InfoValue = styled.div`
  font-size: 1.75rem;
  font-weight: 800;
  color: #1f2937;
  line-height: 1;
`;

export const InfoDescription = styled.div`
  font-size: 0.85rem;
  color: #9ca3af;
  margin-top: 4px;
`;

export const CatchRateBar = styled.div`
  width: 100%;
  height: 10px;
  background-color: #e5e7eb;
`;

export const CatchRateFill = styled.div<{ rate: number }>`
  height: 100%;
  width: ${(props) => (props.rate / 255) * 100}%;
  background-color: #10b981;
`;

export const HappinessBar = styled.div`
  width: 100%;
  height: 10px;
  background-color: #e5e7eb;
`;

export const HappinessFill = styled.div<{ happiness: number }>`
  height: 100%;
  width: ${(props) => (props.happiness / 255) * 100}%;
  background-color: #f59e0b;
`;

export const GrowthRateBadge = styled.div<{ rate: string }>`
  padding: 10px;
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: capitalize;
  text-align: left;
  color: ${(props) => getGrowthRateColor(props.rate)};
  box-shadow: ${(props) => getGrowthRateColor(props.rate)};
`;

export const NoData = styled.div`
  text-align: center;
  padding: 32px 16px;
  color: #9ca3af;

  p {
    font-size: 1rem;
  }
`;

function getGrowthRateColor(rate: string): string {
  const colors: Record<string, string> = {
    slow: "#EF4444",
    medium: "#3B82F6",
    fast: "#10B981",
    "medium-slow": "#F59E0B",
    "slow-then-very-fast": "#8B5CF6",
    "fast-then-very-slow": "#EC4899",
  };
  return colors[rate] || "#9CA3AF";
}
