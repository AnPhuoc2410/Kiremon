import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

// ─────────────────────────────────────────────────────────────────────────────
// Design tokens
// ─────────────────────────────────────────────────────────────────────────────
const FONT_PIXEL = '"Press Start 2P", monospace';
const FONT_BODY = '"VT323", "Outfit", monospace';
const C_INK = "#0f172a";
const C_PAPER = "#fdfdfd";
const C_TEAL = "#0ea5e9";
const C_PURPLE = "#7c3aed";
const BORDER = `3px solid ${C_INK}`;
const SHADOW = `4px 4px 0px ${C_INK}`;

// ─────────────────────────────────────────────────────────────────────────────
// Page shell
// ─────────────────────────────────────────────────────────────────────────────
export const Page = styled("div")({
  maxWidth: "1700px",
  margin: "0 auto",
  padding: "24px 16px 120px",
  display: "flex",
  flexDirection: "column",
  gap: "24px",
  minHeight: "100vh",
  fontFamily: FONT_BODY,
  boxSizing: "border-box",
  color: C_INK,
  "@media (min-width: 1024px)": {
    padding: "24px 32px 120px",
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Stats bar (Market Value, Total Cards, Unique Pokémon)
// ─────────────────────────────────────────────────────────────────────────────
export const StatsBar = styled("div")({
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "12px",
  "@media (min-width: 640px)": {
    gridTemplateColumns: "repeat(4, 1fr)",
  },
});

export const StatCard = styled("div")<{ accent?: string }>(
  ({ accent = C_TEAL }) => ({
    background: C_PAPER,
    border: BORDER,
    boxShadow: `4px 4px 0px ${accent}`,
    padding: "14px 18px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    position: "relative",
    overflow: "hidden",

    // colored left bar
    "&::before": {
      content: '""',
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: "4px",
      background: accent,
    },

    ".stat-label": {
      fontFamily: FONT_PIXEL,
      fontSize: "0.55rem",
      color: "#64748b",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    ".stat-value": {
      fontFamily: FONT_PIXEL,
      fontSize: "1.4rem",
      color: C_INK,
      lineHeight: 1.1,
      "@media (max-width: 639px)": {
        fontSize: "1.1rem",
      },
    },
    ".stat-sub": {
      fontFamily: FONT_BODY,
      fontSize: "0.95rem",
      color: "#475569",
    },
  }),
);

// ─────────────────────────────────────────────────────────────────────────────
// Controls bar
// ─────────────────────────────────────────────────────────────────────────────
export const ControlsBar = styled("div")({
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
  alignItems: "center",
  background: C_PAPER,
  border: BORDER,
  boxShadow: SHADOW,
  padding: "12px 16px",
});

export const SearchBox = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  flex: "1 1 200px",
  border: `2px solid ${C_INK}`,
  padding: "8px 12px",
  background: "#ffffff",

  "&:focus-within": {
    borderColor: C_TEAL,
    boxShadow: `2px 2px 0px ${C_TEAL}`,
  },

  input: {
    background: "transparent",
    border: "none",
    outline: "none",
    fontFamily: FONT_BODY,
    fontSize: "1.15rem",
    color: C_INK,
    width: "100%",
    "&::placeholder": { color: "#94a3b8" },
  },
  svg: { color: "#64748b", flexShrink: 0 },
});

export const FilterSelect = styled("select")({
  fontFamily: FONT_PIXEL,
  fontSize: "0.55rem",
  color: C_INK,
  background: "#ffffff",
  border: `2px solid ${C_INK}`,
  padding: "8px 10px",
  cursor: "pointer",
  outline: "none",
  boxShadow: "2px 2px 0px rgba(0,0,0,0.1)",
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%230f172a' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 8px center",
  paddingRight: "28px",
  "&:focus": {
    borderColor: C_TEAL,
    boxShadow: `2px 2px 0px ${C_TEAL}`,
  },
});

export const PixelBtn = styled("button")<{
  variant?: "yellow" | "default" | "ghost";
}>(({ variant = "default" }) => ({
  fontFamily: FONT_PIXEL,
  fontSize: "0.55rem",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "10px 14px",
  border: BORDER,
  borderRadius: "2px",
  cursor: "pointer",
  textTransform: "uppercase",
  whiteSpace: "nowrap",
  transition: "all 0.12s ease",
  ...(variant === "yellow"
    ? {
        background: "#facc15",

        color: C_INK,
        boxShadow: SHADOW,
        "&:hover": {
          background: "#fde047",
          transform: "translateY(-2px)",
          boxShadow: "5px 5px 0px #0f172a",
        },
        "&:active": {
          transform: "translateY(1px)",
          boxShadow: "1px 1px 0px #0f172a",
        },
      }
    : variant === "ghost"
      ? {
          background: "transparent",
          color: C_INK,
          boxShadow: "none",
          "&:hover": { background: "rgba(0,0,0,0.04)" },
        }
      : {
          background: "#ffffff",
          color: C_INK,
          boxShadow: SHADOW,
          "&:hover": {
            background: "#f1f5f9",
            transform: "translateY(-2px)",
            boxShadow: "4px 4px 0px #0f172a",
          },
          "&:active": {
            transform: "translateY(1px)",
            boxShadow: "1px 1px 0px #0f172a",
          },
        }),
}));

// ─────────────────────────────────────────────────────────────────────────────
// Tab nav
// ─────────────────────────────────────────────────────────────────────────────
export const TabNav = styled("div")({
  display: "flex",
  gap: "0",
  borderBottom: BORDER,
  overflowX: "auto",

  "&::-webkit-scrollbar": { display: "none" },
});

export const Tab = styled("button")<{ active: boolean }>(({ active }) => ({
  fontFamily: FONT_PIXEL,
  fontSize: "0.55rem",
  padding: "12px 20px",
  border: "none",
  borderRight: `2px solid ${C_INK}`,
  borderBottom: active ? `3px solid ${C_PAPER}` : "none",
  background: active ? C_PAPER : "#e2e8f0",
  color: active ? C_INK : "#64748b",
  cursor: "pointer",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  whiteSpace: "nowrap",
  marginBottom: active ? "-3px" : 0,
  transition: "background 0.12s ease, color 0.12s ease",
  display: "flex",
  alignItems: "center",
  gap: "8px",

  "&:hover": {
    background: active ? C_PAPER : "#cbd5e1",
  },

  "&:first-of-type": {
    borderLeft: BORDER,
  },
}));

// ─────────────────────────────────────────────────────────────────────────────
// Card grid
// ─────────────────────────────────────────────────────────────────────────────
export const CardGrid = styled("div")({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
  gap: "16px",

  "@media (min-width: 640px)": {
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
  },
  "@media (min-width: 1280px)": {
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Pagination
// ─────────────────────────────────────────────────────────────────────────────
export const Pager = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "12px",
  paddingTop: "8px",
  fontFamily: FONT_PIXEL,
  fontSize: "0.6rem",
  color: C_INK,
});

// ─────────────────────────────────────────────────────────────────────────────
// Empty / Loading / Placeholder
// ─────────────────────────────────────────────────────────────────────────────
export const EmptyState = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "16px",
  padding: "60px 24px",
  color: "#64748b",
  fontFamily: FONT_PIXEL,
  fontSize: "0.6rem",
  textAlign: "center",
  svg: { opacity: 0.4 },
});

// ─────────────────────────────────────────────────────────────────────────────
// Coming-soon placeholder (Deck Builder, Market Value)
// ─────────────────────────────────────────────────────────────────────────────
export const ComingSoon = styled("div")<{ accent?: string }>(
  ({ accent = C_PURPLE }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "24px",
    minHeight: "380px",
    background: C_PAPER,
    border: BORDER,
    boxShadow: `6px 6px 0px ${accent}`,
    padding: "40px",
    textAlign: "center",
    position: "relative",
    overflow: "hidden",

    // diagonal stripe background
    backgroundImage: `repeating-linear-gradient(
    -45deg,
    transparent,
    transparent 18px,
    rgba(0,0,0,0.022) 18px,
    rgba(0,0,0,0.022) 36px
  )`,

    ".cs-badge": {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      background: accent,
      color: "#ffffff",
      fontFamily: FONT_PIXEL,
      fontSize: "0.55rem",
      padding: "8px 16px",
      border: `2px solid ${C_INK}`,
      boxShadow: SHADOW,
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    ".cs-title": {
      fontFamily: FONT_PIXEL,
      fontSize: "1rem",
      color: C_INK,
      lineHeight: 1.4,
      "@media (max-width: 639px)": { fontSize: "0.75rem" },
    },
    ".cs-desc": {
      fontFamily: FONT_BODY,
      fontSize: "1.15rem",
      color: "#475569",
      maxWidth: "480px",
      lineHeight: 1.6,
    },
  }),
);

// ─────────────────────────────────────────────────────────────────────────────
// Card detail modal / side panel (Removed in favor of ExpandedCardOverlay)
// ─────────────────────────────────────────────────────────────────────────────

const shimmer = keyframes`
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
`;

// Skeleton loader card
export const SkeletonCard = styled("div")({
  background: "#e2e8f0",
  border: "2px solid #cbd5e1",
  borderRadius: "4px",
  overflow: "hidden",
  aspectRatio: "0.7",
  backgroundImage:
    "linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)",
  backgroundSize: "200% 100%",
  animation: `${shimmer} 1.5s infinite linear`,
});
