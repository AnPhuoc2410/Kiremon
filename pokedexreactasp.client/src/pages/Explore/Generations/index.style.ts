import styled from "@emotion/styled";
import { colors, units } from "@/components/utils";

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
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.12);
  }
`;

export const GenerationBanner = styled.div<{ imageUrl: string }>`
  height: 160px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background-image: url(${(props) => props.imageUrl});
  background-size: cover;
  background-position: center;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.55));
    backdrop-filter: blur(1px);
  }
`;

export const GenerationTitle = styled.h2`
  font-size: 1.55rem;
  font-weight: 800;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.45);
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
  font-weight: 700;
  color: ${colors["gray-800"]};
`;

export const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  padding: ${units.spacing.xs} ${units.spacing.base};
  background-color: ${colors["blue-500"]};
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  margin-top: ${units.spacing.base};
  transition:
    background-color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    background-color: ${colors["blue-600"]};
    transform: translateY(-2px);
  }
`;

export const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  width: 100%;
`;
