import styled from "@emotion/styled";
import { colors, units } from "../../../components/utils";

export const GenerationsContainer = styled.section`
  max-width: ${units.screenSize["xl"]};
  margin: 0 auto;
  padding: 10px 16px;
  text-align: center;

  @media screen and (min-width: ${units.screenSize["xl"]}) {
    padding: 10px 0;
  }
`;

export const GenerationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${units.spacing.lg};
  margin: ${units.spacing.xl} 0;
`;

export const GenerationCard = styled.div`
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

export const GenerationBanner = styled.div<{ imageUrl: string }>`
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background-image: url(${props => props.imageUrl});
  background-size: cover;
  background-position: center;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6));
  }
`;

export const GenerationTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  z-index: 1;
`;

export const GameLogos = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${units.spacing.sm};
  padding: ${units.spacing.xs};
`;

export const GameLogo = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${colors["gray-200"]};
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
`;

export const GenerationInfo = styled.div`
  padding: ${units.spacing.base};
`;

export const GenerationDetails = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${units.spacing.sm};
`;

export const Detail = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const DetailLabel = styled.span`
  font-size: 0.75rem;
  color: ${colors["gray-500"]};
`;

export const DetailValue = styled.span`
  font-weight: 600;
  color: ${colors["gray-800"]};
`;

export const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  padding: ${units.spacing.xs} ${units.spacing.base};
  background-color: ${colors["blue-500"]};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  margin-top: ${units.spacing.base};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${colors["blue-600"]};
  }
`;

export const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  width: 100%;
`;
