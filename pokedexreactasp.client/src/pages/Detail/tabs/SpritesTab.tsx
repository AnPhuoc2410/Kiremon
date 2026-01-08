import React from "react";
import { Text } from "../../../components/ui";
import { LazyLoadImage } from "react-lazy-load-image-component";
import * as S from "./SpritesTab.style";

interface SpritesTabProps {
  sprites: any;
  name: string;
}

const PokemonAvatar = ({
  src,
  alt,
  label,
}: {
  src: string;
  alt: string;
  label: string;
}) => (
  <S.SpriteItem>
    <S.SpriteImage>
      <LazyLoadImage
        src={src}
        alt={alt}
        width={120}
        height={120}
        effect="blur"
        style={{
          imageRendering: "pixelated",
        }}
      />
    </S.SpriteImage>
    <S.SpriteLabel>{label}</S.SpriteLabel>
  </S.SpriteItem>
);

const SpritesTab: React.FC<SpritesTabProps> = ({ sprites, name }) => {
  return (
    <S.SpriteContainer>
      <Text as="h3" style={{ marginBottom: "16px" }}>
        Sprite Gallery
      </Text>
      <S.SpriteGallery>
        {sprites && sprites.front_default && (
          <PokemonAvatar
            src={sprites.front_default}
            alt={`${name} front`}
            label="Front Default"
          />
        )}
        {sprites && sprites.back_default && (
          <PokemonAvatar
            src={sprites.back_default}
            alt={`${name} back`}
            label="Back Default"
          />
        )}
        {sprites && sprites.front_shiny && (
          <PokemonAvatar
            src={sprites.front_shiny}
            alt={`${name} shiny front`}
            label="Shiny Front"
          />
        )}
        {sprites && sprites.back_shiny && (
          <PokemonAvatar
            src={sprites.back_shiny}
            alt={`${name} shiny back`}
            label="Shiny Back"
          />
        )}
      </S.SpriteGallery>

      {sprites &&
        sprites.versions &&
        sprites.versions["generation-v"] &&
        sprites.versions["generation-v"]["black-white"] &&
        sprites.versions["generation-v"]["black-white"].animated && (
          <S.VersionsContainer>
            <S.GenerationTitle>Animated Sprites (Gen V)</S.GenerationTitle>
            <S.SpriteGallery>
              {sprites.versions["generation-v"]["black-white"].animated
                .front_default && (
                <PokemonAvatar
                  src={
                    sprites.versions["generation-v"]["black-white"].animated
                      .front_default
                  }
                  alt={`${name} animated`}
                  label="Animated Front"
                />
              )}
              {sprites.versions["generation-v"]["black-white"].animated
                .back_default && (
                <PokemonAvatar
                  src={
                    sprites.versions["generation-v"]["black-white"].animated
                      .back_default
                  }
                  alt={`${name} animated back`}
                  label="Animated Back"
                />
              )}
              {sprites.versions["generation-v"]["black-white"].animated
                .front_shiny && (
                <PokemonAvatar
                  src={
                    sprites.versions["generation-v"]["black-white"].animated
                      .front_shiny
                  }
                  alt={`${name} animated shiny`}
                  label="Animated Shiny Front"
                />
              )}
              {sprites.versions["generation-v"]["black-white"].animated
                .back_shiny && (
                <PokemonAvatar
                  src={
                    sprites.versions["generation-v"]["black-white"].animated
                      .back_shiny
                  }
                  alt={`${name} animated shiny back`}
                  label="Animated Shiny Back"
                />
              )}
            </S.SpriteGallery>
          </S.VersionsContainer>
        )}
    </S.SpriteContainer>
  );
};

export default SpritesTab;
