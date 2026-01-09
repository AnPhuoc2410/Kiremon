import React from "react";
import styled from "@emotion/styled";
import { skillColor } from "../../utils";

export interface TypeIconProps {
  type: string;
  size?: "sm" | "md" | "lg" | "xl";
  onClick?: () => void;
  className?: string;
}

interface BadgeProps {
  bgColor: string;
  textColor: string;
  size: string;
  isClickable: boolean;
}

// Size mapping for the badge
const sizeMap: Record<string, string> = {
  sm: "0.7rem",
  md: "0.85rem",
  lg: "1rem",
  xl: "1.2rem",
};

// Size mapping for the icon container
const iconSizeMap: Record<string, string> = {
  sm: "20px",
  md: "24px",
  lg: "30px",
  xl: "36px",
};

const TypeBadge = styled.div<BadgeProps>`
  display: flex;
  align-items: center;
  gap: 4px;
  background-color: ${(props) => props.bgColor};
  color: ${(props) => props.textColor};
  font-size: ${(props) => sizeMap[props.size] || "0.85rem"};
  padding: 4px 8px;
  border-radius: 16px;
  text-transform: capitalize;
  font-weight: 600;
  cursor: ${(props) => (props.isClickable ? "pointer" : "default")};
  transition: all 0.2s ease;

  &:hover {
    opacity: ${(props) => (props.isClickable ? 0.9 : 1)};
  }
`;

const IconContainer = styled.div<{ size: string }>`
  width: ${(props) => iconSizeMap[props.size] || "24px"};
  height: ${(props) => iconSizeMap[props.size] || "24px"};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TypeIcon: React.FC<TypeIconProps> = ({
  type,
  size = "md",
  onClick,
  className,
}) => {
  if (!type) return null;

  const normalizedType = type.toLowerCase();
  const iconSrc = `/src/assets/type-icon/${normalizedType}.png`;
  const bgColor = skillColor[`${normalizedType}-500`] || "#A8A77A";
  const textColor =
    normalizedType === "dark" || normalizedType === "ghost" ? "#fff" : "#222";
  const isClickable = !!onClick;

  return (
    <TypeBadge
      bgColor={bgColor}
      textColor={textColor}
      size={size}
      isClickable={isClickable}
      onClick={onClick}
      className={className}
    >
      <IconContainer size={size}>
        <img src={iconSrc} alt={`${type} type`} width="100%" height="100%" />
      </IconContainer>
      {normalizedType}
    </TypeBadge>
  );
};

export default TypeIcon;
