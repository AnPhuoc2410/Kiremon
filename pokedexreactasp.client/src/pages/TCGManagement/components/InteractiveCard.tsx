import React, { useRef, useState } from "react";
import styled from "@emotion/styled";

// ─────────────────────────────────────────────────────────────────────────────
// Design tokens matching index.style.ts
// ─────────────────────────────────────────────────────────────────────────────
const C_INK = "#0f172a";

const RARITY_ACCENT: Record<string, string> = {
  Common: "#94a3b8",
  Uncommon: "#22c55e",
  Rare: "#3b82f6",
  HoloRare: "#8b5cf6",
  UltraRare: "#f97316",
  SecretRare: "#ec4899",
  Promo: "#facc15",
  Unknown: "#64748b",
};

// ─────────────────────────────────────────────────────────────────────────────
// Styled Components
// ─────────────────────────────────────────────────────────────────────────────
export const CardContainer = styled("div")({
  perspective: "1000px",
  position: "relative",
  aspectRatio: "0.715",
  width: "100%",
});

export const CardInner = styled("div")<{
  rarity: string;
  isSelected?: boolean;
}>(({ rarity = "Common", isSelected }) => {
  const accent = RARITY_ACCENT[rarity] ?? "#94a3b8";
  return {
    width: "100%",
    height: "100%",
    position: "relative",
    background: "#ffffff",
    border: isSelected ? `3px solid ${accent}` : `2px solid ${C_INK}`,
    boxShadow: isSelected
      ? `0 0 0 2px ${accent}, 3px 3px 0px ${C_INK}`
      : `3px 3px 0px rgba(15,23,42,0.12)`,
    borderRadius: "8px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    cursor: "pointer",
    // Use CSS Custom Properties driven by JS events
    transform: `rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) scale3d(var(--s, 1), var(--s, 1), var(--s, 1))`,
    transition:
      "transform 0.15s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.15s ease",
    transformStyle: "preserve-3d",
    backfaceVisibility: "hidden",
    touchAction: "none",

    // rarity top strip
    "&::before": {
      content: '""',
      display: "block",
      height: "3px",
      background: accent,
      zIndex: 5,
    },

    "&:hover": {
      boxShadow: `0 0 0 2px ${accent}, 4px 6px 0px ${C_INK}`,
      zIndex: 10,
    },

    ".card-img-wrap": {
      position: "relative",
      flex: 1,
      background: "#f8fafc",
      overflow: "hidden",
      pointerEvents: "none",
    },
    ".card-img": {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "contain",
    },

    ".card-body": {
      padding: "10px 10px 12px",
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      background: "#ffffff",
      pointerEvents: "none",
    },
    ".card-name": {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: "0.55rem",
      color: C_INK,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      lineHeight: 1.4,
    },
    ".card-meta": {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    ".card-rarity": {
      fontFamily: '"VT323", "Outfit", monospace',
      fontSize: "0.9rem",
      color: accent,
      fontWeight: 700,
    },
    ".card-qty": {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: "0.5rem",
      background: "#f1f5f9",
      border: `1px solid ${C_INK}`,
      padding: "3px 6px",
      color: C_INK,
    },
  };
});

// ─────────────────────────────────────────────────────────────────────────────
// Authentic Holographic Overlays (inspired by simeydotme/pokemon-cards-css)
// ─────────────────────────────────────────────────────────────────────────────

// SecretRare: Cosmos/Galaxy foil using a galaxy foil texture image + rainbow
// Covers: Special Illustration Rare, Hyper Rare, Rare Secret, Rare Rainbow, Shiny Ultra
const SecretHoloOverlay = styled("div")({
  position: "absolute",
  inset: 0,
  zIndex: 3,
  mixBlendMode: "color-dodge",
  opacity: "var(--o, 0)",
  pointerEvents: "none",
  transition: "opacity 0.25s ease",
  // Authentic cosmos foil texture blended with a shifting rainbow
  backgroundImage: `
    linear-gradient(
      115deg,
      rgba(255, 0, 128, 0.4) 0%,
      rgba(255, 128, 0, 0.4) 20%,
      rgba(255, 255, 0, 0.4) 40%,
      rgba(0, 255, 128, 0.4) 60%,
      rgba(0, 128, 255, 0.4) 80%,
      rgba(128, 0, 255, 0.4) 100%
    ),
    url("https://poke-holo.simey.me/img/foils/cosmos.webp")
  `,
  backgroundSize: "200% 200%, cover",
  backgroundPosition: `
    calc(50% + (var(--mx) - 50) * -1.5%) calc(50% + (var(--my) - 50) * -1.5%),
    calc(50% + (var(--mx) - 50) * -0.5%) calc(50% + (var(--my) - 50) * -0.5%)
  `,
  backgroundBlendMode: "color-dodge",
  filter: "brightness(1.1) contrast(1.2)",
});

// SecretRare: Deep shadow overlay to make the cosmos stars pop (color-burn)
const SecretBurnOverlay = styled("div")({
  position: "absolute",
  inset: 0,
  zIndex: 4,
  mixBlendMode: "color-burn",
  opacity: "calc(var(--o, 0) * 0.7)",
  pointerEvents: "none",
  transition: "opacity 0.25s ease",
  backgroundImage: `
    linear-gradient(
      115deg,
      rgba(0, 0, 0, 0.8) 0%,
      rgba(255, 255, 255, 0.1) 40%,
      rgba(255, 255, 255, 0.1) 60%,
      rgba(0, 0, 0, 0.8) 100%
    )
  `,
  backgroundSize: "200% 200%",
  backgroundPosition: `calc(50% + (var(--mx) - 50) * -1.5%) calc(50% + (var(--my) - 50) * -1.5%)`,
});

// UltraRare: Authentic Sunburst/Diagonal Holo
// Double Rare (ex), Illustration Rare, Shiny Rare, V/VMAX/VSTAR
const UltraHoloOverlay = styled("div")({
  position: "absolute",
  inset: 0,
  zIndex: 3,
  mixBlendMode: "color-dodge",
  opacity: "var(--o, 0)",
  pointerEvents: "none",
  transition: "opacity 0.25s ease",
  backgroundImage: `
    repeating-linear-gradient(
      -45deg,
      transparent 0%,
      rgba(255, 150, 0, 0.35) 2%,
      transparent 4%,
      transparent 15%,
      rgba(255, 100, 0, 0.35) 17%,
      transparent 19%,
      transparent 26%,
      rgba(255, 220, 50, 0.4) 28%,
      transparent 30%,
      transparent 40%
    ),
    linear-gradient(
      115deg,
      transparent 20%,
      rgba(255, 220, 100, 0.5) 40%,
      rgba(255, 150, 0, 0.5) 60%,
      transparent 80%
    )
  `,
  backgroundSize: "300% 300%, 200% 200%",
  backgroundPosition: `
    calc(50% + (var(--mx) - 50) * -0.5%) calc(50% + (var(--my) - 50) * -0.5%),
    calc(50% + (var(--mx) - 50) * -1.2%) calc(50% + (var(--my) - 50) * -1.2%)
  `,
  backgroundBlendMode: "color-dodge",
});

// UltraRare: Stronger golden spotlight glare
const UltraGlare = styled("div")({
  position: "absolute",
  inset: 0,
  zIndex: 4,
  mixBlendMode: "overlay",
  opacity: "var(--o, 0)",
  pointerEvents: "none",
  transition: "opacity 0.25s ease",
  background: `radial-gradient(
    ellipse at calc(var(--mx) * 1%) calc(var(--my) * 1%),
    rgba(255, 220, 100, 0.7) 0%,
    rgba(255, 150, 0, 0.2) 30%,
    rgba(255, 255, 255, 0) 60%
  )`,
});

// HoloRare: Cosmos Galaxy Effect (Subtler version for standard holos)
// Rare Holo Star, Trainer Gallery Rare Holo
const HoloRareOverlay = styled("div")({
  position: "absolute",
  inset: 0,
  zIndex: 3,
  mixBlendMode: "color-dodge",
  opacity: "var(--o, 0)",
  pointerEvents: "none",
  transition: "opacity 0.25s ease",
  backgroundImage: `
    linear-gradient(
      115deg,
      transparent 15%,
      rgba(0, 200, 255, 0.3) 30%,
      rgba(150, 100, 255, 0.3) 50%,
      rgba(255, 100, 200, 0.3) 70%,
      transparent 85%
    ),
    url("https://poke-holo.simey.me/img/foils/cosmos.webp")
  `,
  backgroundSize: "200% 200%, cover",
  backgroundPosition: `
    calc(50% + (var(--mx) - 50) * -1.5%) calc(50% + (var(--my) - 50) * -1.5%),
    calc(50% + (var(--mx) - 50) * -0.5%) calc(50% + (var(--my) - 50) * -0.5%)
  `,
  backgroundBlendMode: "color-dodge",
});

// Rare: Subtle Sheen
const RareHoloOverlay = styled("div")({
  position: "absolute",
  inset: 0,
  zIndex: 3,
  mixBlendMode: "screen",
  opacity: "calc(var(--o, 0) * 0.8)",
  pointerEvents: "none",
  transition: "opacity 0.25s ease",
  backgroundImage: `
    linear-gradient(
      115deg,
      transparent 30%,
      rgba(200, 230, 255, 0.35) 45%,
      rgba(255, 255, 255, 0.5) 50%,
      rgba(200, 230, 255, 0.35) 55%,
      transparent 70%
    )
  `,
  backgroundSize: "250% 250%",
  backgroundPosition: `calc(50% + (var(--mx) - 50) * -1.2%) calc(50% + (var(--my) - 50) * -1.2%)`,
});

// Promo: Geometric/Radiant Foil
const PromoHoloOverlay = styled("div")({
  position: "absolute",
  inset: 0,
  zIndex: 3,
  mixBlendMode: "color-dodge",
  opacity: "var(--o, 0)",
  pointerEvents: "none",
  transition: "opacity 0.25s ease",
  backgroundImage: `
    repeating-linear-gradient(
      45deg,
      rgba(255, 220, 50, 0.1) 0%,
      rgba(255, 220, 50, 0.1) 5%,
      transparent 5%,
      transparent 10%
    ),
    repeating-linear-gradient(
      -45deg,
      rgba(255, 220, 50, 0.1) 0%,
      rgba(255, 220, 50, 0.1) 5%,
      transparent 5%,
      transparent 10%
    ),
    linear-gradient(
      115deg,
      transparent 20%,
      rgba(255, 220, 100, 0.4) 50%,
      transparent 80%
    )
  `,
  backgroundSize: "150% 150%, 150% 150%, 200% 200%",
  backgroundPosition: `
    calc(50% + (var(--mx) - 50) * -0.5%) calc(50% + (var(--my) - 50) * -0.5%),
    calc(50% + (var(--mx) - 50) * -0.5%) calc(50% + (var(--my) - 50) * -0.5%),
    calc(50% + (var(--mx) - 50) * -1.2%) calc(50% + (var(--my) - 50) * -1.2%)
  `,
  backgroundBlendMode: "color-dodge",
});

// Standard soft white glare spotlight — dynamically tracks mouse
const GlareOverlay = styled("div")({
  position: "absolute",
  inset: 0,
  zIndex: 4,
  mixBlendMode: "soft-light",
  opacity: "var(--o, 0)",
  pointerEvents: "none",
  transition: "opacity 0.25s ease",
  background: `radial-gradient(
    circle at calc(var(--mx) * 1%) calc(var(--my) * 1%),
    rgba(255, 255, 255, 0.7) 0%,
    rgba(255, 255, 255, 0) 50%
  )`,
});

// ─────────────────────────────────────────────────────────────────────────────
// Helper: map rarityTier → holo visual tier
// ─────────────────────────────────────────────────────────────────────────────
type HoloTier = "secret" | "ultra" | "holo" | "rare" | "promo" | "none";

function getHoloTier(rarityTier: string): HoloTier {
  switch (rarityTier) {
    case "SecretRare":
      return "secret";
    case "UltraRare":
      return "ultra";
    case "HoloRare":
      return "holo";
    case "Rare":
      return "rare";
    case "Promo":
      return "promo";
    default:
      return "none";
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Component Props
// ─────────────────────────────────────────────────────────────────────────────
interface InteractiveCardProps {
  card: {
    userCardId: number;
    name: string;
    rarityTier: string;
    quantity: number;
    imageLarge?: string | null;
    imageSmall?: string | null;
  };
  isSelected: boolean;
  onClick: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// InteractiveCard Component
// ─────────────────────────────────────────────────────────────────────────────
export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  card,
  isSelected,
  onClick,
  onKeyDown,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({
    x: 50,
    y: 50,
    rx: 0,
    ry: 0,
    o: 0,
    s: 1,
  });

  const holoTier = getHoloTier(card.rarityTier);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const absoluteX = e.clientX - rect.left;
    const absoluteY = e.clientY - rect.top;

    const percentX = Math.min(100, Math.max(0, (absoluteX / rect.width) * 100));
    const percentY = Math.min(
      100,
      Math.max(0, (absoluteY / rect.height) * 100),
    );

    const centerX = percentX - 50;
    const centerY = percentY - 50;

    // Higher-tier rarities get a more dramatic tilt
    const maxRotation =
      holoTier === "secret" ? 18 : holoTier === "ultra" ? 16 : 14;

    const rx = (centerY / 50) * -maxRotation;
    const ry = (centerX / 50) * maxRotation;

    setCoords({
      x: percentX,
      y: percentY,
      rx,
      ry,
      o: 1,
      s: holoTier === "secret" ? 1.05 : holoTier === "ultra" ? 1.04 : 1.03,
    });
  };

  const handleMouseLeave = () => {
    setCoords({ x: 50, y: 50, rx: 0, ry: 0, o: 0, s: 1 });
  };

  const inlineStyles = {
    "--mx": coords.x,
    "--my": coords.y,
    "--rx": `${coords.rx}deg`,
    "--ry": `${coords.ry}deg`,
    "--o": coords.o,
    "--s": coords.s,
  } as React.CSSProperties;

  return (
    <CardContainer
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={onKeyDown}
      aria-label={`${card.name} — ${card.rarityTier}, qty ${card.quantity}`}
    >
      <CardInner
        rarity={card.rarityTier}
        isSelected={isSelected}
        style={inlineStyles}
      >
        <div className="card-img-wrap">
          <img
            className="card-img"
            src={
              card.imageLarge || card.imageSmall || "/static/tcgcard_back.png"
            }
            alt={card.name}
            loading="lazy"
          />
        </div>
        <div className="card-body">
          <span className="card-name">{card.name}</span>
          <div className="card-meta">
            <span className="card-rarity">{card.rarityTier}</span>
            <span className="card-qty">×{card.quantity}</span>
          </div>
        </div>

        {/* ── Tier-specific holographic overlays ── */}
        {holoTier === "secret" && (
          <>
            <SecretHoloOverlay />
            <SecretBurnOverlay />
          </>
        )}
        {holoTier === "ultra" && (
          <>
            <UltraHoloOverlay />
            <UltraGlare />
          </>
        )}
        {holoTier === "holo" && (
          <>
            <HoloRareOverlay />
            <GlareOverlay />
          </>
        )}
        {holoTier === "rare" && (
          <>
            <RareHoloOverlay />
            <GlareOverlay />
          </>
        )}
        {holoTier === "promo" && (
          <>
            <PromoHoloOverlay />
            <GlareOverlay />
          </>
        )}
      </CardInner>
    </CardContainer>
  );
};
