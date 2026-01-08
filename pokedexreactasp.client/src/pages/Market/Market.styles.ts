import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { units, colors } from "../../components/utils";

// ============ ANIMATIONS ============
const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

// ============ MAIN CONTAINER ============
export const ShopContainer = styled.section`
  max-width: ${units.screenSize["xl"]};
  margin: 0 auto;
  padding: 10px 16px;
  text-align: center;

  @media screen and (min-width: ${units.screenSize["xl"]}) {
    padding: 10px 0;
  }
`;

export const ShopInner = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
  margin-top: 16px;
`;

// ============ SIDEBAR ============
export const SidebarContainer = styled.div`
  position: relative;
`;

export const SidebarToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: white;
  border: 1px solid ${colors["gray-200"]};
  border-radius: 12px;
  cursor: pointer;
  width: 100%;
  font-size: 14px;
  font-weight: 600;
  color: ${colors["gray-900"]};
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(16, 24, 40, 0.1);

  &:hover {
    background: ${colors["gray-100"]};
    box-shadow: 0 4px 6px rgba(16, 24, 40, 0.1);
  }

  @media (min-width: 768px) {
    display: none;
  }

  svg {
    width: 20px;
    height: 20px;
    transition: transform 0.2s ease;
  }
`;

export const CategorySidebar = styled.div<{ $isOpen?: boolean }>`
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow:
    0 1px 3px rgba(16, 24, 40, 0.1),
    0 1px 2px rgba(16, 24, 40, 0.06);

  @media (max-width: 767px) {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 280px;
    z-index: 1000;
    transform: ${(props) =>
      props.$isOpen ? "translateX(0)" : "translateX(-100%)"};
    transition: transform 0.3s ease;
    box-shadow: ${(props) =>
      props.$isOpen ? "0 0 40px rgba(0,0,0,0.2)" : "none"};
  }

  @media (min-width: 768px) {
    width: 240px;
    min-width: 240px;
    position: sticky;
    top: 16px;
    max-height: calc(100vh - 120px);
    overflow-y: auto;

    /* Custom scrollbar */
    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: ${colors["gray-100"]};
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: ${colors["gray-400"]};
      border-radius: 3px;

      &:hover {
        background: ${colors["gray-500"]};
      }
    }
  }
`;

export const SidebarOverlay = styled.div<{ $isOpen?: boolean }>`
  display: ${(props) => (props.$isOpen ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;

  @media (min-width: 768px) {
    display: none;
  }
`;

export const CategoryTabsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const CategoryTab = styled.button<{ $active?: boolean }>`
  font-size: 14px;
  padding: 10px 14px;
  border: none;
  border-radius: 8px;
  background: ${(props) =>
    props.$active ? colors["blue-100"] : "transparent"};
  color: ${(props) =>
    props.$active ? colors["blue-600"] : colors["gray-700"]};
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: capitalize;
  text-align: left;
  width: 100%;
  font-weight: ${(props) => (props.$active ? "600" : "400")};

  &:hover {
    background: ${(props) =>
      props.$active ? colors["blue-200"] : colors["gray-100"]};
  }

  &:active {
    transform: scale(0.98);
  }
`;

// ============ MAIN CONTENT AREA ============
export const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

// ============ CONTENT AREA ============
export const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
  min-width: 0;

  @media (min-width: 1024px) {
    flex-direction: row;
  }
`;

export const ItemsContainer = styled.div`
  flex: 1;
  min-width: 0;
`;

export const DescriptionPanel = styled.div`
  @media (min-width: 1024px) {
    width: 320px;
    min-width: 320px;
    position: sticky;
    top: 16px;
    max-height: calc(100vh - 120px);
  }
`;

export const SidebarTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${colors["gray-900"]};
  margin: 0 0 12px 0;
  text-align: left;
`;

// ============ ITEMS GRID ============
export const ItemsSection = styled.div`
  flex: 1;
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow:
    0 1px 3px rgba(16, 24, 40, 0.1),
    0 1px 2px rgba(16, 24, 40, 0.06);
`;

export const ItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
`;

export const ItemCard = styled.div<{ $selected?: boolean }>`
  background: ${(props) => (props.$selected ? colors["blue-100"] : "white")};
  border: 1px solid
    ${(props) => (props.$selected ? colors["blue-300"] : colors["gray-200"])};
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  box-shadow:
    0 1px 3px rgba(16, 24, 40, 0.1),
    0 1px 2px rgba(16, 24, 40, 0.06);

  &:hover {
    transform: translateY(-4px);
    background: ${(props) =>
      props.$selected ? colors["blue-200"] : colors["gray-100"]};
    box-shadow:
      0 12px 16px -4px rgba(16, 24, 40, 0.08),
      0 4px 6px -2px rgba(16, 24, 40, 0.03);
  }

  &:active {
    transform: translateY(-2px);
  }
`;

export const ItemSprite = styled.div`
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    image-rendering: pixelated;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  }
`;

export const ItemName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${colors["gray-900"]};
  text-align: center;
  text-transform: capitalize;
  line-height: 1.4;
  word-break: break-word;
`;

export const ItemPrice = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${colors["yellow-700"]};
  background: ${colors["yellow-100"]};
  padding: 4px 10px;
  border-radius: 6px;

  &::before {
    content: "₽";
    margin-right: 3px;
  }
`;

// ============ DIALOG BOX ============
export const DialogBox = styled.div<{ $visible?: boolean }>`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow:
    0 1px 3px rgba(16, 24, 40, 0.1),
    0 1px 2px rgba(16, 24, 40, 0.06);
  transition: all 0.3s ease;

  @media (max-width: 1023px) {
    position: fixed;
    bottom: ${(props) => (props.$visible ? "0" : "-100%")};
    left: 0;
    right: 0;
    z-index: 1001;
    border-radius: 16px 16px 0 0;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
    max-height: 60vh;
    overflow-y: auto;
  }

  @media (min-width: 1024px) {
    min-height: ${(props) => (props.$visible ? "200px" : "0")};
    opacity: ${(props) => (props.$visible ? "1" : "0.5")};
  }
`;

export const DialogOverlay = styled.div<{ $visible?: boolean }>`
  display: ${(props) => (props.$visible ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;

  @media (min-width: 1024px) {
    display: none;
  }
`;

export const DialogHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;

  @media (min-width: 1024px) {
    display: block;
  }
`;

export const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: ${colors["gray-100"]};
  color: ${colors["gray-600"]};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${colors["gray-200"]};
  }

  @media (min-width: 1024px) {
    display: none;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

export const DialogContent = styled.div`
  color: ${colors["gray-900"]};
  font-size: 14px;
  line-height: 1.6;
`;

export const DialogTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${colors["gray-900"]};
  margin: 0 0 8px 0;
  text-transform: capitalize;
`;

export const DialogDescription = styled.p`
  margin: 0;
  color: ${colors["gray-600"]};
  line-height: 1.6;
`;

// ============ WILD POKEMON SECTION ============
export const WildPokemonSection = styled.div`
  margin-top: 24px;
  padding-top: 24px;
  border-top: 2px dashed ${colors["gray-300"]};
`;

export const WildPokemonTitle = styled.h4`
  font-size: 13px;
  font-weight: 600;
  color: ${colors["gray-600"]};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const WildPokemonHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  border: 2px solid #15803d;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  box-shadow:
    0 4px 6px rgba(34, 197, 94, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  margin-bottom: 16px;

  span {
    letter-spacing: 0.3px;
  }
`;

export const WildPokemonList = styled.div<{ $isExpanded: boolean }>`
  display: ${(props) => (props.$isExpanded ? "grid" : "none")};
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 12px;
  max-height: 420px;
  overflow-y: auto;
  padding-right: 8px;
  animation: ${(props) => (props.$isExpanded ? "fadeIn 0.3s ease-in" : "none")};

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${colors["gray-100"]};
    border-radius: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${colors["gray-300"]};
    border-radius: 8px;

    &:hover {
      background: ${colors["gray-400"]};
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
    gap: 10px;
    max-height: 280px;
  }
`;

export const WildPokemonItem = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px 0px;
  background: white;
  border: 2px solid ${colors["gray-200"]};
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  color: ${colors["gray-700"]};
  text-decoration: none;
  text-align: center;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      transparent 0%,
      rgba(59, 130, 246, 0.05) 100%
    );
    opacity: 0;
    transition: opacity 0.25s ease;
  }

  &:hover {
    border-color: ${colors["blue-400"]};
    color: ${colors["blue-700"]};
    transform: translateY(-4px);
    box-shadow:
      0 8px 16px rgba(59, 130, 246, 0.15),
      0 0 0 4px rgba(59, 130, 246, 0.1);

    &::before {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(-2px);
    box-shadow:
      0 4px 8px rgba(59, 130, 246, 0.2),
      0 0 0 3px rgba(59, 130, 246, 0.15);
  }

  img {
    width: 80px;
    height: 80px;
    image-rendering: pixelated;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    z-index: 1;
  }

  &:hover img {
    transform: scale(1.15) translateY(-2px);
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  }

  span {
    text-transform: capitalize;
    line-height: 1.3;
    word-break: break-word;
    position: relative;
    z-index: 1;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
`;

export const WildPokemonLoading = styled.div`
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  color: ${colors["gray-600"]};
  font-size: 14px;
  font-weight: 500;

  &::before {
    content: "⚡";
    display: inline-block;
    margin-right: 8px;
    animation: bounce 1s infinite;
  }

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
`;

export const WildPokemonEmpty = styled.div`
  text-align: center;
  padding: 16px;
  color: ${colors["gray-500"]};
  font-size: 13px;
  font-style: italic;
`;

export const DialogPlaceholder = styled.div`
  color: ${colors["gray-500"]};
  font-style: italic;
  text-align: center;
  padding: 40px 20px;

  svg {
    width: 48px;
    height: 48px;
    margin-bottom: 12px;
    opacity: 0.5;
  }
`;

// ============ LOADING STATES ============
export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  gap: 16px;
`;

export const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid ${colors["gray-200"]};
  border-top-color: ${colors["blue-500"]};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const LoadingText = styled.span`
  font-size: 14px;
  color: ${colors["gray-600"]};
`;

// ============ ERROR STATE ============
export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  gap: 16px;
  text-align: center;
`;

export const ErrorText = styled.span`
  font-size: 14px;
  color: ${colors["red-600"]};
`;

export const RetryButton = styled.button`
  font-size: 14px;
  padding: 10px 20px;
  background: ${colors["blue-500"]};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: ${colors["blue-600"]};
  }

  &:active {
    transform: scale(0.98);
  }
`;

// ============ EMPTY STATE ============
export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
  text-align: center;
  color: ${colors["gray-500"]};
  font-size: 14px;
`;

// ============ SCROLL TO TOP BUTTON ============
export const ScrollToTop = styled.button`
  position: fixed;
  bottom: 100px;
  right: 24px;
  width: 80px;
  height: 80px;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transform: translateY(20px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  padding: 0;

  &.visible {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  &:hover {
    transform: translateY(-8px) scale(1.1);

    img {
      filter: drop-shadow(0 4px 8px rgba(239, 68, 68, 0.3));
      animation: pokeball-spin 0.6s ease-in-out;
    }
  }

  &:active {
    transform: translateY(-4px) scale(1.05);
  }

  @media (max-width: 768px) {
    bottom: 80px;
    right: 16px;
    width: 64px;
    height: 64px;
  }
`;

export const PokeballImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  animation: pokeball-bounce 2s ease-in-out infinite;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.15));
  transition: filter 0.3s ease;

  @keyframes pokeball-bounce {
    0%,
    100% {
      transform: translateY(0) rotate(0deg);
    }
    50% {
      transform: translateY(-4px) rotate(5deg);
    }
  }

  @keyframes pokeball-spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const FallbackIcon = styled.div`
  font-size: 32px;
  font-weight: bold;
  color: #ef4444;
  animation: arrow-bounce 1.5s ease-in-out infinite;

  @keyframes arrow-bounce {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-4px);
    }
  }
`;
