import styled from "@emotion/styled";
import { colors, units } from "@/components/utils";
import { keyframes } from "@emotion/react";

// New full-width container for the background color
export const PageWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  padding-bottom: 70px; // Account for navbar height
`;

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
  gap: ${units.spacing.lg};
  margin: ${units.spacing.xl} 0;
`;

export const TypeCard = styled.div<{ typeColor: string }>`
  background-color: ${(props) => props.typeColor || colors["gray-300"]};
  color: white;
  border-radius: 12px;
  padding: ${units.spacing.lg};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
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

export const TypeIcon = styled.div<{ icon: string }>`
  width: 60px;
  height: 60px;
  margin-bottom: ${units.spacing.sm};
  background-image: url(${(props) => props.icon});
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

// Loading animation
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${units.spacing.xl} 0;
  color: ${colors["gray-600"]};
`;

export const LoadingSpinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: ${colors["blue-500"]};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: ${spin} 1s linear infinite;
  margin-bottom: ${units.spacing.base};
`;

export const ErrorMessage = styled.div`
  color: ${colors["red-500"]};
  padding: ${units.spacing.xl} 0;
  text-align: center;
`;

export const SelectedTypeHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: ${units.spacing.base};
`;

export const BackToTypesButton = styled.button`
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  padding: ${units.spacing.xs} ${units.spacing.base};
  background: none;
  color: ${colors["blue-500"]};
  border: none;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: ${units.spacing.base};
  transition: color 0.2s ease;

  &:hover {
    color: ${colors["blue-600"]};
  }
`;

export const SelectedTypeInfo = styled.div<{ typeColor: string }>`
  display: flex;
  align-items: center;
  padding: ${units.spacing.sm} ${units.spacing.lg};
  background-color: ${(props) => props.typeColor};
  border-radius: 12px;
  margin-bottom: ${units.spacing.base};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const SelectedTypeName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin: 0 0 0 ${units.spacing.sm};
`;

// Pokemon grid and card styles
export const PokemonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: ${units.spacing.xl};
  margin: ${units.spacing.lg} 0;
`;

export const PokemonCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${units.spacing.xl};
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

export const PokemonImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: contain;
  margin-bottom: ${units.spacing.sm};
`;

export const PokemonName = styled.h4`
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
  margin: 0;
  color: ${colors["gray-700"]};
`;
