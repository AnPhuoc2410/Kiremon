import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

const glitch = keyframes`
  0%   { clip-path: inset(40% 0 60% 0); transform: translate(-2px,  0); }
  25%  { clip-path: inset(10% 0 85% 0); transform: translate( 2px,  0); }
  50%  { clip-path: inset(70% 0 20% 0); transform: translate(-2px,  0); }
  75%  { clip-path: inset(55% 0 40% 0); transform: translate( 2px,  0); }
  100% { clip-path: inset(40% 0 60% 0); transform: translate(-2px,  0); }
`;

export const HeaderRoot = styled("header")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "#fdfdfd",
  padding: "16px 24px",
  boxShadow: "4px 4px 0px #0f172a",
  border: "3px solid #0f172a",
  gap: "16px",

  "@media (max-width: 1023px)": {
    padding: "12px 16px",
    gap: "12px",
  },
});

// Wraps the title zone; perspective needed for 3-D flip
export const TitleWrap = styled("div")({
  perspective: "600px",
  transformStyle: "preserve-3d",
  minWidth: 0,
  flex: 1,
});

// The actual h1 — we'll GSAP-animate rotateX on this
export const TitleText = styled("h1")({
  margin: 0,
  fontSize: "2.8rem",
  textTransform: "uppercase",
  letterSpacing: "1px",
  fontFamily: '"VT323", "Outfit", "Inter", sans-serif',
  fontWeight: 900,
  color: "#0f172a",
  lineHeight: 1,
  backfaceVisibility: "hidden",
  transformOrigin: "center center",
  whiteSpace: "nowrap",

  // Yellow outline effect matching S.StorageHeader h1
  WebkitTextStroke: "2px #0f172a",
  paintOrder: "stroke fill",

  "@media (max-width: 1023px)": {
    fontSize: "2rem",
  },
  "@media (max-width: 639px)": {
    fontSize: "1.35rem",
    whiteSpace: "normal",
  },
});

export const RightSection = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "14px",
  flexShrink: 0,
});

// ── Switch pill ──────────────────────────────────────────────────────────────

export const SwitchWrapper = styled("button")<{ isTcg: boolean }>(
  ({ isTcg }) => ({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "8px 14px",
    border: "3px solid #0f172a",
    borderRadius: "3px",
    background: isTcg ? "#0f172a" : "#ffffff",
    color: isTcg ? "#facc15" : "#0f172a",
    boxShadow: isTcg ? "4px 4px 0px #facc15" : "3px 3px 0px #0f172a",
    cursor: "pointer",
    fontFamily: '"Press Start 2P", monospace',
    fontSize: "0.6rem",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    whiteSpace: "nowrap",
    transition: "background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease",
    userSelect: "none",
    position: "relative",
    overflow: "hidden",

    // glitch pseudo-layer — visible only during animation class
    "&.flipping::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      background: "inherit",
      animation: `${glitch} 0.3s steps(1) 1`,
      zIndex: 2,
      opacity: 0.6,
    },

    "&:hover": {
      background: isTcg ? "#1e293b" : "#fef08a",
      transform: "translateY(-2px)",
      boxShadow: isTcg ? "5px 5px 0px #facc15" : "4px 4px 0px #0f172a",
    },
    "&:active": {
      transform: "translateY(1px) translateX(1px)",
      boxShadow: isTcg ? "1px 1px 0px #facc15" : "1px 1px 0px #0f172a",
    },

    "@media (max-width: 639px)": {
      padding: "8px 10px",
      fontSize: "0.5rem",
      gap: "6px",
    },
  }),
);

// The small toggle knob inside the switch button
export const SwitchTrack = styled("span")<{ isTcg: boolean }>(({ isTcg }) => ({
  display: "inline-flex",
  width: "36px",
  height: "18px",
  borderRadius: "9px",
  border: `2px solid ${isTcg ? "#facc15" : "#0f172a"}`,
  background: isTcg ? "#facc15" : "#e2e8f0",
  position: "relative",
  transition: "background 0.2s ease, border-color 0.2s ease",
  flexShrink: 0,

  "&::after": {
    content: '""',
    display: "block",
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: isTcg ? "#0f172a" : "#94a3b8",
    position: "absolute",
    top: "2px",
    left: isTcg ? "20px" : "2px",
    transition: "left 0.18s cubic-bezier(0.4, 0, 0.2, 1)",
  },
}));

// Generic pixel button (Help, Boxes, etc.)
export const PixelBtn = styled("button")({
  background: "#ffffff",
  color: "#0f172a",
  fontFamily: '"Press Start 2P", monospace',
  fontSize: "0.65rem",
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  padding: "10px 16px",
  minHeight: "44px",
  border: "3px solid #0f172a",
  boxShadow: "3px 3px 0px #0f172a",
  borderRadius: "2px",
  transition: "all 0.12s cubic-bezier(0.4, 0, 0.2, 1)",
  cursor: "pointer",
  textTransform: "uppercase",
  whiteSpace: "nowrap",

  "&:hover": {
    background: "#facc15",
    transform: "translateY(-2px)",
    boxShadow: "4px 4px 0px #0f172a",
  },
  "&:active": {
    transform: "translateY(1px) translateX(1px)",
    boxShadow: "1px 1px 0px #0f172a",
  },
  svg: {
    color: "#475569",
    transition: "transform 0.2s ease, color 0.2s ease",
  },
  "&:hover svg": {
    transform: "scale(1.1)",
    color: "#0f172a",
  },

  "@media (max-width: 1023px)": {
    background: "none",
    border: "none",
    boxShadow: "none",
    padding: 0,
    minHeight: "auto",
    transform: "none !important",
    "&:hover": {
      background: "none",
      transform: "none",
      boxShadow: "none",
    },
    ".btn-text": {
      display: "none",
    },
    svg: {
      width: "24px",
      height: "24px",
      color: "#0f172a",
    },
    "&:hover svg": {
      transform: "scale(1.15)",
      color: "#facc15",
    },
  },
});
