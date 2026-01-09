import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const zoomIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

export const SpriteContainer = styled.div`
  padding: 16px 0;
`;

export const HeaderSection = styled.div`
  margin-bottom: 20px;

  h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 4px 0;
    text-transform: uppercase;
  }
`;

export const HeaderSubtext = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
`;

export const EmptyState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  color: #9ca3af;
  font-size: 0.85rem;
  font-style: italic;
  width: 100%;
`;

// Toggle Switch for Normal/Shiny
export const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding: 10px 14px;
  background: #f3f4f6;
  border-radius: 8px;
  width: fit-content;
`;

export const ToggleLabel = styled.span<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  font-weight: 600;
  color: ${(props) => (props.$isActive ? "#1f2937" : "#9ca3af")};
  transition: color 0.2s ease;
  cursor: pointer;

  &:hover {
    color: ${(props) => (props.$isActive ? "#1f2937" : "#6b7280")};
  }
`;

export const ToggleSwitch = styled.button<{ $isShiny: boolean }>`
  position: relative;
  width: 52px;
  height: 28px;
  background: ${(props) =>
    props.$isShiny
      ? "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)"
      : "#d1d5db"};
  border: none;
  border-radius: 14px;
  cursor: pointer;
  transition: background 0.3s ease;
  padding: 0;

  &:hover {
    opacity: 0.9;
  }
`;

export const ToggleKnob = styled.span<{ $isShiny: boolean }>`
  position: absolute;
  top: 3px;
  left: ${(props) => (props.$isShiny ? "26px" : "3px")};
  width: 22px;
  height: 22px;
  background: #ffffff;
  border-radius: 50%;
  transition: left 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  color: #f59e0b;
`;

// Comparison View (Normal vs Shiny side by side)
export const ComparisonGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const ComparisonColumn = styled.div<{ $variant: "normal" | "shiny" }>`
  background: ${(props) =>
    props.$variant === "shiny"
      ? "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)"
      : "#f9fafb"};
  border-radius: 10px;
  padding: 12px;
  border: 1px solid
    ${(props) => (props.$variant === "shiny" ? "#fcd34d" : "#e5e7eb")};
`;

export const ComparisonTitle = styled.div<{ $variant: "normal" | "shiny" }>`
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid
    ${(props) => (props.$variant === "shiny" ? "#fcd34d" : "#e5e7eb")};
  color: ${(props) => (props.$variant === "shiny" ? "#b45309" : "#6b7280")};
  display: flex;
  align-items: center;
  gap: 6px;
`;

// Collapsible components
export const CollapsibleContainer = styled.div`
  margin-bottom: 12px;
  border-radius: 8px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

export const CollapsibleHeader = styled.button<{ $isOpen: boolean }>`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  background: ${(props) => (props.$isOpen ? "#f3f4f6" : "#ffffff")};
  border: none;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #f3f4f6;
  }
`;

export const CollapsibleTitle = styled.span`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
`;

export const SpriteBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  font-size: 0.7rem;
  font-weight: 700;
  color: #ffffff;
  background: #6366f1;
  border-radius: 11px;
`;

export const ChevronIcon = styled.span<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  color: #9ca3af;
  transition: transform 0.2s ease;
  transform: ${(props) => (props.$isOpen ? "rotate(180deg)" : "rotate(0)")};
`;

export const CollapsibleContent = styled.div<{ $isOpen: boolean }>`
  display: ${(props) => (props.$isOpen ? "block" : "none")};
  padding: 16px;
  background: #fafafa;
  border-top: 1px solid #e5e7eb;
  animation: ${fadeIn} 0.2s ease-out;
`;

// Sprite grid - centered alignment
export const SpriteGrid = styled.div<{
  $isLarge?: boolean;
  $compact?: boolean;
}>`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${(props) => (props.$compact ? "10px" : "12px")};
`;

// Inner grid for comparison columns - also centered
export const SpriteGridInner = styled.div<{ $isLarge?: boolean }>`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
`;

// Sprite item with better background for pixel art
export const SpriteItem = styled.div<{ $isLarge?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${(props) => (props.$isLarge ? "16px" : "10px")};
  background: #f5f5f5;
  border-radius: 10px;
  border: 1px solid #e8e8e8;
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
  flex-shrink: 0;

  /* Checkerboard pattern for transparency */
  background-image:
    linear-gradient(45deg, #eaeaea 25%, transparent 25%),
    linear-gradient(-45deg, #eaeaea 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #eaeaea 75%),
    linear-gradient(-45deg, transparent 75%, #eaeaea 75%);
  background-size: 8px 8px;
  background-position:
    0 0,
    0 4px,
    4px -4px,
    -4px 0px;
  background-color: #f8f8f8;

  &:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
    border-color: #6366f1;

    .zoom-icon {
      opacity: 1;
    }
  }
`;

export const SpriteImage = styled.div<{ $isLarge?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${(props) => (props.$isLarge ? "140px" : "80px")};
  height: ${(props) => (props.$isLarge ? "140px" : "80px")};

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;

export const SpriteLabel = styled.span`
  margin-top: 8px;
  font-size: 0.7rem;
  font-weight: 600;
  color: #4b5563;
  text-align: center;
  text-transform: capitalize;
  background: rgba(255, 255, 255, 0.9);
  padding: 2px 8px;
  border-radius: 4px;
`;

export const ZoomIcon = styled.span`
  position: absolute;
  top: 6px;
  right: 6px;
  width: 22px;
  height: 22px;
  background: rgba(99, 102, 241, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity 0.2s ease;
`;

// Lightbox Modal
export const LightboxOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  cursor: zoom-out;
  animation: ${fadeIn} 0.2s ease-out;
`;

export const LightboxContent = styled.div`
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  animation: ${zoomIn} 0.25s ease-out;
  cursor: default;

  /* Checkerboard background for transparency */
  background-image:
    linear-gradient(45deg, #3a3a3a 25%, transparent 25%),
    linear-gradient(-45deg, #3a3a3a 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #3a3a3a 75%),
    linear-gradient(-45deg, transparent 75%, #3a3a3a 75%);
  background-size: 20px 20px;
  background-position:
    0 0,
    0 10px,
    10px -10px,
    -10px 0px;
  background-color: #2a2a2a;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
`;

export const LightboxImage = styled.img`
  display: block;
  max-width: 400px;
  max-height: 400px;
  width: auto;
  height: auto;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
  margin: 0 auto;
`;

export const LightboxLabel = styled.div`
  text-align: center;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 16px;
  text-transform: capitalize;
`;

export const LightboxClose = styled.button`
  position: absolute;
  top: -12px;
  right: -12px;
  width: 32px;
  height: 32px;
  background: #ef4444;
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

  &:hover {
    background: #dc2626;
    transform: scale(1.1);
  }
`;

export const LightboxNav = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
`;

export const LightboxCounter = styled.span`
  color: #9ca3af;
  font-size: 0.85rem;
  min-width: 50px;
  text-align: center;
`;

export const LightboxNavButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: white;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.25);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

// Section divider
export const SectionDivider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 28px 0 20px;
`;

export const DividerLine = styled.div`
  flex: 1;
  height: 1px;
  background: #e5e7eb;
`;

export const DividerText = styled.span`
  font-size: 0.8rem;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
`;

// Version sprites
export const VersionsSection = styled.div`
  margin-top: 16px;
`;

export const VersionBlock = styled.div`
  margin-bottom: 16px;
  padding: 12px;
  background: #ffffff;
  border-radius: 6px;
  border: 1px solid #e5e7eb;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const VersionTitle = styled.h5`
  margin: 0 0 10px 0;
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
  text-transform: capitalize;
  padding-bottom: 6px;
  border-bottom: 1px solid #f3f4f6;
`;

export const AnimatedLabel = styled.div`
  margin: 16px 0 10px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #8b5cf6;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

// View Mode Toggle
export const ViewModeToggle = styled.div`
  display: flex;
  gap: 4px;
  padding: 4px;
  background: #f3f4f6;
  border-radius: 8px;
  margin-left: auto;
`;

export const ViewModeButton = styled.button<{ $isActive: boolean }>`
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${(props) => (props.$isActive ? "#ffffff" : "transparent")};
  color: ${(props) => (props.$isActive ? "#1f2937" : "#6b7280")};
  box-shadow: ${(props) =>
    props.$isActive ? "0 1px 3px rgba(0,0,0,0.1)" : "none"};

  &:hover {
    color: #1f2937;
  }
`;

// Header with controls
export const SectionHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
`;

// Legacy exports
export const SpriteGallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
  margin-top: 16px;
`;

export const GenerationTitle = styled.h4`
  margin-top: 32px;
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
`;

export const VersionsContainer = styled.div`
  margin-top: 32px;
`;

// Loading
export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #6b7280;
  gap: 12px;
`;

export const LoadingSpinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
