import styled from "@emotion/styled";
import { colors, units } from "../../../components/utils";

export const RegionContainer = styled.section`
  max-width: ${units.screenSize["xl"]};
  margin: 0 auto;
  padding: 10px 16px;
  text-align: center;

  @media screen and (min-width: ${units.screenSize["xl"]}) {
    padding: 10px 0;
  }
`;

export const RegionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${units.spacing.lg};
  margin: ${units.spacing.xl} 0;
`;

export const RegionCard = styled.div`
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
  }
`;

export const RegionImage = styled.div`
  height: 160px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

export const RegionInfo = styled.div`
  padding: ${units.spacing.xs};
`;

export const RegionName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: ${units.spacing.xs};
  color: ${colors["gray-800"]};
`;

export const RegionDescription = styled.p`
  font-size: 0.875rem;
  color: ${colors["gray-600"]};
  margin-bottom: ${units.spacing.xs};
`;

export const PokemonCount = styled.span`
  display: inline-block;
  padding: ${units.spacing.xs} ${units.spacing.sm};
  background-color: ${colors["yellow-100"]};
  color: ${colors["yellow-800"]};
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
