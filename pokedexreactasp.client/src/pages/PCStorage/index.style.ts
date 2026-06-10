import styled from "@emotion/styled";

export const Page = styled("div")({
  maxWidth: "1600px",
  margin: "0 auto",
  padding: "24px 16px 96px",
  display: "flex",
  flexDirection: "column",
  gap: "24px",
  color: "#1e293b",
  minHeight: "100vh",
  fontFamily: '"VT323", "Outfit", "Inter", sans-serif',
  boxSizing: "border-box",
  "@media (min-width: 1024px)": {
    padding: "24px 32px 96px",
  },
});

export const StorageHeader = styled("header")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "#fdfdfd",
  padding: "16px 24px",
  boxShadow: "4px 4px 0px #0f172a",
  ".title-section": {
    h1: {
      margin: 0,
      fontSize: "2.8rem",
      textTransform: "uppercase",
      letterSpacing: "1px",
      "@media (max-width: 1023px)": {
        fontSize: "2rem",
      },
      "@media (max-width: 639px)": {
        fontSize: "1.4rem",
      },
    },
    p: {
      margin: "6px 0 0",
      fontSize: "1rem",
      fontFamily: '"VT323", monospace',
      color: "#334155",
      letterSpacing: "0.02em",
    },
  },
  "@media (max-width: 1023px)": {
    padding: "12px 16px",
    gap: "12px",
  },
});

export const HeaderActions = styled("div")({
  display: "flex",
  gap: "12px",
  alignItems: "center",
  justifyContent: "flex-end",
  "@media (max-width: 1023px)": {
    gap: "16px",
  },
});

export const KeyboardInfoBtn = styled("button")({
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
  position: "relative",
  
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

  // On medium and small screens: No button border/background, keep only raw icons on the same row!
  "@media (max-width: 1023px)": {
    background: "none",
    border: "none",
    boxShadow: "none",
    padding: 0,
    minHeight: "auto",
    minWidth: "auto",
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

export const Workspace = styled("div")({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "24px",
  alignItems: "start",
  "@media (min-width: 1024px)": {
    gridTemplateColumns: "240px 1fr 320px",
  },
});

/* ================== Party Sidebar ================== */
export const SidebarCard = styled("div")({
  background: "#fdfdfd",
  padding: "16px",
  boxShadow: "4px 4px 0px #0f172a",
  "@media (max-width: 1023px)": {
    padding: "10px 12px",
  },
  h2: {
    margin: "0 0 12px",
    fontSize: "1.1rem",
    fontFamily: '"Press Start 2P", monospace',
    textTransform: "uppercase",
    color: "#0f172a",
    paddingBottom: "8px",
    borderBottom: "3px double #0f172a",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    "@media (max-width: 1023px)": {
      fontSize: "0.8rem",
      margin: "0 0 8px",
      paddingBottom: "4px",
    },
  },
});

export const PartySlotsContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  "@media (max-width: 1023px)": {
    display: "grid",
    gridTemplateColumns: "repeat(6, 1fr)",
    gap: "6px",
  },
});

export const PartySlot = styled("div")<{
  isEmpty: boolean;
  isDraggingOver: boolean;
  isSelected?: boolean;
  isMultiSelected?: boolean;
}>(({ isEmpty, isDraggingOver, isSelected, isMultiSelected }) => ({
  height: "72px",
  border: isMultiSelected
    ? "3px solid #0f172a"
    : isSelected
      ? "3px solid #0f172a"
      : isDraggingOver
        ? "2.5px dashed #3b82f6"
        : "2px solid rgba(15, 23, 42, 0.08)",
  background: isMultiSelected
    ? "rgba(254, 240, 138, 0.85)"
    : isSelected
      ? "#eff6ff"
      : isDraggingOver
        ? "rgba(59, 130, 246, 0.03)"
        : isEmpty
          ? "rgba(15, 23, 42, 0.01)"
          : "#ffffff",
  // Removed background Pokéball watermarks
  boxShadow: isMultiSelected
    ? "3px 3px 0px #ef4444"
    : isSelected
      ? "3px 3px 0px #0f172a"
      : "none",
  display: "flex",
  alignItems: "center",
  padding: "8px 12px",
  gap: "10px",
  transition: "all 0.18s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  cursor: isEmpty ? "default" : "grab",
  "&:active": {
    cursor: isEmpty ? "default" : "grabbing",
  },
  "&:hover": {
    transform: isEmpty ? "none" : "translateY(-2px)",
    background: isEmpty
      ? "rgba(15, 23, 42, 0.03)"
      : isSelected
        ? "#eff6ff"
        : isMultiSelected
          ? "#fef08a"
          : "#f8fafc",
    borderColor: isEmpty ? "rgba(15, 23, 42, 0.08)" : "#0f172a",
    boxShadow: isEmpty
      ? "none"
      : isSelected
        ? "3px 5px 0px #0f172a"
        : isMultiSelected
          ? "3px 5px 0px #ef4444"
          : "3px 3px 0px rgba(15, 23, 42, 0.15)",
  },
  ".index-tag": {
    position: "absolute",
    top: "3px",
    left: "5px",
    fontSize: "7px",
    fontFamily: '"Press Start 2P", monospace',
    color: "#64748b",
    "&::before": {
      content: '"SLOT "',
    },
    "@media (max-width: 1023px)": {
      content: '""',
    },
  },
  ".sprite": {
    width: "48px",
    height: "48px",
    objectFit: "contain",
    imageRendering: "pixelated",
  },
  ".details": {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minWidth: 0,
    ".name": {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: "0.7rem",
      color: "#0f172a",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    ".lvl": {
      fontFamily: '"VT323", monospace',
      fontSize: "1rem",
      color: "#334155",
    },
  },
  ".shiny-sparkle": {
    color: "#facc15",
    fontSize: "12px",
  },
  ".held-item-icon": {
    width: "16px",
    height: "16px",
    objectFit: "contain",
  },
  "@media (max-width: 1023px)": {
    height: "auto",
    aspectRatio: "1",
    flexDirection: "column",
    justifyContent: "center",
    padding: "4px",
    gap: "0px",
    ".details": {
      display: "none",
    },
    ".sprite": {
      width: "48px",
      height: "48px",
    },
    ".shiny-sparkle": {
      position: "absolute",
      bottom: "3px",
      right: "3px",
      fontSize: "10px",
    },
    ".held-item-icon": {
      position: "absolute",
      bottom: "3px",
      left: "3px",
      width: "12px",
      height: "12px",
    },
    ".index-tag": {
      top: "2px",
      left: "3px",
      fontSize: "6px",
      "&::before": {
        content: '""',
      },
    },
  },
}));


/* ================== Box Area ================== */
export const BoxWrapper = styled("div")({
  display: "flex",
  flexDirection: "column",
  background: "#fdfdfd",
  padding: "0 !important",
  overflow: "hidden",
  borderRadius: "8px",
  boxShadow: "4px 4px 0px #0f172a",
});

export const BoxControls = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#fdfdfd",
  borderBottom: "3px solid #0f172a",
  padding: "8px 16px",
  boxSizing: "border-box",
  width: "100%",
  position: "relative",
  minHeight: "56px",

  // Centered navigation group
  ".navigation-group": {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    zIndex: 1,
  },

  // Standalone triangular arrow buttons (borderless)
  ".nav-arrow-btn": {
    background: "none",
    border: "none",
    padding: 0,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    outline: "none",
    transition: "transform 0.1s ease",
    "&:hover": {
      transform: "scale(1.15)",
    },
    polygon: {
      fill: "#e2e8f0",
      transition: "fill 0.15s ease",
    },
    "&:hover polygon": {
      fill: "#facc15",
    },
    "&:active": {
      transform: "scale(0.9)",
    },
    svg: {
      display: "block",
    },
  },

  // Yellow name plate (rectangular)
  ".name-plate": {
    background: "linear-gradient(180deg, #fffbeb 0%, #fef08a 100%)",
    border: "2.5px solid #0f172a",
    borderRadius: "2px",
    boxShadow: "inset 0px 0px 0px 2.5px #ffffff, 2px 2px 0px #0f172a",
    padding: "6px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "160px",
    height: "36px",
    cursor: "pointer",
    transition: "all 0.15s ease",
    boxSizing: "border-box",
    "&:hover": {
      background: "linear-gradient(180deg, #fffbeb 0%, #fde047 100%)",
      transform: "translateY(-1px)",
    },
    h3: {
      margin: 0,
      fontFamily: '"Press Start 2P", monospace',
      fontSize: "0.85rem",
      fontWeight: "bold",
      color: "#0f172a",
      textTransform: "uppercase",
      letterSpacing: "1px",
      textAlign: "center",
      textShadow: "1px 1px 0px #ffffff",
    },
    "@media (max-width: 639px)": {
      minWidth: "120px",
      padding: "4px 12px",
      h3: {
        fontSize: "0.75rem",
        letterSpacing: "0.5px",
      },
    },
  },

  // Count badge on the far right
  ".box-count-badge": {
    position: "absolute",
    right: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "#ffffff",
    color: "#0f172a",
    fontFamily: '"Press Start 2P", monospace',
    fontSize: "0.65rem",
    padding: "6px 12px",
    borderRadius: "2px",
    border: "2px solid #0f172a",
    boxShadow: "2px 2px 0px #0f172a",
    fontWeight: "bold",
    whiteSpace: "nowrap",
    zIndex: 1,
    "@media (max-width: 639px)": {
      display: "none",
    },
  },
});

export const BoxRenameInput = styled("input")({
  fontFamily: '"Press Start 2P", monospace',
  fontSize: "0.85rem",
  fontWeight: "bold",
  color: "#0f172a",
  background: "transparent",
  border: "none",
  textAlign: "center",
  width: "100%",
  padding: "0",
  outline: "none",
  textTransform: "uppercase",
  boxSizing: "border-box",
  display: "inline-block",
  height: "24px",
  lineHeight: "24px",
  "@media (max-width: 639px)": {
    fontSize: "0.75rem",
  },
});

export const BoxGridContainer = styled("div")<{ bgUrl?: string }>(({ bgUrl }) => ({
  aspectRatio: "1.2",
  borderRadius: "0px",
  backgroundImage: bgUrl ? `url(${bgUrl})` : "none",
  backgroundSize: "cover",
  backgroundPosition: "center",
  boxShadow: "inset 0 0 50px rgba(0,0,0,0.15)",
  padding: "20px",
  position: "relative",
  overflow: "hidden",
  display: "grid",
  gridTemplateColumns: "repeat(6, 1fr)",
  gridTemplateRows: "repeat(5, 1fr)",
  gap: "12px",
}));

export const BoxSlotCell = styled("div")<{
  isEmpty: boolean;
  isDraggingOver: boolean;
  isDimmed?: boolean;
  isHighlighted?: boolean;
  isShiny?: boolean;
  isCompareSelected?: boolean;
  isSelected?: boolean;
}>(({ isEmpty, isDraggingOver, isDimmed, isHighlighted, isShiny, isCompareSelected, isSelected }) => ({
  borderRadius: "8px",
  border: isCompareSelected
    ? "2.5px solid #7c3aed"
    : isSelected
      ? "2.5px solid #0f172a"
      : isDraggingOver
        ? "2px dashed #0f172a"
        : isHighlighted
          ? "2.5px solid #0f172a"
          : "1px solid rgba(148, 163, 184, 0.15)",
  background: isCompareSelected
    ? "rgba(124, 58, 237, 0.08)"
    : isSelected
      ? "#eff6ff"
      : isDraggingOver
        ? "rgba(15, 23, 42, 0.03)"
        : isHighlighted
          ? "rgba(254, 240, 138, 0.85)"
          : isEmpty
            ? "rgba(255, 255, 255, 0.35)"
            : "rgba(255, 255, 255, 0.85)",
  // Removed background Pokéball watermarks
  backdropFilter: "blur(4px)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "4px",
  position: "relative",
  cursor: isEmpty ? "default" : "grab",
  opacity: isDimmed ? 0.3 : 1,
  boxShadow: isCompareSelected
    ? "2.5px 2.5px 0px #7c3aed"
    : isSelected
      ? "none"
      : isHighlighted
        ? "2.5px 2.5px 0px #ef4444"
        : isShiny && !isEmpty
          ? "inset 0 0 6px rgba(251, 191, 36, 0.2)"
          : "none",
  transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:active": {
    cursor: isEmpty ? "default" : "grabbing",
  },
  "&:hover": {
    transform: isEmpty ? "none" : "scale(1.05) translateY(-2px)",
    background: isEmpty
      ? "rgba(255, 255, 255, 0.55)"
      : isSelected
        ? "#eff6ff"
        : isHighlighted
          ? "#fef08a"
          : "#ffffff",
    borderColor: isEmpty ? "rgba(148, 163, 184, 0.15)" : "#0f172a",
    boxShadow: isEmpty
      ? "none"
      : isSelected
        ? "none"
        : isHighlighted
          ? "2.5px 4.5px 0px #ef4444"
          : "2px 4px 0px rgba(15, 23, 42, 0.15)",
    zIndex: 10,
  },
  ".sprite": {
    width: "95%",
    height: "95%",
    maxHeight: "68px",
    objectFit: "contain",
    imageRendering: "pixelated",
    filter: isDimmed ? "grayscale(80%)" : "none",
  },
  ".mini-info": {
    position: "absolute",
    bottom: "2px",
    left: "2px",
    right: "2px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "7px",
    fontFamily: '"Press Start 2P", monospace',
    color: "#0f172a",
    "@media (max-width: 639px)": {
      display: "none",
    },
  },
  ".markings-dots": {
    position: "absolute",
    top: "2px",
    right: "2px",
    display: "flex",
    gap: "1px",
    fontSize: "7px",
    color: "#2563eb",
  },
  // Badge when ctrl-selected for compare
  ".compare-badge": {
    position: "absolute",
    top: "2px",
    left: "2px",
    fontSize: "7px",
    fontFamily: '"Press Start 2P", monospace',
    color: "#7c3aed",
    lineHeight: 1,
    textShadow: "0 0 3px rgba(255,255,255,0.9)",
  },
}));

/* ================== Right Panel ================== */
export const RightPanelCard = styled("div")({
  background: "#fdfdfd",
  padding: "20px",
  boxShadow: "4px 4px 0px #0f172a",
  display: "flex",
  flexDirection: "column",
  gap: "20px",

  ".detail-column": {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    width: "100%",
  },

  ".wallpaper-column": {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    width: "100%",
  },

  h2: {
    margin: 0,
    fontFamily: '"Press Start 2P", monospace',
    fontSize: "0.9rem",
    color: "#0f172a",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  // Tablet: Two columns side-by-side
  "@media (min-width: 640px) and (max-width: 1023px)": {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr",
    gap: "24px",
    alignItems: "start",
    ".detail-column": {
      width: "100%",
    },
    ".wallpaper-column": {
      width: "100%",
    },
  },

  // Desktop/Sidebar: Stacked vertically
  "@media (min-width: 1024px)": {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
});

export const SearchBoxWrapper = styled("div")({
  display: "flex",
  background: "#ffffff",
  border: "2px solid #0f172a",
  padding: "8px 12px",
  alignItems: "center",
  gap: "8px",
  transition: "all 0.12s ease",
  "&:focus-within": {
    borderColor: "#2563eb",
    boxShadow: "2px 2px 0px #2563eb",
  },
  input: {
    background: "transparent",
    border: "none",
    color: "#0f172a",
    outline: "none",
    width: "100%",
    fontFamily: '"VT323", monospace',
    fontSize: "1.2rem",
    "&::placeholder": {
      color: "#94a3b8",
    },
  },
});

// Removed unused ModeSelectors, ModeButton, SectionTitle

/* ================== Wallpaper Selector ================== */
export const WallpaperSelectorWrapper = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
});

export const WallpaperGrid = styled("div")({
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "8px",
  maxHeight: "150px",
  overflowY: "auto",
  paddingRight: "4px",
  "@media (max-width: 639px)": {
    gridTemplateColumns: "repeat(6, 1fr)",
  },
  "&::-webkit-scrollbar": {
    width: "4px",
  },
  "&::-webkit-scrollbar-track": {
    background: "rgba(0,0,0,0.05)",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "rgba(0,0,0,0.1)",
    borderRadius: "2px",
  },
});

export const WallpaperItem = styled("button")<{
  selected: boolean;
  bgUrl?: string;
}>(({ selected, bgUrl }) => ({
  aspectRatio: "1.5",
  borderRadius: "6px",
  backgroundImage: bgUrl ? `url(${bgUrl})` : "none",
  backgroundSize: "cover",
  backgroundPosition: "center",
  border: selected ? "2px solid #3b82f6" : "1px solid rgba(148, 163, 184, 0.2)",
  cursor: "pointer",
  outline: "none",
  transition: "all 0.15s ease",
  boxShadow: selected ? "0 0 8px rgba(59, 130, 246, 0.4)" : "none",
  "&:hover": {
    transform: "scale(1.05)",
    borderColor: selected ? "#3b82f6" : "rgba(15, 23, 42, 0.25)",
  },
}));

export const UploadWallpaperZone = styled("div")<{ isDragging: boolean }>(({ isDragging }) => ({
  border: isDragging ? "2px dashed #3b82f6" : "1px dashed rgba(148, 163, 184, 0.4)",
  background: isDragging ? "rgba(59, 130, 246, 0.05)" : "rgba(255, 255, 255, 0.4)",
  borderRadius: "8px",
  padding: "12px",
  textAlign: "center",
  cursor: "pointer",
  transition: "all 0.15s ease",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "6px",
  "&:hover": {
    background: "rgba(255, 255, 255, 0.7)",
    borderColor: "rgba(148, 163, 184, 0.6)",
  },
  svg: {
    color: "#64748b",
  },
  span: {
    fontSize: "0.95rem",
    color: "#334155",
    fontWeight: "bold",
  },
  p: {
    margin: 0,
    fontSize: "0.8rem",
    color: "#64748b",
  },
}));

/* ================== floating cursor preview ================== */
export const FloatingHeldPokemon = styled("div")<{ x: number; y: number }>(({ x, y }) => ({
  position: "fixed",
  top: y,
  left: x,
  pointerEvents: "none",
  zIndex: 9999,
  transform: "translate(-50%, -50%) scale(1.15)",
  filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.35))",
  img: {
    width: "64px",
    height: "64px",
    objectFit: "contain",
    opacity: 0.9,
  },
}));

export const FloatingGroupPreview = styled("div")<{ x: number; y: number }>(({ x, y }) => ({
  position: "fixed",
  top: y,
  left: x,
  pointerEvents: "none",
  zIndex: 9999,
  transform: "translate(-50%, -50%)",
  background: "rgba(255, 255, 255, 0.8)",
  border: "2px dashed #fbbf24",
  borderRadius: "12px",
  padding: "10px",
  display: "grid",
  gridTemplateColumns: "repeat(3, 48px)",
  gap: "6px",
  boxShadow: "0 8px 30px rgba(15, 23, 42, 0.15)",
  img: {
    width: "36px",
    height: "36px",
    objectFit: "contain",
  },
}));

export const SelectionRectangle = styled("div")<{
  startX: number;
  startY: number;
  width: number;
  height: number;
}>(({ startX, startY, width, height }) => ({
  position: "absolute",
  top: startY,
  left: startX,
  width: width,
  height: height,
  border: "2px dashed #0f172a",
  backgroundColor: "rgba(59, 130, 246, 0.03)",
  backgroundImage: `
    linear-gradient(to right, rgba(59, 130, 246, 0.08) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(59, 130, 246, 0.08) 1px, transparent 1px),
    linear-gradient(to right, #ef4444 8px, transparent 8px),
    linear-gradient(to right, #ef4444 8px, transparent 8px),
    linear-gradient(to left, #ef4444 8px, transparent 8px),
    linear-gradient(to left, #ef4444 8px, transparent 8px),
    linear-gradient(to bottom, #ef4444 8px, transparent 8px),
    linear-gradient(to bottom, #ef4444 8px, transparent 8px),
    linear-gradient(to top, #ef4444 8px, transparent 8px),
    linear-gradient(to top, #ef4444 8px, transparent 8px)
  `,
  backgroundPosition: "0 0, 0 0, 0 0, 0 100%, 100% 0, 100% 100%, 0 0, 100% 0, 0 100%, 100% 100%",
  backgroundRepeat: "repeat, repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat",
  backgroundSize: "12px 12px, 12px 12px, 8px 2px, 8px 2px, 8px 2px, 8px 2px, 2px 8px, 2px 8px, 2px 8px, 2px 8px",
  pointerEvents: "none",
  zIndex: 100,
  boxShadow: "inset 0 0 12px rgba(59, 130, 246, 0.2), 0 4px 20px rgba(0, 0, 0, 0.15)",
  borderRadius: "4px",
  animation: "marqueePulse 2s infinite linear",
  "@keyframes marqueePulse": {
    "0%": {
      borderColor: "#0f172a",
    },
    "50%": {
      borderColor: "#ef4444",
    },
    "100%": {
      borderColor: "#0f172a",
    },
  },
}));


/* ================== Context Menu ================== */
export const ContextMenu = styled("div")<{ x: number; y: number }>(({ x, y }) => ({
  position: "fixed",
  top: y,
  left: x,
  background: "#fdfdfd",
  border: "2px solid #0f172a",
  padding: "4px",
  boxShadow: "4px 4px 0px #0f172a",
  zIndex: 1000,
  display: "flex",
  flexDirection: "column",
  gap: "2px",
  minWidth: "170px",
}));

export const ContextMenuItem = styled("button")({
  background: "transparent",
  border: "none",
  color: "#0f172a",
  padding: "8px 12px",
  textAlign: "left",
  fontFamily: '"Press Start 2P", monospace',
  fontSize: "0.6rem",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  transition: "all 0.12s ease",
  textTransform: "uppercase",
  "&:hover": {
    background: "#facc15",
    color: "#0f172a",
  },
  "&.danger": {
    "&:hover": {
      background: "#ef4444",
      color: "#ffffff",
    },
  },
});

/* ================== Compare Modal/Overlay ================== */
export const CompareOverlay = styled("div")({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(15, 23, 42, 0.4)",
  backdropFilter: "blur(8px)",
  zIndex: 2000,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "24px",
});

export const CompareContainer = styled("div")({
  background: "rgba(253, 253, 253, 0.96)",
  border: "1px solid rgba(148, 163, 184, 0.2)",
  borderRadius: "24px",
  width: "100%",
  maxWidth: "1000px",
  padding: "24px",
  boxShadow: "0 24px 60px rgba(15, 23, 42, 0.15)",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  ".compare-header": {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "2px solid rgba(15, 23, 42, 0.1)",
    paddingBottom: "12px",
    h2: {
      margin: 0,
      fontSize: "1.8rem",
      fontWeight: "bold",
      color: "#0f172a",
      textTransform: "uppercase",
    },
    button: {
      background: "rgba(15, 23, 42, 0.05)",
      border: "1px solid rgba(148, 163, 184, 0.2)",
      color: "#334155",
      fontWeight: "bold",
      padding: "8px 16px",
      borderRadius: "999px",
      cursor: "pointer",
      transition: "all 0.15s ease",
      "&:hover": {
        background: "rgba(15, 23, 42, 0.1)",
        color: "#0f172a",
      },
    },
  },
  ".compare-grids": {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "32px",
  },
});

export const CompareCard = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  background: "rgba(255, 255, 255, 0.75)",
  borderRadius: "16px",
  padding: "20px",
  border: "1px solid rgba(148, 163, 184, 0.18)",
  ".sprite": {
    width: "120px",
    height: "120px",
    objectFit: "contain",
  },
  ".name": {
    fontSize: "1.4rem",
    fontWeight: 700,
    marginTop: "12px",
    color: "#0f172a",
    textTransform: "uppercase",
  },
  ".details": {
    width: "100%",
    marginTop: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    ".detail-row": {
      display: "flex",
      justifyContent: "space-between",
      fontSize: "1.1rem",
      borderBottom: "1px solid rgba(15, 23, 42, 0.04)",
      paddingBottom: "6px",
      ".label": { color: "#475569" },
      ".val": { fontWeight: 600, color: "#0f172a" },
    },
  },
});

export const StatCompareRow = styled("div")({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  ".stat-label": {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "1rem",
    color: "#334155",
    fontWeight: "bold",
  },
  ".bar-container": {
    height: "12px",
    background: "rgba(15, 23, 42, 0.05)",
    borderRadius: "6px",
    overflow: "hidden",
    position: "relative",
  },
});

export const StatCompareBar = styled("div")<{ percent: number; isWinner: boolean }>(
  ({ percent, isWinner }) => ({
    height: "100%",
    width: `${percent}%`,
    background: isWinner
      ? "linear-gradient(90deg, #10b981 0%, #059669 100%)"
      : "linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)",
    borderRadius: "6px",
    boxShadow: isWinner ? "0 0 8px rgba(16, 185, 129, 0.3)" : "none",
  })
);

/* ================== Modal Box List ================== */
export const BoxListModalOverlay = styled("div")({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(15, 23, 42, 0.55)",
  backdropFilter: "blur(3px)",
  zIndex: 1500,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
  animation: "fadeInOverlay 0.15s ease",
  "@keyframes fadeInOverlay": {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
});

export const BoxListModalContainer = styled("div")({
  background: "#fdfdfd",
  width: "100%",
  maxWidth: "1100px",
  height: "700px",
  maxHeight: "90vh",
  padding: "0",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  animation: "slideUpModal 0.18s cubic-bezier(0.4, 0, 0.2, 1)",
  "@keyframes slideUpModal": {
    from: { transform: "translateY(12px)", opacity: 0 },
    to: { transform: "translateY(0)", opacity: 1 },
  },
  ".modal-header": {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#facc15",
    borderBottom: "4px double #0f172a",
    padding: "14px 20px",
    flexShrink: 0,
    h3: {
      margin: 0,
      fontFamily: '"Press Start 2P", monospace',
      fontSize: "1rem",
      color: "#0f172a",
      textTransform: "uppercase",
      letterSpacing: "1px",
    },
    ".header-meta": {
      display: "flex",
      alignItems: "center",
      gap: "16px",
    },
  },
  ".grid-container": {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: "14px",
    overflowY: "auto",
    padding: "20px",
    flex: 1,
    "&::-webkit-scrollbar": {
      width: "6px",
    },
    "&::-webkit-scrollbar-track": {
      background: "rgba(0,0,0,0.04)",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "rgba(0,0,0,0.15)",
      borderRadius: "0",
    },
  },
});

export const BoxThumbnailItem = styled("div")<{
  isActive: boolean;
  bgUrl?: string;
  isDragging?: boolean;
  pokemonCount?: number;
}>(({ isActive, bgUrl, isDragging }) => ({
  height: "85px",
  display: "flex",
  flexDirection: "column",
  cursor: "pointer",
  position: "relative",
  opacity: isDragging ? 0.4 : 1,
  overflow: "hidden",
  backgroundImage: bgUrl
    ? `url(${bgUrl})`
    : "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)",
  backgroundSize: "cover",
  backgroundPosition: "center",
  border: isActive
    ? "2.5px solid #facc15"
    : "2px solid #0f172a",
  borderRadius: "5px",
  transition: "all 0.12s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    borderColor: isActive ? "#facc15" : "#475569",
    boxShadow: "3px 3px 0px #0f172a",
  },
  "&:active": {
    transform: "scale(0.98)",
  },
  ".box-details": {
    position: "absolute",
    bottom: "4px",
    left: "4px",
    right: "4px",
    height: "22px",
    background: isActive ? "#facc15" : "#ffffff",
    border: "1.5px solid #0f172a",
    borderRadius: "3px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 6px",
    gap: "4px",
    minWidth: 0,
    ".box-name": {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: "0.65rem",
      color: "#0f172a", // Keep black text for high contrast on white/yellow bg
      textTransform: "uppercase",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      lineHeight: 1,
      flex: 1,
    },
    ".box-count": {
      fontFamily: '"VT323", monospace',
      fontSize: "0.95rem",
      color: "#334155",
      fontWeight: "bold",
      flexShrink: 0,
      lineHeight: 1,
    },
  },
}));

export const BoxFilterTabsContainer = styled("div")({
  display: "flex",
  gap: "10px",
  padding: "16px 20px 6px",
  background: "#fdfdfd",
  flexShrink: 0,
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: "-16px",
    left: 0,
    right: 0,
    height: "16px",
    background: "linear-gradient(to bottom, #fdfdfd, rgba(253, 253, 253, 0))",
    pointerEvents: "none",
    zIndex: 10,
  },
});

export const FilterTabButton = styled("button")<{ isActive: boolean }>(({ isActive }) => ({
  background: isActive ? "#0f172a" : "#fdfdfd",
  color: isActive ? "#facc15" : "#0f172a",
  fontFamily: '"Press Start 2P", monospace',
  fontSize: "0.6rem",
  fontWeight: "bold",
  padding: "6px 12px",
  border: "2px solid #0f172a",
  cursor: "pointer",
  textTransform: "uppercase",
  boxShadow: isActive ? "none" : "2px 2px 0px #0f172a",
  transform: isActive ? "translate(2px, 2px)" : "none",
  transition: "all 0.1s ease",
  "&:hover": {
    background: isActive ? "#0f172a" : "#f1f5f9",
  },
  "&:active": {
    transform: "translate(2px, 2px)",
    boxShadow: "none",
  },
}));

/* ================== Shortcuts Info Help Overlay ================== */
export const HelpOverlay = styled("div")({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(15, 23, 42, 0.35)",
  zIndex: 2500,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
  backdropFilter: "blur(4px)",
});

export const HelpContainer = styled("div")({
  background: "#fdfdfd",
  width: "100%",
  maxWidth: "550px",
  padding: "24px",
  boxShadow: "6px 6px 0px #0f172a",
  h3: {
    margin: "0 0 16px",
    fontSize: "1.8rem",
    textTransform: "uppercase",
    borderBottom: "4px double #0f172a",
    paddingBottom: "8px",
  },
  ".shortcuts-grid": {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    ".shortcut-row": {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid rgba(15,23,42,0.08)",
      paddingBottom: "6px",
      ".key": {
        background: "#fdfdfd",
        border: "1.5px solid #0f172a",
        padding: "2px 8px",
        fontFamily: '"Press Start 2P", monospace',
        fontSize: "0.6rem",
        color: "#0f172a",
        fontWeight: "bold",
        boxShadow: "1.5px 1.5px 0px #0f172a",
        borderRadius: "2px",
      },
      ".desc": {
        fontFamily: '"VT323", monospace',
        fontSize: "1.1rem",
        color: "#0f172a",
        fontWeight: "bold",
      },
    },
  },
});

/* ================== Extra Buttons ================== */
export const CompareButton = styled("button")({
  width: "100%",
  padding: "10px 16px",
  background: "#7c3aed",
  color: "#ffffff",
  fontFamily: '"Press Start 2P", monospace',
  fontSize: "0.65rem",
  fontWeight: "bold",
  cursor: "pointer",
  textTransform: "uppercase",
  transition: "all 0.12s ease",
  boxShadow: "3px 3px 0px #4c1d95",
  "&:hover": {
    background: "#6d28d9",
  },
  "&:active": {
    transform: "translateY(2px) translateX(2px)",
    boxShadow: "1px 1px 0px #4c1d95",
  },
});

export const CloseBtn = styled("button")({
  background: "#fdfdfd",
  color: "#0f172a",
  fontFamily: '"Press Start 2P", monospace',
  fontWeight: "bold",
  padding: "8px 16px",
  fontSize: "0.65rem",
  cursor: "pointer",
  textTransform: "uppercase",
  transition: "all 0.12s ease",
  "&:hover": {
    background: "#ef4444",
    color: "#ffffff",
  },
  "&:active": {
    transform: "translateY(2px) translateX(2px)",
  },
});

export const ModalCloseButton = styled("button")({
  background: "transparent",
  border: "none",
  color: "#64748b",
  cursor: "pointer",
  padding: "6px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.15s ease",
  "&:hover": {
    color: "#ef4444",
    transform: "scale(1.1)",
  },
});

export const HelpCloseButton = styled("button")({
  width: "100%",
  marginTop: "20px",
  background: "#fdfdfd",
  color: "#0f172a",
  fontFamily: '"Press Start 2P", monospace',
  fontWeight: "bold",
  padding: "12px",
  cursor: "pointer",
  fontSize: "0.7rem",
  textTransform: "uppercase",
  transition: "all 0.12s ease",
  boxShadow: "3px 3px 0px #0f172a",
  "&:hover": {
    background: "#facc15",
    color: "#0f172a",
  },
  "&:active": {
    transform: "translateY(2px) translateX(2px)",
    boxShadow: "1px 1px 0px #0f172a",
  },
});

/* ================== Pokemon Detail Panel (right column) ================== */
export const DetailPanel = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "0px",
  padding: "0px",
  background: "#fdfdfd",
  color: "#0f172a",
  border: "2px solid #0f172a",
  marginBottom: "12px",
  width: "100%",
  boxSizing: "border-box",
  overflow: "hidden",
});

export const DetailTopBar = styled("div")({
  background: "#facc15",
  width: "100%",
  padding: "10px 14px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  color: "#0f172a",
  boxSizing: "border-box",
  borderBottom: "1px solid rgba(15, 23, 42, 0.06)",
  ".left-section": {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    ".pokeball-icon": {
      width: "24px",
      height: "24px",
      objectFit: "contain",
    },
    ".name": {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: "0.85rem",
      fontWeight: "bold",
      textTransform: "capitalize",
    },
  },
  ".right-section": {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    ".lvl-pill": {
      background: "#0f172a",
      color: "#facc15",
      padding: "2px 6px",
      borderRadius: "4px",
      fontSize: "0.75rem",
      fontFamily: '"Press Start 2P", monospace',
      fontWeight: "bold",
    },
    ".gender-badge": {
      width: "20px",
      height: "20px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "0.8rem",
      fontWeight: "bold",
      color: "#fff",
      "&.male": {
        background: "#3b82f6",
      },
      "&.female": {
        background: "#ec4899",
      },
      "&.genderless": {
        background: "#64748b",
      },
    },
  },
});

export const DetailSubBar = styled("div")({
  background: "rgba(15, 23, 42, 0.03)",
  width: "100%",
  padding: "6px 14px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxSizing: "border-box",
  borderBottom: "1px solid rgba(15, 23, 42, 0.1)",
  ".dex-no": {
    color: "#334155",
    fontFamily: '"Press Start 2P", monospace',
    fontSize: "0.6rem",
  },
  ".shiny-star": {
    color: "#d97706",
    fontFamily: '"Press Start 2P", monospace',
    fontSize: "0.6rem",
    textShadow: "0 0 4px rgba(217, 119, 6, 0.25)",
  },
});

export const DetailTypeRow = styled("div")({
  width: "100%",
  padding: "10px 14px 6px",
  display: "flex",
  gap: "8px",
  boxSizing: "border-box",
  justifyContent: "center",
  ".type-badge": {
    padding: "4px 12px",
    borderRadius: "4px",
    fontSize: "0.65rem",
    fontFamily: '"Press Start 2P", monospace',
    fontWeight: "bold",
    color: "#fff",
    textShadow: "1px 1px 0 rgba(0,0,0,0.5)",
    boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
  },
});

export const DetailArtworkArea = styled("div")({
  width: "100%",
  display: "flex",
  justifyContent: "center",
  padding: "10px 0",
  background: "radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, rgba(255, 255, 255, 0) 70%)",
  ".artwork": {
    width: "min(28vw, 120px)",
    height: "auto",
    aspectRatio: "1",
    objectFit: "contain",
    filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))",
  },
});

export const DetailStatsArea = styled("div")({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "10px 14px",
  boxSizing: "border-box",
  ".radar-chart-container": {
    position: "relative",
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
});

// Removed unused DetailNatureBar

export const DetailIvJudgmentBar = styled("div")({
  width: "calc(100% - 28px)",
  margin: "0 14px 12px",
  background: "rgba(59, 130, 246, 0.06)",
  border: "1.5px dashed rgba(59, 130, 246, 0.25)",
  borderRadius: "6px",
  padding: "10px",
  textAlign: "center",
  boxSizing: "border-box",
  ".rating-text": {
    color: "#1d4ed8",
    fontFamily: '"Press Start 2P", monospace',
    fontSize: "0.7rem",
    textTransform: "uppercase",
  },
});

export const DetailMarkingsBar = styled("div")({
  width: "100%",
  display: "flex",
  justifyContent: "center",
  gap: "14px",
  padding: "12px 14px 16px",
  borderTop: "1px solid rgba(15, 23, 42, 0.06)",
  boxSizing: "border-box",
  ".marking-shape": {
    fontSize: "1.1rem",
    color: "rgba(15, 23, 42, 0.15)",
    transition: "all 0.2s ease",
    cursor: "default",
    userSelect: "none",
    "&.active": {
      color: "#2563eb",
      textShadow: "0 0 4px rgba(37, 99, 235, 0.3)",
      transform: "scale(1.1)",
    },
  },
});

export const DetailPlaceholder = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px 14px",
  gap: "6px",
  background: "rgba(255, 255, 255, 0.4)",
  borderRadius: "14px",
  border: "1px dashed rgba(148, 163, 184, 0.3)",
  marginBottom: "12px",
  minHeight: "80px",
  textAlign: "center",
  ".hint-main": {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#475569",
  },
  ".hint-sub": {
    fontSize: "0.8rem",
    color: "#94a3b8",
    maxWidth: "180px",
    lineHeight: 1.4,
  },
});

export const CompareStrip = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  padding: "10px",
  background: "rgba(168, 85, 247, 0.07)",
  border: "1px solid rgba(168, 85, 247, 0.25)",
  borderRadius: "12px",
  marginBottom: "12px",
  ".compare-picks": {
    display: "flex",
    gap: "8px",
    justifyContent: "center",
    ".pick": {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "2px",
      img: {
        width: "40px",
        height: "40px",
        objectFit: "contain",
      },
      span: {
        fontSize: "0.75rem",
        color: "#334155",
        fontWeight: 600,
        textTransform: "capitalize",
      },
    },
  },
});

export const DetailTabContainer = styled("div")({
  display: "flex",
  width: "calc(100% - 28px)",
  margin: "0 14px 10px",
  background: "rgba(15, 23, 42, 0.04)",
  borderRadius: "6px",
  padding: "3px",
  boxSizing: "border-box",
  border: "1px solid rgba(15, 23, 42, 0.06)",
});

export const DetailTabButton = styled("button")<{ active: boolean }>(({ active }) => ({
  flex: 1,
  background: active ? "#ffffff" : "transparent",
  color: active ? "#2563eb" : "#64748b",
  border: "none",
  borderRadius: "4px",
  padding: "6px 0",
  fontSize: "0.7rem",
  fontFamily: '"Press Start 2P", monospace',
  fontWeight: "bold",
  cursor: "pointer",
  transition: "all 0.15s ease",
  boxShadow: active ? "0 2px 6px rgba(15, 23, 42, 0.08)" : "none",
  "&:hover": {
    color: active ? "#2563eb" : "#0f172a",
  },
}));

// Removed unused DetailStatsGrid

/* ================== Redesigned Detail Tabs & Content ================== */
export const DetailMainTabContainer = styled("div")({
  display: "flex",
  width: "calc(100% - 24px)",
  margin: "10px 12px 6px",
  background: "rgba(15, 23, 42, 0.06)",
  padding: "3px",
  boxSizing: "border-box",
  border: "2px solid #0f172a",
});

export const DetailMainTabButton = styled("button")<{ active: boolean }>(({ active }) => ({
  flex: 1,
  background: active ? "#0f172a" : "transparent",
  color: active ? "#facc15" : "#334155",
  border: "none",
  padding: "7px 0",
  fontSize: "0.6rem",
  fontFamily: '"Press Start 2P", monospace',
  fontWeight: "bold",
  cursor: "pointer",
  transition: "all 0.12s ease",
  textTransform: "uppercase",
  "&:hover": {
    color: active ? "#facc15" : "#0f172a",
    background: active ? "#0f172a" : "rgba(15, 23, 42, 0.05)",
  },
}));

export const StatusTabContainer = styled("div")({
  width: "100%",
  padding: "0 12px 12px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  boxSizing: "border-box",
  alignItems: "center",
});

export const HpBarWrapper = styled("div")({
  width: "100%",
  background: "rgba(15, 23, 42, 0.05)",
  border: "1px solid rgba(148, 163, 184, 0.2)",
  borderRadius: "6px",
  height: "14px",
  position: "relative",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
});

export const HpBarInner = styled("div")<{ percent: number; colorCode: string }>(({ percent, colorCode }) => ({
  height: "100%",
  width: `${percent}%`,
  backgroundColor: colorCode,
  transition: "width 0.3s ease, background-color 0.3s ease",
}));

export const HpBarText = styled("div")({
  position: "absolute",
  width: "100%",
  textAlign: "center",
  fontSize: "0.6rem",
  fontFamily: '"Press Start 2P", monospace',
  fontWeight: "bold",
  color: "#0f172a",
  zIndex: 1,
});

export const InfoGrid = styled("div")({
  width: "100%",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "8px",
});

export const InfoItemBox = styled("div")({
  background: "rgba(15, 23, 42, 0.03)",
  border: "1.5px solid rgba(15, 23, 42, 0.12)",
  padding: "8px 10px",
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  boxSizing: "border-box",
  ".label": {
    fontSize: "0.5rem",
    fontFamily: '"Press Start 2P", monospace',
    color: "#475569",
    textTransform: "uppercase",
  },
  ".value": {
    fontSize: "0.7rem",
    fontFamily: '"Press Start 2P", monospace',
    color: "#0f172a",
    fontWeight: "bold",
  },
});

export const AbilityPill = styled("div")({
  background: "rgba(59, 130, 246, 0.08)",
  border: "1px solid rgba(59, 130, 246, 0.2)",
  borderRadius: "8px",
  padding: "8px 10px",
  width: "100%",
  boxSizing: "border-box",
  cursor: "help",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  gap: "2px",
  transition: "all 0.15s ease",
  "&:hover": {
    background: "rgba(59, 130, 246, 0.12)",
    borderColor: "rgba(59, 130, 246, 0.3)",
    ".tooltip": {
      opacity: 1,
      visibility: "visible",
      transform: "translateX(-50%) translateY(0)",
    },
  },
  ".label": {
    fontSize: "0.55rem",
    fontFamily: '"Press Start 2P", monospace',
    color: "#3b82f6",
    textTransform: "uppercase",
  },
  ".value": {
    fontSize: "0.75rem",
    fontFamily: '"Press Start 2P", monospace',
    color: "#1d4ed8",
    fontWeight: "bold",
  },
  ".tooltip": {
    position: "absolute",
    bottom: "100%",
    left: "50%",
    transform: "translateX(-50%) translateY(5px)",
    background: "#1e293b",
    color: "#ffffff",
    padding: "8px 12px",
    borderRadius: "8px",
    fontSize: "0.75rem",
    fontFamily: '"Outfit", "Inter", sans-serif',
    width: "220px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    zIndex: 100,
    opacity: 0,
    visibility: "hidden",
    transition: "all 0.15s ease",
    pointerEvents: "none",
    textAlign: "center",
    "&::after": {
      content: '""',
      position: "absolute",
      top: "100%",
      left: "50%",
      marginLeft: "-6px",
      borderWidth: "6px",
      borderStyle: "solid",
      borderColor: "#1e293b transparent transparent transparent",
    },
  },
});

export const HeldItemPill = styled("div")<{ hasItem: boolean }>(({ hasItem }) => ({
  background: hasItem ? "rgba(16, 185, 129, 0.08)" : "rgba(15, 23, 42, 0.02)",
  border: hasItem ? "1px solid rgba(16, 185, 129, 0.2)" : "1px solid rgba(148, 163, 184, 0.15)",
  borderRadius: "8px",
  padding: "8px 10px",
  width: "100%",
  boxSizing: "border-box",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  ".icon": {
    width: "24px",
    height: "24px",
    objectFit: "contain",
  },
  ".info": {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    ".label": {
      fontSize: "0.55rem",
      fontFamily: '"Press Start 2P", monospace',
      color: hasItem ? "#059669" : "#64748b",
      textTransform: "uppercase",
    },
    ".value": {
      fontSize: "0.75rem",
      fontFamily: '"Press Start 2P", monospace',
      color: hasItem ? "#065f46" : "#475569",
      fontWeight: "bold",
    },
  },
}));

/* ================== Tab 2: Moves ================== */
export const MovesTabContainer = styled("div")({
  width: "100%",
  padding: "0 12px 12px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  boxSizing: "border-box",
});

export const MovesGrid = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  width: "100%",
});

export const MoveItemCard = styled("div")<{ typeColor: string }>(({ typeColor }) => ({
  background: "#ffffff",
  border: `1.5px solid rgba(15, 23, 42, 0.1)`,
  borderLeft: `6px solid ${typeColor}`,
  padding: "8px 12px",
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  boxSizing: "border-box",
  ".move-header": {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    ".move-name": {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: "0.65rem",
      fontWeight: "bold",
      color: "#0f172a",
      textTransform: "uppercase",
    },
    ".pp-val": {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: "0.5rem",
      color: "#334155",
      fontWeight: "bold",
    },
  },
}));

export const MoveMetaRow = styled("div")({
  display: "flex",
  gap: "6px",
  alignItems: "center",
  ".type-badge": {
    padding: "2px 6px",
    color: "#ffffff",
    fontSize: "0.5rem",
    fontFamily: '"Press Start 2P", monospace',
    fontWeight: "bold",
    textShadow: "1px 1px 0 rgba(0,0,0,0.4)",
  },
  ".class-badge": {
    padding: "2px 6px",
    fontSize: "0.5rem",
    fontFamily: '"Press Start 2P", monospace',
    fontWeight: "bold",
    textTransform: "uppercase",
    "&.physical": { background: "#ef4444", color: "#ffffff" },
    "&.special": { background: "#2563eb", color: "#ffffff" },
    "&.status": { background: "#475569", color: "#f1f5f9" },
  },
  ".power-acc": {
    fontFamily: '"VT323", monospace',
    fontSize: "1rem",
    color: "#334155",
    fontWeight: "bold",
    marginLeft: "auto",
  },
});

export const ManageMovesBtn = styled("button")({
  width: "100%",
  padding: "10px",
  background: "#0f172a",
  color: "#facc15",
  fontSize: "0.7rem",
  fontFamily: '"Press Start 2P", monospace',
  fontWeight: "bold",
  cursor: "pointer",
  transition: "all 0.12s ease",
  marginTop: "4px",
  textTransform: "uppercase",
  boxShadow: "3px 3px 0px #334155",
  "&:hover": {
    background: "#1e293b",
  },
  "&:active": {
    transform: "translateY(2px) translateX(2px)",
    boxShadow: "1px 1px 0px #334155",
  },
});

/* ================== Tab 3: Stats ================== */
export const StatsTabContainer = styled("div")({
  width: "100%",
  padding: "0 12px 12px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  boxSizing: "border-box",
});

export const StatBarRow = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "2px",
  width: "100%",
});

export const StatLabelRow = styled("div")<{ textColor: string }>(({ textColor }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  ".stat-name": {
    fontFamily: '"Press Start 2P", monospace',
    fontSize: "0.55rem",
    color: textColor,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  ".stat-values": {
    fontFamily: '"VT323", monospace',
    fontSize: "0.95rem",
    color: "#475569",
    fontWeight: "bold",
    ".curr": {
      color: textColor,
      fontSize: "1.1rem",
    },
    ".max": {
      color: "#94a3b8",
      fontSize: "0.85rem",
    },
  },
}));

export const StatBarWrapper = styled("div")({
  width: "100%",
  background: "rgba(15, 23, 42, 0.05)",
  borderRadius: "4px",
  height: "8px",
  position: "relative",
  overflow: "hidden",
});

export const StatBarInner = styled("div")<{ percent: number; color: string }>(({ percent, color }) => ({
  height: "100%",
  width: `${percent}%`,
  backgroundColor: color,
  borderRadius: "4px",
  transition: "width 0.3s ease",
}));

export const RadarToggleBtn = styled("button")({
  width: "100%",
  padding: "8px",
  background: "transparent",
  border: "2px dashed #94a3b8",
  color: "#475569",
  fontSize: "0.6rem",
  fontFamily: '"Press Start 2P", monospace',
  fontWeight: "bold",
  cursor: "pointer",
  transition: "all 0.12s ease",
  marginTop: "6px",
  textTransform: "uppercase",
  "&:hover": {
    background: "rgba(15, 23, 42, 0.04)",
    color: "#0f172a",
    borderColor: "#0f172a",
  },
  "&:active": {
    transform: "translateY(1px)",
  },
});

/* ================== Manage Moves Modal ================== */
export const MoveManagerModalOverlay = styled("div")({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(15, 23, 42, 0.4)",
  backdropFilter: "blur(4px)",
  zIndex: 3000,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
});

export const MoveManagerContainer = styled("div")({
  background: "#fdfdfd",
  width: "100%",
  maxWidth: "850px",
  padding: "24px",
  border: "3px solid #0f172a",
  boxShadow: "6px 6px 0px #0f172a",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  boxSizing: "border-box",
  ".modal-header": {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "4px double #0f172a", // Retro double line
    paddingBottom: "12px",
    h3: {
      margin: 0,
      fontSize: "0.95rem",
      fontFamily: '"Press Start 2P", monospace',
      color: "#0f172a",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    ".close-btn": {
      background: "transparent",
      border: "none",
      color: "#64748b",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "4px",
      transition: "all 0.15s ease",
      "&:hover": {
        color: "#ef4444",
        transform: "scale(1.1)",
      },
      "&:active": {
        transform: "scale(0.9)",
      },
    },
  },
  ".validation-warning": {
    background: "rgba(239, 68, 68, 0.08)",
    border: "2px solid #ef4444",
    borderRadius: "4px",
    padding: "8px 12px",
    color: "#ef4444",
    fontSize: "0.6rem",
    fontFamily: '"Press Start 2P", monospace',
    lineHeight: "1.4",
  },
  ".actions-row": {
    display: "flex",
    gap: "16px",
    justifyContent: "flex-end",
    marginTop: "8px",
  },
});

export const MoveManagerSplitLayout = styled("div")({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "24px",
  width: "100%",
  boxSizing: "border-box",
  "@media (min-width: 640px)": {
    gridTemplateColumns: "1fr 1.25fr",
  },
});

export const ActiveMovesColumn = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
});

export const ActiveMoveSlot = styled("div")<{ isEmpty: boolean; typeColor?: string }>(({ isEmpty, typeColor }) => ({
  minHeight: "72px",
  borderRadius: "8px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: "10px 14px",
  boxSizing: "border-box",
  transition: "all 0.15s ease",
  position: "relative",
  gap: "6px",
  ...(isEmpty
    ? {
      border: "3px dashed #cbd5e1",
      background: "rgba(15, 23, 42, 0.02)",
      alignItems: "center",
      color: "#94a3b8",
      fontSize: "0.6rem",
      fontFamily: '"Press Start 2P", monospace',
      textTransform: "uppercase",
      cursor: "default",
    }
    : {
      border: "2px solid #0f172a", // Retro outline
      borderLeft: `6px solid ${typeColor || "#888"}`,
      background: "#ffffff",
      cursor: "pointer",
      "&:hover": {
        borderColor: "#ef4444",
        background: "rgba(239, 68, 68, 0.03)",
        ".remove-indicator": {
          opacity: 1,
          transform: "scale(1)",
        },
      },
    }),
  ".active-move-header": {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    ".move-name": {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: "0.65rem",
      fontWeight: "bold",
      color: "#0f172a",
      textTransform: "uppercase",
    },
    ".pp-val": {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: "0.5rem",
      color: "#334155",
      fontWeight: "bold",
    },
  },
  ".active-move-meta": {
    display: "flex",
    gap: "6px",
    alignItems: "center",
    width: "100%",
    ".type-badge": {
      padding: "2px 6px",
      borderRadius: "4px",
      color: "#ffffff",
      fontSize: "8px",
      fontFamily: '"Press Start 2P", monospace',
      fontWeight: "bold",
      textShadow: "1px 1px 0 rgba(0,0,0,0.3)",
    },
    ".class-badge": {
      padding: "2px 6px",
      borderRadius: "4px",
      fontSize: "8px",
      fontFamily: '"Press Start 2P", monospace',
      fontWeight: "bold",
      textTransform: "uppercase",
      "&.physical": { background: "#ef4444", color: "#ffffff" },
      "&.special": { background: "#3b82f6", color: "#ffffff" },
      "&.status": { background: "#94a3b8", color: "#1e293b" },
    },
    ".power-acc": {
      fontSize: "0.9rem",
      fontFamily: '"VT323", monospace',
      color: "#64748b",
      marginLeft: "auto",
    },
  },
  ".remove-indicator": {
    position: "absolute",
    top: "-8px",
    right: "-8px",
    background: "#ef4444",
    color: "#ffffff",
    border: "2px solid #0f172a",
    borderRadius: "4px", // Blocky retro bubble
    width: "20px",
    height: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "10px",
    fontWeight: "bold",
    opacity: 0,
    transform: "scale(0.8)",
    transition: "all 0.15s ease",
    pointerEvents: "none",
    zIndex: 10,
    boxShadow: "2px 2px 0px #0f172a",
  },
}));

export const AvailableMovesColumn = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  minWidth: 0,
});

export const MovesListContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  maxHeight: "340px",
  overflowY: "auto",
  paddingRight: "6px",
  "&::-webkit-scrollbar": {
    width: "6px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "rgba(0,0,0,0.15)",
    borderRadius: "3px",
  },
});

export const PixelCheckbox = styled("div")<{ checked: boolean }>(({ checked }) => ({
  width: "18px",
  height: "18px",
  border: "2px solid #0f172a",
  background: checked ? "#10b981" : "#ffffff", // Retro green when checked
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "inset -2px -2px rgba(0,0,0,0.1)",
  flexShrink: 0,
  "&::after": checked
    ? {
      content: '"✓"',
      fontFamily: '"Press Start 2P", monospace',
      fontSize: "8px",
      color: "#ffffff",
      fontWeight: "bold",
    }
    : {},
}));

export const MoveRowItem = styled("div")<{ checked: boolean; disabled: boolean }>(({ checked, disabled }) => ({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "10px 14px",
  borderRadius: "8px",
  background: checked ? "rgba(16, 185, 129, 0.03)" : "#ffffff",
  border: checked
    ? "2px solid #0f172a" // Retro outline when selected
    : "2px solid rgba(15, 23, 42, 0.1)",
  cursor: disabled ? "not-allowed" : "pointer",
  transition: "all 0.15s ease",
  opacity: disabled ? 0.5 : 1,
  boxSizing: "border-box",
  boxShadow: checked ? "2px 2px 0px #0f172a" : "none", // Nice pixel shadow when selected
  "&:hover": {
    borderColor: disabled ? (checked ? "#0f172a" : "rgba(15, 23, 42, 0.1)") : "#0f172a",
    background: disabled ? (checked ? "rgba(16, 185, 129, 0.03)" : "#ffffff") : "rgba(15, 23, 42, 0.02)",
    boxShadow: disabled ? (checked ? "2px 2px 0px #0f172a" : "none") : "2px 2px 0px #0f172a",
  },
  ".lvl-badge": {
    background: "#0f172a",
    color: "#facc15",
    padding: "3px 6px",
    borderRadius: "4px",
    fontSize: "8px",
    fontFamily: '"Press Start 2P", monospace',
    fontWeight: "bold",
    minWidth: "55px",
    textAlign: "center",
  },
  ".move-name": {
    fontFamily: '"Press Start 2P", monospace',
    fontSize: "0.65rem",
    fontWeight: "bold",
    color: "#0f172a",
    textTransform: "uppercase",
    flex: 1,
  },
  ".move-stats": {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    ".type-badge": {
      padding: "2px 6px",
      borderRadius: "4px",
      color: "#ffffff",
      fontSize: "8px",
      fontFamily: '"Press Start 2P", monospace',
      fontWeight: "bold",
      textShadow: "1px 1px 0 rgba(0,0,0,0.3)",
    },
    ".stat": {
      fontSize: "1rem",
      fontFamily: '"VT323", monospace',
      color: "#334155",
      fontWeight: "bold",
    },
  },
}));


