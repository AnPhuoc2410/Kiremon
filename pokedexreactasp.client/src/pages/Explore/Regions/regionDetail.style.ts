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

export const BackButton = styled.button<{ bg?: string; hoverBg?: string }>`
  background: ${({ bg }) => bg || colors.primary[500]};
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
    background: ${({ hoverBg, bg }) => hoverBg || bg || colors.primary[600]};
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
  height: 280px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  margin-bottom: ${units.spacing.base};
`;

export const RegionOverlay = styled.div<{ overlayTint?: string }>`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 48px ${units.spacing.xl} ${units.spacing.xl};
  background: ${({ overlayTint }) =>
    overlayTint
      ? `linear-gradient(to top, rgba(0,0,0,0.65), ${overlayTint} 40%, rgba(0,0,0,0) 70%)`
      : `linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0))`};
  color: white;
`;

export const RegionTitle = styled.h2`
  font-size: 2.25rem;
  font-weight: 800;
  margin: 0 0 ${units.spacing.xs} 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.35);
`;

export const RegionDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
  max-width: 80%;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
`;

export const InfoContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: ${units.spacing.xl};
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.06);
  margin-bottom: ${units.spacing.sm};
`;

export const Section = styled.div`
  margin-top: ${units.spacing.sm};
  margin-bottom: ${units.spacing.xl};
`;

export const SectionTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
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
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  font-size: 0.95rem;
  color: ${colors.text.primary};
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1), 0 2px 6px rgba(0, 0, 0, 0.08);
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
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  border-radius: 14px;
  padding: ${units.spacing.base} ${units.spacing.xs};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
    background-color: ${colors.primary[100]};
  }
`;

export const NumberBadge = styled.div<{ bg?: string }>`
  position: absolute;
  top: 8px;
  left: 10px;
  background: ${({ bg }) => bg || colors.primary[600]};
  color: white;
  border-radius: 9999px;
  padding: 2px 8px;
  font-size: 0.7rem;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
`;

export const PokemonImage = styled.img`
  width: 90px;
  height: 90px;
  margin-bottom: ${units.spacing.xs};
`;

export const PokemonName = styled.div`
  font-weight: 600;
  font-size: 0.95rem;
  text-align: center;
  color: ${colors.text.primary};
`;

export const PokemonNumber = styled.div`
  font-size: 0.8rem;
  color: ${colors.text.secondary};
  margin-top: 4px;
`;

export const ShowMoreButton = styled.button<{ bg?: string; hoverBg?: string }>`
  display: block;
  margin: ${units.spacing.xl} auto 0;
  background: ${({ bg }) => bg || colors.primary[500]};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  transition: all 0.2s ease;

  &:hover {
    background: ${({ hoverBg, bg }) => hoverBg || bg || colors.primary[600]};
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.12);
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

export const CatchButton = styled.button<{ bg?: string; hoverBg?: string }>`
  background: ${({ bg }) => bg || colors.primary[600]};
  color: white;
  border: none;
  padding: ${units.spacing.sm} ${units.spacing.lg};
  border-radius: 30px;
  font-weight: 700;
  font-size: 1.05rem;
  cursor: pointer;
  margin-top: ${units.spacing.base};
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  max-width: 420px;

  &:before {
    content: "🔴";
    margin-right: ${units.spacing.xs};
    font-size: 1.1rem;
  }

  &:hover {
    background: ${({ hoverBg, bg }) => hoverBg || bg || colors.primary[700]};
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
`;

export const SectionHeader = styled.div`
  margin-bottom: ${units.spacing.base};
`;

export const SectionSubtitle = styled.p`
  color: ${colors.text.secondary};
  font-size: 1rem;
  margin: 0;
  margin-top: -5px;
`;

export const ShowMoreButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: ${units.spacing.xl};
`;

export const ButtonDescription = styled.p`
  color: ${colors.text.secondary};
  font-size: 0.9rem;
  margin: ${units.spacing.xs} 0 0 0;
  text-align: center;
`;

export const TypeContainer = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 6px;
  justify-content: center;
  flex-wrap: wrap;
`;

export const TypeBadge = styled.div<{ type: string }>`
  padding: 2px 6px;
  border-radius: 12px;
  font-size: 0.7rem;
  text-transform: capitalize;
  color: white;
  background-color: ${({ type }) => {
    switch (type) {
      case 'normal': return '#A8A77A';
      case 'fire': return '#EE8130';
      case 'water': return '#6390F0';
      case 'electric': return '#F7D02C';
      case 'grass': return '#7AC74C';
      case 'ice': return '#96D9D6';
      case 'fighting': return '#C22E28';
      case 'poison': return '#A33EA1';
      case 'ground': return '#E2BF65';
      case 'flying': return '#A98FF3';
      case 'psychic': return '#F95587';
      case 'bug': return '#A6B91A';
      case 'rock': return '#B6A136';
      case 'ghost': return '#735797';
      case 'dragon': return '#6F35FC';
      case 'dark': return '#705746';
      case 'steel': return '#B7B7CE';
      case 'fairy': return '#D685AD';
      default: return '#777';
    }
  }};
  font-weight: 500;
`;

export const LoadingMore = styled.div`
  text-align: center;
  padding: ${units.spacing.xl};
  margin-top: ${units.spacing.sm};
  display: flex;
  justify-content: center;
`;

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${units.spacing.base};
`;

export const NumberToggle = styled.button<{ bg?: string; hoverBg?: string; textColor?: string; borderColor?: string }>`
  background: ${({ bg }) => bg || colors["gray-200"]};
  color: ${({ textColor }) => textColor || colors.text.secondary};
  border: 1px solid ${({ borderColor }) => borderColor || colors["gray-300"]};
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: ${({ hoverBg }) => hoverBg || colors.primary[100]};
    color: ${colors.primary[700]};
    border-color: ${colors.primary[300]};
  }
`;

export const SmallToggle = styled.button<{ bg?: string; hoverBg?: string; textColor?: string; borderColor?: string }>`
  background: ${({ bg }) => bg || colors["gray-200"]};
  color: ${({ textColor }) => textColor || colors.text.secondary};
  border: 1px solid ${({ borderColor }) => borderColor || colors["gray-300"]};
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ hoverBg }) => hoverBg || colors.primary[100]};
    color: ${colors.primary[700]};
    border-color: ${colors.primary[300]};
  }
`;

export const LocationIcon = styled.span`
  margin-right: 6px;
  font-size: 1rem;
  display: inline-block;
`;

// New: Stats row and pills
export const StatsRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: ${units.spacing.xs};
`;

export const StatPill = styled.span`
  background: ${colors["gray-100"]};
  color: ${colors.text.primary};
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
`;

// New: Hero actions under banner
export const HeroActions = styled.div`
  margin-top: ${units.spacing.sm};
  display: flex;
  gap: ${units.spacing.sm};
  flex-wrap: wrap;
`;

export const PrimaryAction = styled.button<{ bg?: string; hoverBg?: string }>`
  background: ${({ bg }) => bg || colors.primary[600]};
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 9999px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;

  &:hover { transform: translateY(-2px); box-shadow: 0 6px 12px rgba(0,0,0,0.2); background: ${({ hoverBg, bg }) => hoverBg || bg || colors.primary[700]}; }
`;

export const SecondaryAction = styled.button<{ borderColor?: string; textColor?: string; hoverBg?: string }>`
  background: rgba(255,255,255,0.85);
  color: ${({ textColor }) => textColor || colors.text.primary};
  border: 1px solid ${({ borderColor }) => borderColor || colors["gray-300"]};
  padding: 8px 14px;
  border-radius: 9999px;
  font-weight: 700;
  cursor: pointer;
  backdrop-filter: blur(6px);
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;

  &:hover { transform: translateY(-2px); box-shadow: 0 6px 12px rgba(0,0,0,0.12); background: ${({ hoverBg }) => hoverBg || 'rgba(255,255,255,0.95)'}; }
`;
