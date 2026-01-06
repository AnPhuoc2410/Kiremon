import React, { HTMLAttributes, useState, useEffect } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { Link } from "react-router-dom";

import { Text } from "..";
import { colors } from "../../utils";
import { POKEMON_IMAGE, POKEMON_SHOWDOWN_IMAGE } from "../../../config/api.config";
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

const gentlePopUpAnimation = keyframes`
  0% { transform: scale(1) translateY(0); }
  40% { transform: scale(1.2) translateY(-16px); }
  60% { transform: scale(1.05) translateY(-4px); }
  80% { transform: scale(1.12) translateY(-7px); }
  100% { transform: scale(1.1) translateY(-5px); }
`;

const PixelatedPokemonCard = styled.div<Props>`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 16px;
  background-color: white;
  border-radius: 12px;
  transition: all 0.2s ease-in-out;

  overflow: visible;
  z-index: 1;

  box-shadow:
    0px 1px 3px rgba(16, 24, 40, 0.1),
    0px 1px 2px rgba(16, 24, 40, 0.06);

  cursor: ${(props) => (props.nickname ? "default" : "pointer")};

  &:hover {
    transform: translateY(-4px);
    background-color: ${(props) => (props.nickname ? "white" : colors["gray-200"])};
    box-shadow:
      0px 12px 16px -4px rgba(16, 24, 40, 0.08),
      0px 4px 6px -2px rgba(16, 24, 40, 0.03);
  }

  &:active {
    transform: translateY(-2px);
    box-shadow:
      0px 4px 8px -2px rgba(16, 24, 40, 0.1),
      0px 2px 4px -1px rgba(16, 24, 40, 0.06);
  }

  .capture-qty,
  button {
    position: absolute;
    top: 8px;
    right: 12px;
    display: flex;
    gap: 4px;
    align-items: center;
    z-index: 5;
  }

  .pokemon-image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 120px;
    margin-bottom: 12px;
    position: relative;
    overflow: visible;
  }

  .pokemon-image-container img {
    margin: 0 auto;
    object-fit: contain;
    max-height: 100%;
    width: auto;
    height: auto;

    transition: filter 0.3s ease;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));

    transform-origin: center bottom;
    will-change: transform;
  }

  &:hover .pokemon-image-container img {
    animation: ${gentlePopUpAnimation} 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    filter: drop-shadow(0 10px 8px rgba(0, 0, 0, 0.2));
  }

  .pokemon-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    position: relative;
    z-index: 2;
  }

  .capture-qty img { width: 14px; height: 14px; object-fit: contain; }
  .pokemon-id { color: ${colors["gray-500"]}; font-size: 0.875rem; margin-bottom: 2px; }
  .pokemon-name { font-weight: 600; font-size: 1.125rem; text-transform: capitalize; color: ${colors["gray-900"]}; margin-bottom: 8px; }
  .types-container { display: flex; justify-content: center; gap: 0.5rem; }
`;

const PokemonAvatar = styled(LazyLoadImage)`
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
`;

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
  const [hasAnimatedImage, setHasAnimatedImage] = useState(false);
  const [imageError, setImageError] = useState(false);
  const formattedId = pokemonId ? String(pokemonId).padStart(3, "0") : "";

  // Standard static image
  const staticImageUrl = nickname
    ? sprite
    : `${POKEMON_IMAGE}/${pokemonId}.png`;

  // Fallback image (Showdown GIF) - used if static image fails
  const fallbackImageUrl = `${POKEMON_SHOWDOWN_IMAGE}/${pokemonId}.gif`;

  const animatedImageUrl = `${POKEMON_IMAGE}/versions/generation-v/black-white/animated/${pokemonId}.gif`;

  // Determine the actual source to display
  let currentSrc = staticImageUrl;

  // If hovering (and valid), show animated
  if (isHovered && !nickname && hasAnimatedImage) {
    currentSrc = animatedImageUrl;
  }
  // If not hovering, but we had an error on the main static image, use fallback
  else if (imageError && !nickname) {
    currentSrc = fallbackImageUrl;
  }

  useEffect(() => {
    if (!nickname && pokemonId) {
      const img = new Image();
      img.src = animatedImageUrl;
      img.onload = () => setHasAnimatedImage(true);
      img.onerror = () => setHasAnimatedImage(false);
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
          src={currentSrc}
          alt={`pokemon ${name}`}
          width={96}
          height={96}
          loading="eager"
          onError={() => setImageError(true)}
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
