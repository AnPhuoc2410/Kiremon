import styled from "@emotion/styled";
import { colors, units } from "../../../components/utils";

export const TypesContainer = styled.section`
  max-width: ${units.screenSize["xl"]};
  margin: 0 auto;
  padding: 10px 16px;
  text-align: center;

  @media screen and (min-width: ${units.screenSize["xl"]}) {
    padding: 10px 0;
  }
`;

export const TypesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: ${units.spacing.xs};
  margin: ${units.spacing.xl} 0;
`;

export const TypeCard = styled.div<{ typeColor: string }>`
  background-color: ${props => props.typeColor || colors["gray-300"]};
  color: white;
  border-radius: 12px;
  padding: ${units.spacing.lg};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 150px;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
  }
`;

export const TypeIcon = styled.div`
  width: 60px;
  height: 60px;
  margin-bottom: ${units.spacing.sm};
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
`;

export const TypeName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: ${units.spacing.xs};
`;

export const PokemonCount = styled.span`
  display: inline-block;
  padding: ${units.spacing.xs} ${units.spacing.sm};
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
`;

export const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  padding: ${units.spacing.xs} ${units.spacing.xs};
  background-color: ${colors["blue-500"]};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  margin-top: ${units.spacing.xs};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${colors["blue-600"]};
  }
`;
