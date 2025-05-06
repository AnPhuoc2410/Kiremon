import styled from "@emotion/styled";
import { colors, units } from "../../../components/utils";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${units.spacing.base};
  margin: 0 auto;
  max-width: 1200px;
  min-height: calc(100vh - 60px); /* Account for navbar */
`;

export const BackButton = styled.button`
  background: ${colors.primary[500]};
  color: white;
  border: none;
  padding: ${units.spacing.xs} ${units.spacing.base};
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: ${units.spacing.xl};
  align-self: flex-start;
  font-weight: 500;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.2s ease;

  &:hover {
    background: ${colors.primary[600]};
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  }
`;

export const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${units.spacing.xl};
`;

export const RegionBanner = styled.div`
  width: 100%;
  height: 240px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  margin-bottom: ${units.spacing.base};
`;

export const RegionOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 40px ${units.spacing.xl} ${units.spacing.xl};
  background: linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0));
  color: white;
`;

export const RegionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 ${units.spacing.xs} 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
`;

export const RegionDescription = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
  max-width: 80%;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
`;

export const InfoContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: ${units.spacing.xl};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
  margin-bottom: ${units.spacing.sm};
`;

export const Section = styled.div`
  margin-top: ${units.spacing.sm};
  margin-bottom: ${units.spacing.xl};
`;

export const SectionTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0 0 ${units.spacing.base} 0;
  color: ${colors.text.primary};
`;

export const InfoItem = styled.div`
  display: flex;
  margin-bottom: ${units.spacing.sm};
  align-items: center;
`;

export const InfoLabel = styled.span`
  font-weight: 600;
  color: ${colors.text.secondary};
  width: 140px;
`;

export const InfoValue = styled.span`
  color: ${colors.text.primary};
`;

export const LocationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${units.spacing.sm};

  @media (min-width: ${units.screenSize.sm}) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: ${units.screenSize.lg}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const LocationCard = styled.div`
  background-color: ${colors["gray-100"]};
  padding: ${units.spacing.sm};
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  font-size: 0.9rem;
  color: ${colors.text.primary};
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
    background-color: ${colors.primary[100]};
  }
`;

export const PokemonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${units.spacing.base};

  @media (min-width: ${units.screenSize.sm}) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: ${units.screenSize.md}) {
    grid-template-columns: repeat(5, 1fr);
  }
`;

export const PokemonCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  border-radius: 12px;
  padding: ${units.spacing.base} ${units.spacing.xs};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
    background-color: ${colors.primary[100]};
  }
`;

export const PokemonImage = styled.img`
  width: 80px;
  height: 80px;
  margin-bottom: ${units.spacing.xs};
`;

export const PokemonName = styled.div`
  font-weight: 500;
  font-size: 0.9rem;
  text-align: center;
  color: ${colors.text.primary};
`;

export const PokemonNumber = styled.div`
  font-size: 0.8rem;
  color: ${colors.text.secondary};
  margin-top: 4px;
`;

export const ShowMoreButton = styled.button`
  display: block;
  margin: ${units.spacing.xl} auto 0;
  background: ${colors.primary[500]};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.2s ease;

  &:hover {
    background: ${colors.primary[600]};
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
  }
`;

export const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  width: 100%;

  p {
    font-size: 1.1rem;
    color: ${colors.text.secondary};
  }
`;

export const ErrorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 300px;
  width: 100%;

  p {
    font-size: 1.1rem;
    color: ${colors.error[500]};
    margin-bottom: ${units.spacing.base};
  }

  button {
    background: ${colors.primary[500]};
    color: white;
    border: none;
    padding: ${units.spacing.xs} ${units.spacing.base};
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  }
`;
