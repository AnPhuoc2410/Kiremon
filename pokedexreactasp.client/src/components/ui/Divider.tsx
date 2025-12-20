import styled from "@emotion/styled";
import { css } from "@emotion/react";

type DividerVariant = "pokeball" | "dots" | "gradient" | "simple" | "thunder";
type DividerSize = "sm" | "md" | "lg";

interface DividerProps {
  variant?: DividerVariant;
  size?: DividerSize;
  color?: string;
  className?: string;
}

const sizeMap: Record<DividerSize, { height: string; iconSize: string }> = {
  sm: { height: "1px", iconSize: "16px" },
  md: { height: "2px", iconSize: "24px" },
  lg: { height: "3px", iconSize: "32px" },
};

const DividerWrapper = styled.div<{ size: DividerSize }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 8px 0;
  gap: 12px;
`;

const Line = styled.div<{ color?: string; size: DividerSize }>`
  flex: 1;
  height: ${({ size }) => sizeMap[size].height};
  background: ${({ color }) =>
    color || "linear-gradient(90deg, transparent, #e63946, transparent)"};
  border-radius: 2px;
`;

// Pokeball Center Icon
const PokeballIcon = styled.div<{ size: DividerSize; color?: string }>`
  width: ${({ size }) => sizeMap[size].iconSize};
  height: ${({ size }) => sizeMap[size].iconSize};
  border-radius: 50%;
  background: linear-gradient(
    to bottom,
    ${({ color }) => color || "#e63946"} 0%,
    ${({ color }) => color || "#e63946"} 45%,
    #1a1a2e 45%,
    #1a1a2e 55%,
    #f8f8f8 55%,
    #f8f8f8 100%
  );
  border: 2px solid #1a1a2e;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 35%;
    height: 35%;
    background: #f8f8f8;
    border: 2px solid #1a1a2e;
    border-radius: 50%;
  }
`;

// Dots variant
const DotsContainer = styled.div<{ color?: string }>`
  display: flex;
  gap: 8px;

  span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ color }) => color || "#ffcb05"};
    box-shadow: 0 0 6px ${({ color }) => color || "#ffcb05"}80;

    &:nth-of-type(2) {
      background: ${({ color }) => color || "#e63946"};
      box-shadow: 0 0 6px ${({ color }) => color || "#e63946"}80;
    }

    &:nth-of-type(3) {
      background: ${({ color }) => color || "#3b82f6"};
      box-shadow: 0 0 6px ${({ color }) => color || "#3b82f6"}80;
    }
  }
`;

// Thunder bolt for electric theme
const ThunderBolt = styled.div<{ color?: string; size: DividerSize }>`
  width: ${({ size }) => sizeMap[size].iconSize};
  height: ${({ size }) => sizeMap[size].iconSize};
  position: relative;

  &::before {
    content: "⚡";
    font-size: ${({ size }) =>
      size === "sm" ? "14px" : size === "md" ? "20px" : "28px"};
    color: ${({ color }) => color || "#ffcb05"};
    text-shadow: 0 0 8px ${({ color }) => color || "#ffcb05"}80;
  }
`;

// Gradient line only
const GradientLine = styled.div<{ color?: string; size: DividerSize }>`
  width: 100%;
  height: ${({ size }) => sizeMap[size].height};
  background: ${({ color }) =>
    color
      ? `linear-gradient(90deg, transparent, ${color}, transparent)`
      : "linear-gradient(90deg, transparent, #e63946 25%, #ffcb05 50%, #3b82f6 75%, transparent)"};
  border-radius: 4px;
`;

// Simple line
const SimpleLine = styled.div<{ color?: string; size: DividerSize }>`
  width: 100%;
  height: ${({ size }) => sizeMap[size].height};
  background: ${({ color }) => color || "#374151"};
  border-radius: 2px;
  opacity: 0.6;
`;

export const Divider: React.FC<DividerProps> = ({
  variant = "pokeball",
  size = "md",
  color,
  className,
}) => {
  if (variant === "gradient") {
    return (
      <DividerWrapper size={size} className={className}>
        <GradientLine size={size} color={color} />
      </DividerWrapper>
    );
  }

  if (variant === "simple") {
    return (
      <DividerWrapper size={size} className={className}>
        <SimpleLine size={size} color={color} />
      </DividerWrapper>
    );
  }

  if (variant === "dots") {
    return (
      <DividerWrapper size={size} className={className}>
        <Line size={size} color={color} />
        <DotsContainer color={color}>
          <span />
          <span />
          <span />
        </DotsContainer>
        <Line size={size} color={color} />
      </DividerWrapper>
    );
  }

  if (variant === "thunder") {
    return (
      <DividerWrapper size={size} className={className}>
        <Line
          size={size}
          color={
            color || "linear-gradient(90deg, transparent, #ffcb05, transparent)"
          }
        />
        <ThunderBolt size={size} color={color} />
        <Line
          size={size}
          color={
            color || "linear-gradient(90deg, transparent, #ffcb05, transparent)"
          }
        />
      </DividerWrapper>
    );
  }

  // Default: pokeball variant
  return (
    <DividerWrapper size={size} className={className}>
      <Line size={size} color={color} />
      <PokeballIcon size={size} color={color} />
      <Line size={size} color={color} />
    </DividerWrapper>
  );
};

export default Divider;
