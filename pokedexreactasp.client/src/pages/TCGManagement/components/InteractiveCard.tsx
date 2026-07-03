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

// Holographic Overlay - mix-blend-mode: color-dodge for pure shine
export const HoloOverlay = styled("div")<{ isRare: boolean }>(({ isRare }) => ({
  position: "absolute",
  inset: 0,
  zIndex: 3,
  mixBlendMode: "color-dodge",
  opacity: "var(--o, 0)",
  pointerEvents: "none",
  transition: "opacity 0.25s ease",
  display: isRare ? "block" : "none",

  // Shifting rainbow gradient based on --mx and --my
  backgroundImage: `linear-gradient(
    110deg,
    rgba(255, 255, 255, 0) 10%,
    rgba(255, 255, 255, 0.08) 20%,
    rgba(255, 0, 128, 0.22) 35%,
    rgba(0, 255, 255, 0.22) 45%,
    rgba(255, 255, 0, 0.22) 55%,
    rgba(0, 0, 255, 0.12) 65%,
    rgba(255, 255, 255, 0) 80%
  )`,
  backgroundSize: "220% 220%",
  backgroundPosition: `calc(50% + (var(--mx) - 50) * -1.2%) calc(50% + (var(--my) - 50) * -1.2%)`,
}));

// Glare overlay - radial spotlight overlay
export const GlareOverlay = styled("div")({
  position: "absolute",
  inset: 0,
  zIndex: 4,
  mixBlendMode: "overlay",
  opacity: "var(--o, 0)",
  pointerEvents: "none",
  transition: "opacity 0.25s ease",

  // Glare spotlight following mouse coordinates
  background: `radial-gradient(
    circle at calc(var(--mx) * 1%) calc(var(--my) * 1%),
    rgba(255, 255, 255, 0.5) 0%,
    rgba(255, 255, 255, 0) 55%
  )`,
});

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

  // Rare cards get the holographic rainbow effect
  const isRare = [
    "Rare",
    "HoloRare",
    "UltraRare",
    "SecretRare",
    "Promo",
  ].includes(card.rarityTier);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const absoluteX = e.clientX - rect.left;
    const absoluteY = e.clientY - rect.top;

    // Percentages of cursor relative to element dimensions
    const percentX = Math.min(100, Math.max(0, (absoluteX / rect.width) * 100));
    const percentY = Math.min(
      100,
      Math.max(0, (absoluteY / rect.height) * 100),
    );

    // Centered coordinates (-50 to 50)
    const centerX = percentX - 50;
    const centerY = percentY - 50;

    // Max rotation is 15 degrees for 3D tilt
    const maxRotation = 14;
    const rx = (centerY / 50) * -maxRotation; // Tilting on X-axis rotates up/down
    const ry = (centerX / 50) * maxRotation; // Tilting on Y-axis rotates left/right

    setCoords({
      x: percentX,
      y: percentY,
      rx,
      ry,
      o: 1,
      s: 1.03, // Slight scale up on hover
    });
  };

  const handleMouseLeave = () => {
    // Reset to center with ease
    setCoords({
      x: 50,
      y: 50,
      rx: 0,
      ry: 0,
      o: 0,
      s: 1,
    });
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

        {/* Glamour/Rainbow card sheen (Rare only) */}
        <HoloOverlay isRare={isRare} />

        {/* Glossy overlay reflection (All cards) */}
        <GlareOverlay />
      </CardInner>
    </CardContainer>
  );
};
