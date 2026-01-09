import React, { useState, useMemo, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { Text } from "../../../components/ui";
import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  IconSparkles,
  IconZoomIn,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconX,
  IconPlayerPlay,
} from "@tabler/icons-react";
import * as S from "./SpritesTab.style";

// Types
interface SpriteSet {
  front_default?: string | null;
  front_female?: string | null;
  front_shiny?: string | null;
  front_shiny_female?: string | null;
  back_default?: string | null;
  back_female?: string | null;
  back_shiny?: string | null;
  back_shiny_female?: string | null;
  animated?: SpriteSet;
}

interface OtherSprites {
  dream_world?: {
    front_default?: string | null;
    front_female?: string | null;
  };
  home?: {
    front_default?: string | null;
    front_female?: string | null;
    front_shiny?: string | null;
    front_shiny_female?: string | null;
  };
  "official-artwork"?: {
    front_default?: string | null;
    front_shiny?: string | null;
  };
  showdown?: SpriteSet;
}

interface VersionSprites {
  [generation: string]: {
    [version: string]: SpriteSet;
  };
}

interface Sprites extends SpriteSet {
  other?: OtherSprites;
  versions?: VersionSprites;
}

interface SpritesTabProps {
  sprites: Sprites;
  name: string;
}

interface LightboxData {
  src: string;
  label: string;
  allSprites: Array<{ src: string; label: string }>;
  currentIndex: number;
}

// Constants
const GENERATION_NAMES: Record<string, string> = {
  "generation-i": "Generation I",
  "generation-ii": "Generation II",
  "generation-iii": "Generation III",
  "generation-iv": "Generation IV",
  "generation-v": "Generation V",
  "generation-vi": "Generation VI",
  "generation-vii": "Generation VII",
  "generation-viii": "Generation VIII",
};

const VERSION_NAMES: Record<string, string> = {
  "red-blue": "Red & Blue",
  yellow: "Yellow",
  crystal: "Crystal",
  gold: "Gold",
  silver: "Silver",
  emerald: "Emerald",
  "firered-leafgreen": "FireRed & LeafGreen",
  "ruby-sapphire": "Ruby & Sapphire",
  "diamond-pearl": "Diamond & Pearl",
  "heartgold-soulsilver": "HeartGold & SoulSilver",
  platinum: "Platinum",
  "black-white": "Black & White",
  "omegaruby-alphasapphire": "Omega Ruby & Alpha Sapphire",
  "x-y": "X & Y",
  "ultra-sun-ultra-moon": "Ultra Sun & Ultra Moon",
  icons: "Icons",
};

// Image cache
const imageCache = new Set<string>();

// ============ Lightbox Component ============
const Lightbox = React.memo(
  ({
    data,
    onClose,
    onNavigate,
  }: {
    data: LightboxData;
    onClose: () => void;
    onNavigate: (direction: "prev" | "next") => void;
  }) => {
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
        if (e.key === "ArrowLeft") onNavigate("prev");
        if (e.key === "ArrowRight") onNavigate("next");
      };
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "";
      };
    }, [onClose, onNavigate]);

    const hasPrev = data.currentIndex > 0;
    const hasNext = data.currentIndex < data.allSprites.length - 1;

    return createPortal(
      <S.LightboxOverlay onClick={onClose}>
        <S.LightboxContent onClick={(e) => e.stopPropagation()}>
          <S.LightboxClose onClick={onClose}>
            <IconX size={18} />
          </S.LightboxClose>
          <S.LightboxImage src={data.src} alt={data.label} />
          <S.LightboxLabel>{data.label}</S.LightboxLabel>
          {data.allSprites.length > 1 && (
            <S.LightboxNav>
              <S.LightboxNavButton
                onClick={() => onNavigate("prev")}
                disabled={!hasPrev}
              >
                <IconChevronLeft size={16} /> Previous
              </S.LightboxNavButton>
              <S.LightboxCounter>
                {data.currentIndex + 1} / {data.allSprites.length}
              </S.LightboxCounter>
              <S.LightboxNavButton
                onClick={() => onNavigate("next")}
                disabled={!hasNext}
              >
                Next <IconChevronRight size={16} />
              </S.LightboxNavButton>
            </S.LightboxNav>
          )}
        </S.LightboxContent>
      </S.LightboxOverlay>,
      document.body,
    );
  },
);

Lightbox.displayName = "Lightbox";

// ============ Sprite Item Component ============
const SpriteItem = React.memo(
  ({
    src,
    alt,
    label,
    isAnimated = false,
    isLarge = false,
    onClick,
  }: {
    src: string;
    alt: string;
    label: string;
    isAnimated?: boolean;
    isLarge?: boolean;
    onClick?: () => void;
  }) => {
    const isCached = imageCache.has(src);

    const handleLoad = useCallback(() => {
      imageCache.add(src);
    }, [src]);

    return (
      <S.SpriteItem $isLarge={isLarge} onClick={onClick}>
        <S.SpriteImage $isLarge={isLarge}>
          <LazyLoadImage
            src={src}
            alt={alt}
            width={isLarge ? 140 : 80}
            height={isLarge ? 140 : 80}
            effect={isCached ? undefined : "blur"}
            style={{
              imageRendering: isAnimated ? "auto" : "pixelated",
              objectFit: "contain",
            }}
            onLoad={handleLoad}
            threshold={100}
            placeholderSrc="/static/pokeball-transparent.png"
          />
        </S.SpriteImage>
        <S.SpriteLabel>{label}</S.SpriteLabel>
        <S.ZoomIcon className="zoom-icon">
          <IconZoomIn size={14} />
        </S.ZoomIcon>
      </S.SpriteItem>
    );
  },
);

SpriteItem.displayName = "SpriteItem";

// ============ Toggle Switch Component ============
const ShinyToggle = React.memo(
  ({ isShiny, onToggle }: { isShiny: boolean; onToggle: () => void }) => (
    <S.ToggleContainer>
      <S.ToggleLabel
        $isActive={!isShiny}
        onClick={() => !isShiny || onToggle()}
      >
        Normal
      </S.ToggleLabel>
      <S.ToggleSwitch $isShiny={isShiny} onClick={onToggle}>
        <S.ToggleKnob $isShiny={isShiny}>
          {isShiny && <IconSparkles size={12} />}
        </S.ToggleKnob>
      </S.ToggleSwitch>
      <S.ToggleLabel $isActive={isShiny} onClick={() => isShiny || onToggle()}>
        <IconSparkles size={14} style={{ marginRight: 4 }} />
        Shiny
      </S.ToggleLabel>
    </S.ToggleContainer>
  ),
);

ShinyToggle.displayName = "ShinyToggle";

// ============ Collapsible Section Component ============
const CollapsibleSection = React.memo(
  ({
    title,
    children,
    defaultOpen = false,
    badge,
  }: {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
    badge?: number;
  }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const handleToggle = useCallback(() => {
      setIsOpen((prev) => !prev);
    }, []);

    return (
      <S.CollapsibleContainer>
        <S.CollapsibleHeader onClick={handleToggle} $isOpen={isOpen}>
          <S.CollapsibleTitle>
            {title}
            {badge !== undefined && badge > 0 && (
              <S.SpriteBadge>{badge}</S.SpriteBadge>
            )}
          </S.CollapsibleTitle>
          <S.ChevronIcon $isOpen={isOpen}>
            <IconChevronDown size={18} />
          </S.ChevronIcon>
        </S.CollapsibleHeader>
        <S.CollapsibleContent $isOpen={isOpen}>{children}</S.CollapsibleContent>
      </S.CollapsibleContainer>
    );
  },
);

CollapsibleSection.displayName = "CollapsibleSection";

// ============ Comparison View Component ============
const ComparisonView = React.memo(
  ({
    normalSprites,
    shinySprites,
    name,
    onSpriteClick,
    isLarge = false,
  }: {
    normalSprites: Array<{ src: string; label: string }>;
    shinySprites: Array<{ src: string; label: string }>;
    name: string;
    onSpriteClick: (
      sprite: { src: string; label: string },
      allSprites: Array<{ src: string; label: string }>,
    ) => void;
    isLarge?: boolean;
  }) => {
    const allSprites = [...normalSprites, ...shinySprites];

    return (
      <S.ComparisonGrid>
        <S.ComparisonColumn $variant="normal">
          <S.ComparisonTitle $variant="normal">Normal</S.ComparisonTitle>
          <S.SpriteGridInner $isLarge={isLarge}>
            {normalSprites.map((sprite, idx) => (
              <SpriteItem
                key={idx}
                src={sprite.src}
                alt={`${name} ${sprite.label}`}
                label={sprite.label}
                isLarge={isLarge}
                onClick={() => onSpriteClick(sprite, allSprites)}
              />
            ))}
            {normalSprites.length === 0 && (
              <S.EmptyState>No normal sprites</S.EmptyState>
            )}
          </S.SpriteGridInner>
        </S.ComparisonColumn>
        <S.ComparisonColumn $variant="shiny">
          <S.ComparisonTitle $variant="shiny">
            <IconSparkles size={14} />
            Shiny
          </S.ComparisonTitle>
          <S.SpriteGridInner $isLarge={isLarge}>
            {shinySprites.map((sprite, idx) => (
              <SpriteItem
                key={idx}
                src={sprite.src}
                alt={`${name} ${sprite.label}`}
                label={sprite.label}
                isLarge={isLarge}
                onClick={() => onSpriteClick(sprite, allSprites)}
              />
            ))}
            {shinySprites.length === 0 && (
              <S.EmptyState>No shiny sprites</S.EmptyState>
            )}
          </S.SpriteGridInner>
        </S.ComparisonColumn>
      </S.ComparisonGrid>
    );
  },
);

ComparisonView.displayName = "ComparisonView";

// ============ Helpers ============
const countSprites = (obj: object | null | undefined): number => {
  if (!obj) return 0;
  return Object.values(obj).filter((v) => typeof v === "string" && v.length > 0)
    .length;
};

const extractSprites = (
  spriteSet: SpriteSet | undefined,
  filter?: "normal" | "shiny" | "all",
): Array<{ src: string; label: string }> => {
  if (!spriteSet) return [];

  const sprites: Array<{ src: string; label: string }> = [];
  const labelMap: Record<string, { label: string; isShiny: boolean }> = {
    front_default: { label: "Front", isShiny: false },
    front_female: { label: "Front ♀", isShiny: false },
    front_shiny: { label: "Shiny Front", isShiny: true },
    front_shiny_female: { label: "Shiny Front ♀", isShiny: true },
    back_default: { label: "Back", isShiny: false },
    back_female: { label: "Back ♀", isShiny: false },
    back_shiny: { label: "Shiny Back", isShiny: true },
    back_shiny_female: { label: "Shiny Back ♀", isShiny: true },
  };

  Object.entries(spriteSet).forEach(([key, value]) => {
    if (typeof value === "string" && value && key !== "animated") {
      const info = labelMap[key];
      if (info) {
        const shouldInclude =
          !filter ||
          filter === "all" ||
          (filter === "shiny" && info.isShiny) ||
          (filter === "normal" && !info.isShiny);

        if (shouldInclude) {
          sprites.push({ src: value, label: info.label });
        }
      }
    }
  });

  return sprites;
};

// ============ Main Component ============
const SpritesTab: React.FC<SpritesTabProps> = ({ sprites, name }) => {
  const [viewMode, setViewMode] = useState<"comparison" | "toggle">(
    "comparison",
  );
  const [isShiny, setIsShiny] = useState(false);
  const [lightbox, setLightbox] = useState<LightboxData | null>(null);

  // Memoized data
  const defaultNormalSprites = useMemo(
    () => (sprites ? extractSprites(sprites, "normal") : []),
    [sprites],
  );

  const defaultShinySprites = useMemo(
    () => (sprites ? extractSprites(sprites, "shiny") : []),
    [sprites],
  );

  const mainSpritesCount = useMemo(() => {
    return defaultNormalSprites.length + defaultShinySprites.length;
  }, [defaultNormalSprites, defaultShinySprites]);

  const versionGenerations = useMemo(() => {
    if (!sprites?.versions) return [];

    return Object.entries(sprites.versions)
      .sort(([a], [b]) => a.localeCompare(b))
      .filter(([, genSprites]) => {
        return Object.values(genSprites).some((versionSprites) =>
          Object.values(versionSprites).some(
            (v) =>
              (typeof v === "string" && v) ||
              (typeof v === "object" && v && Object.values(v).some((sv) => sv)),
          ),
        );
      });
  }, [sprites?.versions]);

  // Handlers
  const handleSpriteClick = useCallback(
    (
      sprite: { src: string; label: string },
      allSprites: Array<{ src: string; label: string }>,
    ) => {
      const currentIndex = allSprites.findIndex((s) => s.src === sprite.src);
      setLightbox({
        src: sprite.src,
        label: sprite.label,
        allSprites,
        currentIndex,
      });
    },
    [],
  );

  const handleLightboxNavigate = useCallback((direction: "prev" | "next") => {
    setLightbox((prev) => {
      if (!prev) return null;
      const newIndex =
        direction === "prev" ? prev.currentIndex - 1 : prev.currentIndex + 1;
      if (newIndex < 0 || newIndex >= prev.allSprites.length) return prev;
      const newSprite = prev.allSprites[newIndex];
      return {
        ...prev,
        src: newSprite.src,
        label: newSprite.label,
        currentIndex: newIndex,
      };
    });
  }, []);

  const handleCloseLightbox = useCallback(() => {
    setLightbox(null);
  }, []);

  const toggleShiny = useCallback(() => {
    setIsShiny((prev) => !prev);
  }, []);

  if (!sprites) {
    return (
      <S.SpriteContainer>
        <S.EmptyState>
          <Text>No sprite data available for this Pokémon.</Text>
        </S.EmptyState>
      </S.SpriteContainer>
    );
  }

  return (
    <S.SpriteContainer>
      {/* Lightbox */}
      {lightbox && (
        <Lightbox
          data={lightbox}
          onClose={handleCloseLightbox}
          onNavigate={handleLightboxNavigate}
        />
      )}

      {/* Header */}
      <S.HeaderSection>
        <Text as="h3">Sprite Gallery</Text>
        <S.HeaderSubtext>
          Click any sprite to view in full size. Use arrow keys to navigate.
        </S.HeaderSubtext>
      </S.HeaderSection>

      {/* Default Sprites with Comparison View */}
      <CollapsibleSection
        title="Default Sprites"
        defaultOpen={true}
        badge={mainSpritesCount}
      >
        <S.SectionHeaderRow>
          <S.ViewModeToggle>
            <S.ViewModeButton
              $isActive={viewMode === "comparison"}
              onClick={() => setViewMode("comparison")}
            >
              Side by Side
            </S.ViewModeButton>
            <S.ViewModeButton
              $isActive={viewMode === "toggle"}
              onClick={() => setViewMode("toggle")}
            >
              Toggle View
            </S.ViewModeButton>
          </S.ViewModeToggle>
        </S.SectionHeaderRow>

        {viewMode === "comparison" ? (
          <ComparisonView
            normalSprites={defaultNormalSprites}
            shinySprites={defaultShinySprites}
            name={name}
            onSpriteClick={handleSpriteClick}
          />
        ) : (
          <>
            <ShinyToggle isShiny={isShiny} onToggle={toggleShiny} />
            <S.SpriteGrid>
              {(isShiny ? defaultShinySprites : defaultNormalSprites).map(
                (sprite, idx) => (
                  <SpriteItem
                    key={idx}
                    src={sprite.src}
                    alt={`${name} ${sprite.label}`}
                    label={sprite.label}
                    onClick={() =>
                      handleSpriteClick(sprite, [
                        ...defaultNormalSprites,
                        ...defaultShinySprites,
                      ])
                    }
                  />
                ),
              )}
            </S.SpriteGrid>
          </>
        )}
      </CollapsibleSection>

      {/* Official Artwork */}
      {sprites.other?.["official-artwork"] &&
        (sprites.other["official-artwork"].front_default ||
          sprites.other["official-artwork"].front_shiny) && (
          <CollapsibleSection
            title="Official Artwork"
            defaultOpen={true}
            badge={countSprites(sprites.other["official-artwork"])}
          >
            {(() => {
              const artworkSprites: Array<{ src: string; label: string }> = [];
              if (sprites.other!["official-artwork"]!.front_default) {
                artworkSprites.push({
                  src: sprites.other!["official-artwork"]!.front_default,
                  label: "Official Artwork",
                });
              }
              if (sprites.other!["official-artwork"]!.front_shiny) {
                artworkSprites.push({
                  src: sprites.other!["official-artwork"]!.front_shiny,
                  label: "Shiny Artwork",
                });
              }
              return (
                <S.SpriteGrid $isLarge>
                  {artworkSprites.map((sprite, idx) => (
                    <SpriteItem
                      key={idx}
                      src={sprite.src}
                      alt={`${name} ${sprite.label}`}
                      label={sprite.label}
                      isLarge
                      onClick={() => handleSpriteClick(sprite, artworkSprites)}
                    />
                  ))}
                </S.SpriteGrid>
              );
            })()}
          </CollapsibleSection>
        )}

      {/* Pokémon HOME */}
      {sprites.other?.home &&
        Object.values(sprites.other.home).some((v) => v) && (
          <CollapsibleSection
            title="Pokémon HOME"
            badge={countSprites(sprites.other.home)}
          >
            {(() => {
              const home = sprites.other!.home!;
              const normalSprites: Array<{ src: string; label: string }> = [];
              const shinySprites: Array<{ src: string; label: string }> = [];

              if (home.front_default)
                normalSprites.push({
                  src: home.front_default,
                  label: "Default",
                });
              if (home.front_female)
                normalSprites.push({ src: home.front_female, label: "Female" });
              if (home.front_shiny)
                shinySprites.push({ src: home.front_shiny, label: "Shiny" });
              if (home.front_shiny_female)
                shinySprites.push({
                  src: home.front_shiny_female,
                  label: "Shiny ♀",
                });

              return (
                <ComparisonView
                  normalSprites={normalSprites}
                  shinySprites={shinySprites}
                  name={name}
                  onSpriteClick={handleSpriteClick}
                  isLarge
                />
              );
            })()}
          </CollapsibleSection>
        )}

      {/* Dream World */}
      {sprites.other?.dream_world &&
        (sprites.other.dream_world.front_default ||
          sprites.other.dream_world.front_female) && (
          <CollapsibleSection
            title="Dream World"
            badge={countSprites(sprites.other.dream_world)}
          >
            {(() => {
              const dwSprites: Array<{ src: string; label: string }> = [];
              if (sprites.other!.dream_world!.front_default) {
                dwSprites.push({
                  src: sprites.other!.dream_world!.front_default,
                  label: "Default",
                });
              }
              if (sprites.other!.dream_world!.front_female) {
                dwSprites.push({
                  src: sprites.other!.dream_world!.front_female,
                  label: "Female",
                });
              }
              return (
                <S.SpriteGrid $isLarge>
                  {dwSprites.map((sprite, idx) => (
                    <SpriteItem
                      key={idx}
                      src={sprite.src}
                      alt={`${name} ${sprite.label}`}
                      label={sprite.label}
                      isLarge
                      onClick={() => handleSpriteClick(sprite, dwSprites)}
                    />
                  ))}
                </S.SpriteGrid>
              );
            })()}
          </CollapsibleSection>
        )}

      {/* Showdown Sprites */}
      {sprites.other?.showdown &&
        Object.values(sprites.other.showdown).some(
          (v) => typeof v === "string" && v,
        ) && (
          <CollapsibleSection
            title="Showdown (Animated)"
            badge={countSprites(sprites.other.showdown)}
          >
            {(() => {
              const allSprites = extractSprites(sprites.other!.showdown, "all");
              return (
                <S.SpriteGrid>
                  {allSprites.map((sprite, idx) => (
                    <SpriteItem
                      key={idx}
                      src={sprite.src}
                      alt={`${name} showdown ${sprite.label}`}
                      label={sprite.label}
                      isAnimated
                      onClick={() => handleSpriteClick(sprite, allSprites)}
                    />
                  ))}
                </S.SpriteGrid>
              );
            })()}
          </CollapsibleSection>
        )}

      {/* Game Version Sprites */}
      {versionGenerations.length > 0 && (
        <S.VersionsSection>
          <S.SectionDivider>
            <S.DividerLine />
            <S.DividerText>Game Version Sprites</S.DividerText>
            <S.DividerLine />
          </S.SectionDivider>

          {versionGenerations.map(([genKey, genSprites]) => (
            <CollapsibleSection
              key={genKey}
              title={GENERATION_NAMES[genKey] || genKey}
            >
              {Object.entries(genSprites).map(
                ([versionKey, versionSprites]) => {
                  const normalSprites = extractSprites(
                    versionSprites,
                    "normal",
                  );
                  const shinySprites = extractSprites(versionSprites, "shiny");
                  const animatedNormal = versionSprites.animated
                    ? extractSprites(versionSprites.animated, "normal")
                    : [];
                  const animatedShiny = versionSprites.animated
                    ? extractSprites(versionSprites.animated, "shiny")
                    : [];

                  const hasSprites =
                    normalSprites.length > 0 ||
                    shinySprites.length > 0 ||
                    animatedNormal.length > 0 ||
                    animatedShiny.length > 0;

                  if (!hasSprites) return null;

                  return (
                    <S.VersionBlock key={versionKey}>
                      <S.VersionTitle>
                        {VERSION_NAMES[versionKey] ||
                          versionKey.replace(/-/g, " ")}
                      </S.VersionTitle>

                      {(normalSprites.length > 0 ||
                        shinySprites.length > 0) && (
                        <ComparisonView
                          normalSprites={normalSprites}
                          shinySprites={shinySprites}
                          name={name}
                          onSpriteClick={handleSpriteClick}
                        />
                      )}

                      {(animatedNormal.length > 0 ||
                        animatedShiny.length > 0) && (
                        <S.AnimatedLabel>
                          <IconPlayerPlay size={12} />
                          Animated
                        </S.AnimatedLabel>
                      )}
                      {(animatedNormal.length > 0 ||
                        animatedShiny.length > 0) && (
                        <ComparisonView
                          normalSprites={animatedNormal}
                          shinySprites={animatedShiny}
                          name={name}
                          onSpriteClick={handleSpriteClick}
                        />
                      )}
                    </S.VersionBlock>
                  );
                },
              )}
            </CollapsibleSection>
          ))}
        </S.VersionsSection>
      )}
    </S.SpriteContainer>
  );
};

export default React.memo(SpritesTab);
