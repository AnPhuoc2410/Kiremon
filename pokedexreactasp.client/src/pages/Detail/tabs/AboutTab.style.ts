import styled from "@emotion/styled";

export const ClassificationBanner = styled.div<{ isLegendary?: boolean; isMythical?: boolean }>`
  margin-bottom: 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
`;

export const ClassificationBadge = styled.div<{ type: 'legendary' | 'mythical' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  box-shadow: 4px 4px 0 ${props => props.type === 'legendary' ? '#F59E0B' : '#8B5CF6'};

  p {
    color: ${props => props.type === 'legendary' ? '#B45309' : '#6D28D9'};
    font-weight: 700;
    font-size: 1.1rem;
  }
`;

export const BadgeIcon = styled.span`
  font-size: 1.5rem;
`;

export const BasicInfoSection = styled.div`
  margin-bottom: 24px;
`;

export const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;

  h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1F2937;
    margin: 0;
    text-transform: uppercase;
  }
`;

export const IconWrapper = styled.div`
  display: none;
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
`;

export const InfoIcon = styled.div`
  display: none;
`;

export const InfoContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const InfoLabel = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: #6B7280;
  text-transform: uppercase;
`;

export const InfoValue = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: #1F2937;
  text-transform: capitalize;
`;

export const AbilitiesContainer = styled.div`
  margin-bottom: 24px;
`;

export const AbilitiesGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 8px;
`;

export const AbilityCard = styled.div<{ isHidden?: boolean }>`
  padding: 10px 16px;
  box-shadow: 4px 4px 0 ${props => props.isHidden ? '#F3F4F6' : 'white'};
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
`;

export const AbilityName = styled.span`
  text-transform: capitalize;
  font-size: 1rem;
  font-weight: 600;
  color: #1F2937;
`;

export const AbilityHiddenLabel = styled.span`
  font-size: 0.75rem;
  color: #B45309;
  font-weight: 600;
  margin-top: 2px;
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
  margin-top: 12px;
  justify-content: center;
`;

export const FormItem = styled.div`
  text-align: center;
  padding: 8px;
  box-shadow: 4px 4px 0 #E5E7EB;
`;

export const FormName = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: capitalize;
  color: #374151;
`;

export const HeldItemsContainer = styled.div`
  margin-bottom: 24px;
`;

export const ItemsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 12px;
`;

export const HeldItemWrapper = styled.div`
  position: relative;
  display: inline-block;
  cursor: pointer;

  &:hover > div {
    opacity: 1;
    visibility: visible;
  }
`;

export const HeldItemImage = styled.img`
  width: 48px;
  height: 48px;
  image-rendering: pixelated;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.2);
  }
`;

export const HeldItemTooltip = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 6px 12px;
  background-color: #1F2937;
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: capitalize;
  white-space: nowrap;
  box-shadow: 4px 4px 0 #374151;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s, visibility 0.2s;
  z-index: 10;
  margin-bottom: 8px;
`;

export const ItemCard = styled.div`
  padding: 10px 14px;
  box-shadow: 4px 4px 0 #E5E7EB;
`;

export const ItemName = styled.div`
  text-transform: capitalize;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 4px;
  color: #111827;
`;

export const ItemDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const ItemDetail = styled.div`
  font-size: 0.8rem;
  color: #6B7280;
  text-transform: capitalize;
`;
