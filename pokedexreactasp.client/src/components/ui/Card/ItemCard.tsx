import React, { HTMLAttributes, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

import { Text } from "..";
import { colors } from "@/components/utils";

import "react-lazy-load-image-component/src/effects/blur.css";

interface Props extends HTMLAttributes<HTMLDivElement> {
  name: string;
  spriteUrl?: string;
  quantity?: number;
  pocketName?: string;
  categoryName?: string;
  variant?: "grid" | "list";
  selected?: boolean;
  accentColor?: string;
  onClick?: () => void;
}

const FALLBACK_SPRITE = "/substitute.png";
const BAG_SELECTED_BG = "#111111";
const BAG_QTY_DEFAULT_ACCENT = "#f5a020";

const gentlePopUpAnimation = keyframes`
  0% { transform: scale(1) translateY(0); }
  40% { transform: scale(1.18) translateY(-10px); }
  100% { transform: scale(1.1) translateY(-4px); }
`;

const ItemCardContainer = styled.div<{
  clickable: boolean;
  variant: "grid" | "list";
  selected: boolean;
  accentColor: string;
}>`
  position: relative;
  display: flex;
  flex-direction: ${(props) => (props.variant === "list" ? "row" : "column")};
  align-items: ${(props) => (props.variant === "list" ? "center" : "stretch")};
  gap: ${(props) => (props.variant === "list" ? "10px" : "0")};
  padding: ${(props) =>
    props.variant === "list"
      ? props.selected
        ? "6px 0 6px 4px"
        : "8px 12px"
      : "16px"};
  background-color: ${(props) => {
    if (props.variant === "list") {
      return props.selected ? BAG_SELECTED_BG : "transparent";
    }
    return props.selected ? colors["gray-700"] : "white";
  }};
  border-radius: ${(props) => (props.variant === "list" ? "0" : "12px")};
  border-bottom: ${(props) =>
    props.variant === "list" && !props.selected
      ? "1px solid rgba(0, 0, 0, 0.06)"
      : props.variant === "list"
        ? "none"
        : "none"};
  transition:
    background-color 0.12s ease,
    color 0.12s ease;
  overflow: visible;
  z-index: ${(props) => (props.variant === "list" && props.selected ? 2 : 1)};
  min-height: ${(props) => (props.variant === "list" ? "52px" : "auto")};

  box-shadow: ${(props) =>
    props.variant === "grid"
      ? `0px 1px 3px rgba(16, 24, 40, 0.1), 0px 1px 2px rgba(16, 24, 40, 0.06)`
      : "none"};

  cursor: ${(props) => (props.clickable ? "pointer" : "default")};

  &:hover {
    background-color: ${(props) => {
    if (props.variant === "list") {
      return props.selected ? "#1f1f1f" : "rgba(0, 0, 0, 0.04)";
    }
    if (props.selected) return colors["gray-500"];
    return props.clickable ? colors["gray-200"] : "white";
  }};
    transform: ${(props) =>
    props.variant === "grid" && props.clickable ? "translateY(-4px)" : "none"};
    box-shadow: ${(props) =>
    props.variant === "grid" && props.clickable
      ? `0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)`
      : "none"};
  }

  .item-chevron {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    flex-shrink: 0;
    opacity: ${(props) => (props.variant === "list" && props.selected ? 1 : 0)};
    transition: opacity 0.12s ease;

    &::before {
      content: "";
      display: block;
      width: 0;
      height: 0;
      border-top: 7px solid transparent;
      border-bottom: 7px solid transparent;
      border-left: 9px solid #fff;
    }
  }

  .item-qty {
    position: ${(props) => (props.variant === "list" ? "static" : "absolute")};
    top: ${(props) => (props.variant === "list" ? "auto" : "8px")};
    right: ${(props) => (props.variant === "list" ? "auto" : "12px")};
    margin-left: ${(props) => (props.variant === "list" ? "auto" : "0")};
    display: flex;
    gap: 4px;
    align-items: center;
    justify-content: center;
    min-width: ${(props) => (props.variant === "list" ? "56px" : "auto")};
    padding: ${(props) =>
    props.variant === "list"
      ? props.selected
        ? "6px 14px"
        : "2px 0"
      : "2px 8px"};
    border-radius: ${(props) =>
    props.variant === "list" && props.selected ? "0" : "999px"};
    background: ${(props) => {
    if (props.variant === "list") {
      return props.selected ? props.accentColor : "transparent";
    }
    return props.selected ? "rgba(255,255,255,0.2)" : colors["gray-500"];
  }};
    color: ${(props) => {
    if (props.variant === "list") {
      return props.selected ? "#fff" : "rgba(0, 0, 0, 0.72)";
    }
    return "#fff";
  }};
    font-size: ${(props) => (props.variant === "list" ? "0.9rem" : "0.75rem")};
    font-weight: 700;
    z-index: 5;
    flex-shrink: 0;
    transform: ${(props) =>
    props.variant === "list" && props.selected ? "skewX(-10deg)" : "none"};
    letter-spacing: 0.02em;

    span {
      display: inline-block;
      transform: ${(props) =>
    props.variant === "list" && props.selected ? "skewX(10deg)" : "none"};
    }
  }

  .item-image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: ${(props) => (props.variant === "list" ? "36px" : "96px")};
    width: ${(props) => (props.variant === "list" ? "36px" : "auto")};
    margin-bottom: ${(props) => (props.variant === "list" ? "0" : "12px")};
    margin-left: ${(props) =>
    props.variant === "list" && props.selected ? "4px" : "0"};
    position: relative;
    overflow: visible;
    flex-shrink: 0;
  }

  .item-image-container img {
    margin: 0 auto;
    object-fit: contain;
    max-height: 100%;
    width: auto;
    height: auto;
    image-rendering: pixelated;
    transition: filter 0.3s ease;
    filter: ${(props) =>
    props.variant === "list" && props.selected
      ? "drop-shadow(0 1px 2px rgba(255,255,255,0.15))"
      : "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))"};
    transform-origin: center bottom;
    will-change: transform;
  }

  &:hover .item-image-container img {
    animation: ${(props) =>
    props.variant === "grid" ? gentlePopUpAnimation : "none"}
      0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    filter: ${(props) =>
    props.variant === "grid"
      ? "drop-shadow(0 10px 8px rgba(0, 0, 0, 0.2))"
      : props.variant === "list" && props.selected
        ? "drop-shadow(0 1px 2px rgba(255,255,255,0.15))"
        : "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))"};
  }

  .item-info {
    display: flex;
    flex-direction: column;
    align-items: ${(props) =>
    props.variant === "list" ? "flex-start" : "center"};
    text-align: ${(props) => (props.variant === "list" ? "left" : "center")};
    gap: 4px;
    flex: 1;
    min-width: 0;
  }

  .item-name {
    font-weight: ${(props) => (props.variant === "list" ? 700 : 600)};
    font-size: ${(props) => (props.variant === "list" ? "1rem" : "1rem")};
    text-transform: capitalize;
    color: ${(props) => {
    if (props.variant === "list") {
      return props.selected ? "#fff" : "rgba(0, 0, 0, 0.82)";
    }
    return props.selected ? "#fff" : colors["gray-700"];
  }};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    letter-spacing: 0.01em;
  }

  .item-pocket {
    color: ${(props) =>
    props.selected ? "rgba(255,255,255,0.75)" : colors["gray-500"]};
    font-size: 0.75rem;
    text-transform: capitalize;
  }
`;

const ItemCard: React.FC<Props> = ({
  name,
  spriteUrl,
  quantity,
  pocketName,
  categoryName,
  variant = "grid",
  selected = false,
  accentColor = BAG_QTY_DEFAULT_ACCENT,
  children,
  onClick,
  ...rest
}) => {
  const [hasError, setHasError] = useState(false);
  const src = hasError || !spriteUrl ? FALLBACK_SPRITE : spriteUrl;
  const displayName = name.replace(/-/g, " ");

  return (
    <ItemCardContainer
      clickable={!!onClick}
      variant={variant}
      selected={selected}
      accentColor={accentColor}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-pressed={onClick ? selected : undefined}
      {...rest}
    >
      {variant === "list" ? (
        <span className="item-chevron" aria-hidden="true" />
      ) : null}

      <div className="item-image-container">
        <LazyLoadImage
          src={src}
          alt={name}
          width={variant === "list" ? 36 : 72}
          height={variant === "list" ? 36 : 72}
          effect="blur"
          onError={() => setHasError(true)}
        />
      </div>

      <div className="item-info">
        <Text className="item-name">{displayName}</Text>
        {variant === "grid" && (pocketName || categoryName) ? (
          <Text className="item-pocket">
            {(pocketName || categoryName)?.replace(/-/g, " ")}
          </Text>
        ) : null}
      </div>

      {children}

      {quantity != null && quantity > 0 ? (
        <div className="item-qty">
          <span>x {quantity}</span>
        </div>
      ) : null}
    </ItemCardContainer>
  );
};

export default ItemCard;
