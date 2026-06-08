import styled from "@emotion/styled";
import { colors, units } from "@/components/utils";

const panelShadow = `
  0 2px 4px rgba(16, 24, 40, 0.08),
  0 1px 2px rgba(16, 24, 40, 0.05)
`;

export const Container = styled.div`
  max-width: ${units.screenSize["xl"]};
  margin: 0 auto;
  padding: 10px 16px 80px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const Page = styled.main`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

// Sync Status Banner
export const SyncBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
  border-radius: 12px;
  background: ${colors["blue-100"]};
  border: 1px dashed ${colors["blue-300"]};
  font-family: "VT323", monospace;
  font-size: 18px;
  color: ${colors["blue-800"]};
  box-shadow: ${panelShadow};

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
`;

export const SyncInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const PokéballIcon = styled.img<{ $loading?: boolean }>`
  width: 24px;
  height: 24px;
  image-rendering: pixelated;
  animation: ${(props) =>
    props.$loading ? "spin 1s linear infinite" : "none"};

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

export const SyncButton = styled.button`
  background: ${colors["blue-500"]};
  border: 2px solid ${colors["gray-900"]};
  border-radius: 6px;
  color: white;
  padding: 6px 12px;
  cursor: pointer;
  font-family: "VT323", monospace;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: inset -3px -3px ${colors["blue-700"]};
  transition: transform 0.1s ease;

  &:hover {
    background: ${colors["blue-400"]};
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
    box-shadow: inset 3px 3px ${colors["blue-700"]};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// Featured Hero Section
export const HeroSection = styled.article`
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 20px;
  border: 4px solid ${colors["red-600"]};
  border-radius: 16px;
  background: #ffffff;
  padding: 24px;
  box-shadow: ${panelShadow};
  cursor: pointer;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(239, 68, 68, 0.15);

    img {
      transform: scale(1.03);
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const HeroImageWrapper = styled.div`
  width: 100%;
  height: 300px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid ${colors["gray-900"]};
  background: ${colors["gray-100"]};
  position: relative;
`;

export const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
`;

export const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
`;

export const CategoryBadge = styled.span<{ $category: string }>`
  font-family: "VT323", monospace;
  font-size: 16px;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 4px;
  border: 1.5px solid ${colors["gray-900"]};
  width: fit-content;

  ${(props) => {
    const cat = props.$category.toLowerCase();
    if (cat.includes("tcg") || cat.includes("card")) {
      return `background: ${colors["yellow-200"]}; color: ${colors["yellow-800"]};`;
    }
    if (cat.includes("game") || cat.includes("switch")) {
      return `background: ${colors["red-100"]}; color: ${colors["red-700"]};`;
    }
    if (cat.includes("anime") || cat.includes("movie")) {
      return `background: ${colors["sky-100"]}; color: ${colors["sky-700"]};`;
    }
    if (cat.includes("mobile") || cat.includes("go")) {
      return `background: ${colors["green-100"]}; color: ${colors["green-700"]};`;
    }
    return `background: ${colors["gray-100"]}; color: ${colors["gray-700"]};`;
  }}
`;

export const HeroTitle = styled.h2`
  font-family: "VT323", monospace;
  font-size: clamp(24px, 3.5vw, 36px);
  color: ${colors["gray-900"]};
  margin: 0;
  line-height: 1.1;
`;

export const HeroSummary = styled.p`
  color: ${colors["gray-600"]};
  font-size: 16px;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const HeroMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-family: "VT323", monospace;
  font-size: 16px;
  color: ${colors["gray-500"]};
`;

// Filter & Toolbar
export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: ${panelShadow};
  border: 2px solid ${colors["gray-300"]};

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const FilterTabs = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const FilterTab = styled.button<{ $active: boolean }>`
  font-family: "VT323", monospace;
  font-size: 18px;
  padding: 6px 12px;
  border-radius: 6px;
  border: 2px solid ${colors["gray-900"]};
  cursor: pointer;
  background: ${(props) => (props.$active ? colors["yellow-300"] : "white")};
  color: ${colors["gray-900"]};
  box-shadow: ${(props) =>
    props.$active ? `inset -2px -2px ${colors["yellow-500"]}` : "none"};
  transition: all 0.1s ease;

  &:hover {
    background: ${(props) =>
      props.$active ? colors["yellow-300"] : colors["gray-100"]};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(1px);
  }
`;

export const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  border: 2px solid ${colors["gray-300"]};
  border-radius: 8px;
  padding: 6px 10px;
  background: white;
  max-width: 320px;
  width: 100%;

  @media (max-width: 640px) {
    max-width: none;
  }
`;

export const SearchInput = styled.input`
  border: none;
  outline: none;
  font-family: "VT323", monospace;
  font-size: 18px;
  width: 100%;
  color: ${colors["gray-900"]};

  &::placeholder {
    color: ${colors["gray-400"]};
  }
`;

// News Grid Section
export const NewsGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 20px;
`;

// Article Card
export const Card = styled.div`
  display: flex;
  flex-direction: column;
  border: 3px solid ${colors["gray-900"]};
  border-radius: 12px;
  background: white;
  overflow: hidden;
  box-shadow: 4px 4px 0px ${colors["gray-900"]};
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0px ${colors["gray-900"]};
  }

  &:active {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px ${colors["gray-900"]};
  }
`;

export const CardImageWrapper = styled.div`
  width: 100%;
  height: 180px;
  overflow: hidden;
  border-bottom: 2px solid ${colors["gray-900"]};
  background: ${colors["gray-100"]};
`;

export const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const CardBody = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-grow: 1;
`;

export const CardTitle = styled.h3`
  font-family: "VT323", monospace;
  font-size: 22px;
  color: ${colors["gray-900"]};
  margin: 0;
  line-height: 1.1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 48px;
`;

export const CardSummary = styled.p`
  color: ${colors["gray-600"]};
  font-size: 14px;
  line-height: 1.4;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-grow: 1;
`;

export const CardFooter = styled.div`
  padding: 12px 16px;
  border-top: 1px dashed ${colors["gray-300"]};
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: "VT323", monospace;
  font-size: 16px;
  color: ${colors["gray-500"]};
`;

export const ViewCount = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;

// Skeleton Loaders
export const SkeletonCard = styled.div`
  display: flex;
  flex-direction: column;
  border: 3px solid ${colors["gray-200"]};
  border-radius: 12px;
  background: white;
  min-height: 380px;
  padding: 0;
  overflow: hidden;
`;

const shimmer = `
  background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
  background-size: 200% 100%;
  animation: shine 1.4s linear infinite;

  @keyframes shine {
    to {
      background-position-x: -200%;
    }
  }
`;

export const SkeletonImage = styled.div`
  width: 100%;
  height: 180px;
  ${shimmer}
`;

export const SkeletonBody = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-grow: 1;
`;

export const SkeletonText = styled.div<{ $width: string; $height?: string }>`
  width: ${(props) => props.$width};
  height: ${(props) => props.$height || "16px"};
  border-radius: 4px;
  ${shimmer}
`;

// Detail Modal
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 3000;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(17, 24, 39, 0.7);
  backdrop-filter: blur(4px);
`;

export const ModalContent = styled.div`
  width: min(100%, 760px);
  max-height: 85vh;
  overflow-y: auto;
  border-radius: 16px;
  border: 4px solid ${colors["gray-900"]};
  background: white;
  box-shadow: 8px 8px 0px ${colors["gray-900"]};
  display: flex;
  flex-direction: column;
  position: relative;

  scrollbar-width: thin;
  scrollbar-color: ${colors["gray-400"]} transparent;

  &::-webkit-scrollbar {
    width: 6px;
    display: block;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${colors["gray-400"]};
    border-radius: 20px;
  }
`;

export const ModalCloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border: 2px solid ${colors["gray-900"]};
  border-radius: 6px;
  background: white;
  color: ${colors["gray-900"]};
  font-family: "VT323", monospace;
  font-size: 20px;
  font-weight: 800;
  cursor: pointer;
  display: grid;
  place-items: center;
  z-index: 10;
  box-shadow: 2px 2px 0px ${colors["gray-900"]};
  transition: transform 0.1s ease;

  &:hover {
    background: ${colors["red-100"]};
    transform: translate(-1px, -1px);
    box-shadow: 3px 3px 0px ${colors["gray-900"]};
  }

  &:active {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0px ${colors["gray-900"]};
  }
`;

export const ModalImageWrapper = styled.div`
  width: 100%;
  height: 320px;
  border-bottom: 3px solid ${colors["gray-900"]};
  background: ${colors["gray-100"]};
  overflow: hidden;
`;

export const ModalHeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const ModalBody = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ModalMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  font-family: "VT323", monospace;
  font-size: 18px;
  color: ${colors["gray-500"]};
`;

export const ModalTitle = styled.h2`
  font-family: "VT323", monospace;
  font-size: 32px;
  color: ${colors["gray-900"]};
  margin: 0;
  line-height: 1.1;
`;

export const ModalDescription = styled.div`
  color: ${colors["gray-700"]};
  font-size: 16px;
  line-height: 1.6;
  margin: 10px 0;
  white-space: pre-line;
`;

export const ExternalLinkButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  background: ${colors["yellow-300"]};
  border: 2px solid ${colors["gray-900"]};
  border-radius: 8px;
  color: ${colors["gray-900"]};
  font-family: "VT323", monospace;
  font-size: 20px;
  font-weight: 800;
  cursor: pointer;
  text-decoration: none;
  box-shadow: 4px 4px 0px ${colors["gray-900"]};
  align-self: flex-start;
  transition:
    transform 0.1s ease,
    box-shadow 0.1s ease;

  &:hover {
    background: ${colors["yellow-200"]};
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0px ${colors["gray-900"]};
  }

  &:active {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px ${colors["gray-900"]};
  }
`;
