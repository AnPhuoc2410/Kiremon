import styled from "@emotion/styled";
import { colors, units } from "@/components/utils";

export const RegionContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${units.spacing.base};
  margin: 0 auto;
  max-width: 1200px;
  min-height: calc(100vh - 60px); /* Account for navbar */
`;

export const BackButton = styled.button<{ bg?: string; hoverBg?: string }>`
  background: ${({ bg }) => bg || colors.primary[500]};
  color: white;
  border: none;
  padding: ${units.spacing.xs} ${units.spacing.base};
  border-radius: 10px;
  cursor: pointer;
  margin-bottom: ${units.spacing.xl};
  align-self: flex-start;
  font-weight: 600;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  transition: all 0.2s ease;

  &:hover {
    background: ${({ hoverBg, bg }) => hoverBg || bg || colors.primary[600]};
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.14);
  }
`;

export const RegionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: ${units.spacing.xl};
  width: 100%;

  @media (min-width: ${units.screenSize.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${units.screenSize.lg}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const RegionCard = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.12);
  }
`;

export const RegionImage = styled.div`
  width: 100%;
  height: 180px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;

  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    background: linear-gradient(
      to top,
      rgba(255, 255, 255, 1),
      rgba(255, 255, 255, 0)
    );
  }
`;

export const RegionInfo = styled.div`
  padding: ${units.spacing.base};
`;

export const RegionName = styled.h3`
  margin: 0 0 ${units.spacing.xs} 0;
  font-size: 1.4rem;
  font-weight: 800;
  color: ${colors.text.primary};
`;

export const RegionDescription = styled.p`
  margin: 0 0 ${units.spacing.base} 0;
  font-size: 0.92rem;
  color: ${colors.text.secondary};
  line-height: 1.6;
`;

export const PokemonCount = styled.div<{ bg?: string; text?: string }>`
  display: inline-block;
  background-color: ${({ bg }) => bg || colors.primary[100]};
  color: ${({ text }) => text || colors.primary[700]};
  font-weight: 700;
  font-size: 0.78rem;
  padding: 6px 10px;
  border-radius: 9999px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
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
    box-shadow:
      0 1px 3px rgba(0, 0, 0, 0.12),
      0 1px 2px rgba(0, 0, 0, 0.24);
  }
`;
