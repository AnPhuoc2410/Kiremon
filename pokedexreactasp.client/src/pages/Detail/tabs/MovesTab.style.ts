import styled from "@emotion/styled";

// Type Defense Styles
export const TypeDefenseContainer = styled.div`
  margin-bottom: 32px;
`;

export const TypeDefenseDescription = styled.p`
  margin-bottom: 12px;
  color: #4b5563;
  font-size: 14px;
`;

export const TypeDefenseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 12px;
  margin-top: 16px;
  margin-bottom: 32px;
`;

export const TypeEffectiveness = styled.div<{ effectiveness: string }>`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 8px;
  background-color: ${(props) => {
    switch (props.effectiveness) {
      case "weak":
        return "#FECACA"; // Light red
      case "resistant":
        return "#BBFAC9"; // Light green
      case "immune":
        return "#E5E7EB"; // Light gray
      default:
        return "#F3F4F6";
    }
  }};
  color: ${(props) => {
    switch (props.effectiveness) {
      case "weak":
        return "#991B1B"; // Dark red
      case "resistant":
        return "#166534"; // Dark green
      case "immune":
        return "#374151"; // Dark gray
      default:
        return "#1F2937";
    }
  }};
`;

export const TypeBadge = styled.span`
  text-transform: capitalize;
  font-weight: 500;
  font-size: 14px;
  margin-left: 8px;
`;

export const MultiplierBadge = styled.span`
  background-color: rgba(255, 255, 255, 0.5);
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: auto;
  font-size: 12px;
  font-weight: bold;
`;

// Move Pool Styles
export const MovePoolContainer = styled.div`
  margin-top: 24px;
`;

export const MoveCategory = styled.div`
  margin-bottom: 24px;
`;

export const MoveCategoryTitle = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;

  h4 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
  }

  .count {
    margin-left: 8px;
    background-color: #e5e7eb;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 14px;
  }
`;

export const MoveGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 10px;
`;

export const MoveItem = styled.div`
  background-color: #f9fafb;
  padding: 10px 14px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  .move-name {
    text-transform: capitalize;
    font-weight: 500;
    font-size: 1rem;
  }

  .move-details {
    font-size: 12px;
    color: #6b7280;
    display: flex;
    justify-content: space-between;
  }
`;

export const MoreMovesItem = styled(MoveItem)`
  background-color: #e5e7eb;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
`;
