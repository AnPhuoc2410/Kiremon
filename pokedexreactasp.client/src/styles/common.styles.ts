import styled from "@emotion/styled";
import { colors } from "../components/utils";

// ============ TABS ============
export const TabsContainer = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 1rem;
  border-bottom: 1px solid ${colors["gray-300"]};
  overflow-x: auto;
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 10;
`;

export const Tab = styled.button<{ $active?: boolean }>`
  padding: 0.75rem 1.25rem;
  cursor: pointer;
  border: none;
  background: transparent;
  border-bottom: 3px solid ${props => props.$active ? colors["sky-500"] : "transparent"};
  color: ${props => props.$active ? colors["sky-600"] : colors["gray-600"]};
  font-weight: ${props => props.$active ? 600 : 400};
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    color: ${props => props.$active ? colors["sky-600"] : colors["gray-800"]};
    border-bottom: 3px solid ${props => props.$active ? colors["sky-500"] : colors["gray-300"]};
  }
`;

// ============ ACTION BUTTONS ============
export const IconButton = styled.button<{
  $color?: "default" | "primary" | "danger" | "success";
  $size?: "sm" | "md" | "lg";
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${props => {
    switch (props.$size) {
      case "sm": return "6px";
      case "lg": return "12px";
      default: return "8px";
    }
  }};
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  ${props => {
    switch (props.$color) {
      case "primary":
        return `
          background: ${colors["blue-100"]};
          color: ${colors["blue-600"]};
          &:hover { background: ${colors["blue-200"]}; }
        `;
      case "danger":
        return `
          background: ${colors["red-100"]};
          color: ${colors["red-600"]};
          &:hover { background: ${colors["red-200"]}; }
        `;
      case "success":
        return `
          background: ${colors["green-100"]};
          color: ${colors["green-600"]};
          &:hover { background: ${colors["green-200"]}; }
        `;
      default:
        return `
          background: ${colors["gray-100"]};
          color: ${colors["gray-600"]};
          &:hover { background: ${colors["gray-200"]}; }
        `;
    }
  }}

  svg {
    width: ${props => {
      switch (props.$size) {
        case "sm": return "14px";
        case "lg": return "22px";
        default: return "18px";
      }
    }};
    height: ${props => {
      switch (props.$size) {
        case "sm": return "14px";
        case "lg": return "22px";
        default: return "18px";
      }
    }};
  }
`;

export const ActionButton = styled.button`
  background: transparent;
  border: none;
  padding: 6px;
  cursor: pointer;
  border-radius: 6px;
  color: ${colors["gray-500"]};
  transition: all 0.2s;

  &:hover {
    background: ${colors["gray-100"]};
    color: ${colors["gray-700"]};
  }
`;

// ============ ADD BUTTON ============
export const AddButton = styled.button<{ $color?: "red" | "blue" | "green" }>`
  background: ${props => {
    switch (props.$color) {
      case "blue":
        return `linear-gradient(135deg, ${colors["blue-500"]} 0%, ${colors["blue-400"]} 100%)`;
      case "green":
        return `linear-gradient(135deg, ${colors["green-500"]} 0%, ${colors["green-400"]} 100%)`;
      default:
        return `linear-gradient(135deg, ${colors["red-500"]} 0%, ${colors["red-400"]} 100%)`;
    }
  }};
  color: white;
  border: none;
  border-radius: 14px;
  padding: 16px 24px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

// ============ DIVIDERS ============
export const Divider = styled.hr<{ spacing?: "sm" | "md" | "lg" }>`
  border: none;
  border-top: 1px solid ${colors["gray-200"]};
  margin: ${props => {
    switch (props.spacing) {
      case "sm": return "8px 0";
      case "lg": return "24px 0";
      default: return "16px 0";
    }
  }};
`;

export const VerticalDivider = styled.div<{ height?: string }>`
  width: 1px;
  height: ${props => props.height || "24px"};
  background: ${colors["gray-200"]};
`;

// ============ AVATAR ============
export const Avatar = styled.div<{
  $size?: "sm" | "md" | "lg" | "xl";
  $borderColor?: string;
}>`
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${colors["yellow-200"]} 0%, ${colors["yellow-400"]} 100%);
  border: ${props => props.$borderColor ? `3px solid ${props.$borderColor}` : "none"};

  ${props => {
    switch (props.$size) {
      case "sm":
        return "width: 32px; height: 32px;";
      case "lg":
        return "width: 80px; height: 80px;";
      case "xl":
        return "width: 120px; height: 120px;";
      default:
        return "width: 48px; height: 48px;";
    }
  }}

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

// ============ EMPTY STATE ============
export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
  color: ${colors["gray-500"]};

  svg {
    width: 64px;
    height: 64px;
    margin-bottom: 16px;
    opacity: 0.5;
  }
`;

// ============ OVERLAY ============
export const Overlay = styled.div<{ $opacity?: number }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, ${props => props.$opacity || 0.5});
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

// ============ TOOLTIP WRAPPER ============
export const TooltipWrapper = styled.div`
  position: relative;
  display: inline-flex;

  &:hover .tooltip {
    opacity: 1;
    visibility: visible;
  }
`;

export const Tooltip = styled.span`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 6px 12px;
  background: ${colors["gray-900"]};
  color: white;
  font-size: 12px;
  border-radius: 6px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  margin-bottom: 8px;
  z-index: 100;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: ${colors["gray-900"]};
  }
`;

// ============ SEARCH INPUT ============
export const SearchContainer = styled.div<{ $focusColor?: string }>`
  background: ${colors["gray-100"]};
  border-radius: 14px;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 2px solid ${colors["gray-200"]};
  transition: all 0.2s ease;
  max-width: 100%;

  &:focus-within {
    border-color: ${props => props.$focusColor || colors["red-400"]};
    box-shadow: 0 0 0 3px ${props => props.$focusColor ? `${props.$focusColor}20` : "rgba(239, 68, 68, 0.1)"};
  }

  svg {
    color: ${colors["gray-400"]};
    flex-shrink: 0;
  }

  input {
    flex: 1;
    background: none;
    border: none;
    color: ${colors["gray-900"]};
    font-size: 16px;
    outline: none;

    &::placeholder {
      color: ${colors["gray-400"]};
    }
  }
`;

// ============ STATUS INDICATORS ============
export const StatusBadge = styled.span<{ $status?: "online" | "offline" | "away" | "busy" }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;

  ${props => {
    switch (props.$status) {
      case "online":
        return `
          background: ${colors["green-100"]};
          color: ${colors["green-700"]};
        `;
      case "offline":
        return `
          background: ${colors["gray-100"]};
          color: ${colors["gray-600"]};
        `;
      case "away":
        return `
          background: ${colors["yellow-100"]};
          color: ${colors["yellow-700"]};
        `;
      case "busy":
        return `
          background: ${colors["red-100"]};
          color: ${colors["red-700"]};
        `;
      default:
        return `
          background: ${colors["gray-100"]};
          color: ${colors["gray-600"]};
        `;
    }
  }}

  &::before {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => {
      switch (props.$status) {
        case "online": return colors["green-500"];
        case "offline": return colors["gray-400"];
        case "away": return colors["yellow-500"];
        case "busy": return colors["red-500"];
        default: return colors["gray-400"];
      }
    }};
  }
`;

export const OnlineDot = styled.span<{ $online?: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.$online ? colors["green-500"] : colors["gray-300"]};
  border: 2px solid white;
  box-shadow: 0 0 0 1px ${props => props.$online ? colors["green-500"] : colors["gray-300"]};
`;

// ============ LIST & GRID ============
export const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const GridContainer = styled.div<{ $minWidth?: string; $gap?: string }>`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(${props => props.$minWidth || "180px"}, 1fr));
  gap: ${props => props.$gap || "16px"};
`;

// ============ TYPE BADGE (Pokemon types) ============
export const TypeBadge = styled.span<{ $typeColor: string; $textColor?: string }>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  background-color: ${props => props.$typeColor};
  color: ${props => props.$textColor || "#fff"};
  margin: 0.25rem;
`;

// ============ PROGRESS BAR ============
export const ProgressBar = styled.div<{ $value: number; $max?: number; $color?: string }>`
  height: 8px;
  width: 100%;
  background-color: ${colors["gray-200"]};
  border-radius: 4px;
  overflow: hidden;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => Math.min((props.$value / (props.$max || 100)) * 100, 100)}%;
    background-color: ${props => props.$color || colors["blue-500"]};
    border-radius: 4px;
    transition: width 0.5s ease;
  }
`;

// ============ BADGE / COUNTER ============
export const CountBadge = styled.span<{ $color?: "red" | "blue" | "green" | "yellow" }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;

  ${props => {
    switch (props.$color) {
      case "blue":
        return `background: ${colors["blue-500"]}; color: white;`;
      case "green":
        return `background: ${colors["green-500"]}; color: white;`;
      case "yellow":
        return `background: ${colors["yellow-500"]}; color: ${colors["gray-900"]};`;
      default:
        return `background: ${colors["red-500"]}; color: white;`;
    }
  }}
`;

// ============ LOADING SKELETON ============
export const Skeleton = styled.div<{ $width?: string; $height?: string; $radius?: string }>`
  width: ${props => props.$width || "100%"};
  height: ${props => props.$height || "20px"};
  border-radius: ${props => props.$radius || "4px"};
  background: linear-gradient(
    90deg,
    ${colors["gray-200"]} 25%,
    ${colors["gray-300"]} 50%,
    ${colors["gray-200"]} 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;
