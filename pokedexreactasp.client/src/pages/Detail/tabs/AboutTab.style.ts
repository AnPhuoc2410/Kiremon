import styled from "@emotion/styled";

export const AbilitiesContainer = styled.div`
  margin-bottom: 24px;
`;

export const AbilitiesGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

export const AbilityCard = styled.div<{ isHidden?: boolean }>`
  padding: 8px 14px;
  background-color: ${props => props.isHidden ? '#F3F4F6' : 'white'};
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
`;

export const AbilityName = styled.span`
  text-transform: capitalize;
  font-size: 20px;
`;

export const AbilityHiddenLabel = styled.span`
  font-size: 10px;
  color: #6B7280;
`;

export const RelatedPokemonSection = styled.div`
  margin-bottom: 24px;
`;

export const FormsContainer = styled.div`
  margin-bottom: 24px;
`;

export const FormsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 16px;
  justify-content: center;
`;

export const FormItem = styled.div`
  text-align: center;
`;

export const FormName = styled.div`
  font-size: 12px;
  text-transform: capitalize;
`;

export const HeldItemsContainer = styled.div`
  margin-bottom: 24px;
`;

export const ItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
  margin-top: 12px;
`;

export const ItemCard = styled.div`
  padding: 12px 16px;
  background-color: #F9FAFB;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 3px 6px rgba(0,0,0,0.15);
  }
`;

export const ItemName = styled.div`
  text-transform: capitalize;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 6px;
  color: #111827;
`;

export const ItemDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ItemDetail = styled.div`
  font-size: 12px;
  color: #6B7280;
  text-transform: capitalize;
`;
