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

export const EggGroupGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

export const EggGroupBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
`;

export const EggGroupIcon = styled.span`
  font-size: 1.25rem;
`;

export const EggGroupName = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: #1e40af;
  text-transform: capitalize;
`;

export const GenderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const GenderBar = styled.div`
  display: flex;
  width: 100%;
  height: 40px;
  box-shadow: 4px 4px 0 #374151;
  overflow: hidden;
`;

export const MaleBar = styled.div<{ percentage: number }>`
  width: ${(props) => props.percentage}%;
  background-color: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const FemaleBar = styled.div<{ percentage: number }>`
  width: ${(props) => props.percentage}%;
  background-color: #ec4899;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const GenderLabel = styled.span<{ show: boolean }>`
  font-size: 1rem;
  font-weight: 700;
  color: white;
  display: ${(props) => (props.show ? "block" : "none")};
`;

export const GenderLegend = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
`;

export const GenderLegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  p {
    font-size: 1rem;
    font-weight: 600;
    color: #374151;
  }
`;

export const MaleIcon = styled.span`
  font-size: 1.25rem;
  color: #3b82f6;
  font-weight: bold;
`;

export const FemaleIcon = styled.span`
  font-size: 1.25rem;
  color: #ec4899;
  font-weight: bold;
`;

export const GenderlessBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 32px 16px;
`;

export const GenderlessIcon = styled.span`
  font-size: 3rem;
  opacity: 0.5;
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
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

export const TipsCard = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Tip = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
`;

export const TipIcon = styled.div`
  font-size: 1.5rem;
  flex-shrink: 0;
`;

export const TipContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const TipTitle = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: #b45309;
`;

export const TipText = styled.div`
  font-size: 0.9rem;
  color: #78350f;
  line-height: 1.4;
`;

export const NoData = styled.div`
  text-align: center;
  padding: 32px 16px;
  color: #9ca3af;

  p {
    font-size: 1rem;
  }
`;
