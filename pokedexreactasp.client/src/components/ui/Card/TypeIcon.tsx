import React from "react";
import styled from "@emotion/styled";
import { useLanguage } from "../../../contexts";
import { getLocalizedTypeName } from "../../../utils/typeI18n";

// Pokemon type colors
const typeColors: Record<string, string> = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

interface TypeIconProps {
  type: string;
  size?: "sm" | "md" | "lg";
}

const TypeBadge = styled.div<{ bgColor: string; size: string }>`
  background-color: ${(props) => props.bgColor};
  color: white;
  text-transform: capitalize;
  border-radius: 6px;
  font-weight: 500;
  font-size: ${(props) =>
    props.size === "sm"
      ? "0.75rem"
      : props.size === "md"
        ? "0.875rem"
        : "1rem"};
  padding: ${(props) =>
    props.size === "sm"
      ? "2px 8px"
      : props.size === "md"
        ? "4px 12px"
        : "6px 16px"};
  letter-spacing: 0.5px;

  /* Radix UI-inspired shadow */
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2);
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);

  /* Add slight gradient overlay for depth */
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(
      rgba(255, 255, 255, 0.15),
      rgba(255, 255, 255, 0)
    );
    border-radius: 6px 6px 0 0;
  }

  /* Transition for hover effects */
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  }
`;

const TypeIcon: React.FC<TypeIconProps> = ({ type, size = "md" }) => {
  const { languageId } = useLanguage();
  const normalizedType = type.toLowerCase();
  const bgColor = typeColors[normalizedType] || "#777777";

  // Get localized type name
  const localizedTypeName = getLocalizedTypeName(normalizedType, languageId);

  return (
    <TypeBadge bgColor={bgColor} size={size}>
      {localizedTypeName}
    </TypeBadge>
  );
};

export default TypeIcon;
