import React, { HTMLAttributes, useState, useEffect } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";

import { Text } from "..";
import { colors } from "../../utils";
import { POKEMON_IMAGE } from "../../../config/api.config";
import TypeIcon from "../Card/TypeIcon";

import "react-lazy-load-image-component/src/effects/blur.css";

interface Props extends HTMLAttributes<HTMLDivElement> {
  name?: string;
  nickname?: string;
  captured?: number;
  sprite?: string;
  pokemonId?: number | string;
  types?: string[];
  onClick?: () => void;
}

const getStyle = ({ nickname }: Props) => {
  return `
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 16px;
  background-color: white;
  border-radius: 12px;
  transition: all 0.2s ease-in-out;

  /* Radix UI-inspired shadow system */
  box-shadow:
    0px 1px 3px rgba(16, 24, 40, 0.1),
    0px 1px 2px rgba(16, 24, 40, 0.06);

  .capture-qty,
  button {
    position: absolute;
    top: 8px;
    right: 12px;
    display: flex;
    gap: 4px;
    align-items: center;
  }

  .pokemon-image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 120px;
    margin-bottom: 12px;
  }

  .pokemon-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  cursor: ${nickname ? "default" : "pointer"};

  &:hover {
    transform: translateY(-4px);
    box-shadow:
      0px 12px 16px -4px rgba(16, 24, 40, 0.08),
      0px 4px 6px -2px rgba(16, 24, 40, 0.03);
    background-color: ${nickname ? "white" : colors["gray-200"]};
  }

  &:active {
    transform: translateY(-2px);
    box-shadow:
      0px 4px 8px -2px rgba(16, 24, 40, 0.1),
      0px 2px 4px -1px rgba(16, 24, 40, 0.06);
  }

  img {
    margin: 0 auto;
    object-fit: contain;
    max-width: 96px;
    max-height: 96px;
    width: auto;
    height: auto;
    transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
  }

  &:hover img {
    transform: scale(1.05);
  }

  .pokemon-id {
    color: ${colors["gray-500"]};
    font-size: 0.875rem;
    margin-bottom: 2px;
  }

  .pokemon-name {
    font-weight: 600;
    font-size: 1.125rem;
    text-transform: capitalize;
    color: ${colors["gray-900"]};
    margin-bottom: 8px;
  }

  .types-container {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
  }
  `;
};

const PokemonAvatar = styled(LazyLoadImage)`
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
`;

const PixelatedPokemonCard = styled("div")((props: Props) => getStyle(props));

const PokeCard: React.FC<Props> = ({
  name,
  nickname,
  captured,
  sprite,
  pokemonId,
  types = [],
  children,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const formattedId = pokemonId ? String(pokemonId).padStart(3, "0") : "";

  const staticImageUrl = nickname
    ? sprite
    : `${POKEMON_IMAGE}/${pokemonId}.png`;
  const animatedImageUrl = `${POKEMON_IMAGE}/versions/generation-v/black-white/animated/${pokemonId}.gif`;

  // Preload animated image
  useEffect(() => {
    if (!nickname && pokemonId) {
      const img = new Image();
      img.src = animatedImageUrl;
    }
  }, [pokemonId, nickname, animatedImageUrl]);

  const handleMouseEnter = () => {
    if (!nickname) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!nickname) {
      setIsHovered(false);
    }
  };

  const cardContent = (
    <PixelatedPokemonCard
      nickname={nickname}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="pokemon-image-container">
        <PokemonAvatar
          src={isHovered && !nickname ? animatedImageUrl : staticImageUrl}
          alt={`pokemon ${name}`}
          width={96}
          height={96}
          loading="eager"
        />
      </div>

      <div className="pokemon-info">
        {formattedId && <Text className="pokemon-id">#{formattedId}</Text>}
        <Text className="pokemon-name">{nickname || name}</Text>

        {types.length > 0 && (
          <div className="types-container">
            {types.map((type) => (
              <TypeIcon key={type} type={type} size="sm" />
            ))}
          </div>
        )}
      </div>

      {children}

      {captured ? (
        <div className="capture-qty">
          <LazyLoadImage
            src="/static/pokeball.png"
            alt="pokeball"
            width={16}
            height={16}
          />
          <Text>x{captured}</Text>
        </div>
      ) : null}
    </PixelatedPokemonCard>
  );

  // If we have a pokemonId and no onClick handler, wrap in Link
  if (name && !onClick && !nickname) {
    return (
      <Link to={`/pokemon/${name}`} style={{ textDecoration: "none" }}>
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

export default PokeCard;
