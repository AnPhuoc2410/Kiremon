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
  background: "rgba(255, 255, 255, 0.72)",
  border: "1px solid rgba(148, 163, 184, 0.18)",
  borderRadius: "20px",
  padding: "16px 24px",
  backdropFilter: "blur(10px)",
  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
  ".title-section": {
    h1: {
      margin: 0,
      fontSize: "2.4rem",
      fontWeight: 700,
      letterSpacing: "-0.01em",
      color: "#0f172a",
      textShadow: "2px 2px 0 rgba(0,0,0,0.04)",
      textTransform: "uppercase",
    },
    p: {
      margin: "4px 0 0",
      fontSize: "1.1rem",
      color: "#475569",
    },
  },
});

export const KeyboardInfoBtn = styled("button")({
  background: "rgba(15, 23, 42, 0.04)",
  color: "#334155",
  border: "1px solid rgba(148, 163, 184, 0.2)",
  borderRadius: "999px",
  padding: "8px 16px",
  fontSize: "1rem",
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  transition: "all 0.16s ease",
  cursor: "pointer",
  "&:hover": {
    background: "#ffffff",
    color: "#0f172a",
    borderColor: "#3b82f6",
    transform: "translateY(-1px)",
    boxShadow: "0 6px 16px rgba(15, 23, 42, 0.08)",
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
  background: "rgba(255, 255, 255, 0.72)",
  border: "1px solid rgba(148, 163, 184, 0.18)",
  borderRadius: "20px",
  padding: "16px",
  backdropFilter: "blur(10px)",
  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
  h2: {
    margin: "0 0 16px",
    fontSize: "1.3rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "#0f172a",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
});

export const PartySlotsContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
});

export const PartySlot = styled("div")<{
  isHovered: boolean;
  isEmpty: boolean;
  isDraggingOver: boolean;
  isSelected?: boolean;
  isMultiSelected?: boolean;
}>(({ isHovered, isEmpty, isDraggingOver, isSelected, isMultiSelected }) => ({
  height: "72px",
  borderRadius: "12px",
  border: isMultiSelected
    ? "2px solid #a855f7"
    : isSelected
    ? "2px solid #f59e0b"
    : isDraggingOver
    ? "2px dashed #3b82f6"
    : isHovered
    ? "1px solid rgba(59, 130, 246, 0.5)"
    : "1px solid rgba(148, 163, 184, 0.2)",
  background: isMultiSelected
    ? "rgba(168, 85, 247, 0.08)"
    : isSelected
    ? "rgba(245, 158, 11, 0.08)"
    : isDraggingOver
    ? "rgba(59, 130, 246, 0.05)"
    : isEmpty
    ? "rgba(15, 23, 42, 0.03)"
    : "rgba(255, 255, 255, 0.85)",
  boxShadow: isMultiSelected
    ? "0 0 12px rgba(168, 85, 247, 0.35)"
    : isSelected
    ? "0 0 10px rgba(245, 158, 11, 0.3)"
    : "none",
  display: "flex",
  alignItems: "center",
  padding: "8px 12px",
  gap: "10px",
  transition: "all 0.2s ease",
  position: "relative",
  cursor: isEmpty ? "default" : "grab",
  "&:active": {
    cursor: isEmpty ? "default" : "grabbing",
  },
  "&:hover": {
    background: isEmpty ? "rgba(15, 23, 42, 0.06)" : "#ffffff",
    boxShadow: isEmpty ? "none" : "0 6px 16px rgba(15, 23, 42, 0.08)",
  },
  ".index-tag": {
    position: "absolute",
    top: "4px",
    left: "6px",
    fontSize: "0.8rem",
    color: "#64748b",
    fontWeight: 700,
  },
  ".sprite": {
    width: "48px",
    height: "48px",
    objectFit: "contain",
  },
  ".details": {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minWidth: 0,
    ".name": {
      fontSize: "1.1rem",
      fontWeight: 600,
      color: "#0f172a",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    ".lvl": {
      fontSize: "0.9rem",
      color: "#475569",
    },
  },
  ".shiny-sparkle": {
    color: "#fbbf24",
    fontSize: "12px",
  },
  ".held-item-icon": {
    width: "16px",
    height: "16px",
    objectFit: "contain",
  },
}));


/* ================== Box Area ================== */
export const BoxWrapper = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  background: "rgba(255, 255, 255, 0.5)",
  border: "1px solid rgba(148, 163, 184, 0.18)",
  borderRadius: "20px",
  padding: "20px",
  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.05)",
});

export const BoxControls = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "rgba(255, 255, 255, 0.85)",
  border: "1px solid rgba(148, 163, 184, 0.18)",
  borderRadius: "12px",
  padding: "8px 16px",
  backdropFilter: "blur(8px)",
  ".navigation": {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    h3: {
      margin: 0,
      fontSize: "1.3rem",
      fontWeight: 600,
      minWidth: "120px",
      textAlign: "center",
      cursor: "pointer",
      color: "#0f172a",
      textTransform: "uppercase",
      "&:hover": {
        color: "#3b82f6",
      },
    },
  },
  ".box-action-btn": {
    background: "transparent",
    border: "none",
    color: "#64748b",
    cursor: "pointer",
    padding: "6px",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.15s ease",
    "&:hover": {
      background: "rgba(15, 23, 42, 0.04)",
      color: "#3b82f6",
    },
  },
});

export const BoxGridContainer = styled("div")<{ bgUrl?: string }>(({ bgUrl }) => ({
  aspectRatio: "1.2",
  borderRadius: "16px",
  backgroundImage: bgUrl ? `url(${bgUrl})` : "none",
  backgroundSize: "cover",
  backgroundPosition: "center",
  boxShadow: "inset 0 0 50px rgba(0,0,0,0.15), 0 8px 30px rgba(15, 23, 42, 0.08)",
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
  isHovered: boolean;
  isDraggingOver: boolean;
  isDimmed?: boolean;
  isHighlighted?: boolean;
  isShiny?: boolean;
  isCompareSelected?: boolean;
  isSelected?: boolean;
}>(({ isEmpty, isHovered, isDraggingOver, isDimmed, isHighlighted, isShiny, isCompareSelected, isSelected }) => ({
  borderRadius: "8px",
  border: isCompareSelected
    ? "2px solid #a855f7"
    : isSelected
    ? "2px solid #f59e0b"
    : isDraggingOver
    ? "2px dashed #fbbf24"
    : isHighlighted
    ? "2px solid #3b82f6"
    : isHovered
    ? "1px solid rgba(15, 23, 42, 0.3)"
    : "1px solid rgba(148, 163, 184, 0.2)",
  background: isCompareSelected
    ? "rgba(168, 85, 247, 0.12)"
    : isSelected
    ? "rgba(245, 158, 11, 0.1)"
    : isDraggingOver
    ? "rgba(251, 191, 36, 0.15)"
    : isEmpty
    ? "rgba(255, 255, 255, 0.35)"
    : "rgba(255, 255, 255, 0.85)",
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
    ? "0 0 14px rgba(168, 85, 247, 0.5)"
    : isSelected
    ? "0 0 10px rgba(245, 158, 11, 0.4)"
    : isHighlighted
    ? "0 0 15px rgba(59, 130, 246, 0.5)"
    : isShiny && !isEmpty
    ? "0 0 8px rgba(251, 191, 36, 0.3)"
    : "none",
  transition: "all 0.15s ease",
  "&:active": {
    cursor: isEmpty ? "default" : "grabbing",
  },
  "&:hover": {
    transform: isEmpty ? "none" : "scale(1.05)",
    background: isEmpty ? "rgba(255, 255, 255, 0.55)" : "rgba(255, 255, 255, 0.95)",
    boxShadow: isEmpty ? "none" : "0 8px 20px rgba(15, 23, 42, 0.08)",
    zIndex: 10,
  },
  ".sprite": {
    width: "90%",
    height: "90%",
    maxHeight: "60px",
    objectFit: "contain",
    filter: isDimmed ? "grayscale(80%)" : "none",
  },
  ".mini-info": {
    position: "absolute",
    bottom: "4px",
    left: "4px",
    right: "4px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "0.75rem",
    color: "#475569",
  },
  ".markings-dots": {
    position: "absolute",
    top: "4px",
    right: "4px",
    display: "flex",
    gap: "2px",
    fontSize: "8px",
    color: "#3b82f6",
  },
  // Badge when ctrl-selected for compare
  ".compare-badge": {
    position: "absolute",
    top: "2px",
    left: "2px",
    fontSize: "9px",
    fontWeight: "bold",
    color: "#7c3aed",
    lineHeight: 1,
    textShadow: "0 0 4px rgba(255,255,255,0.8)",
  },
}));

/* ================== Right Panel ================== */
export const RightPanelCard = styled("div")({
  background: "rgba(255, 255, 255, 0.72)",
  border: "1px solid rgba(148, 163, 184, 0.18)",
  borderRadius: "20px",
  padding: "20px",
  backdropFilter: "blur(10px)",
  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  h2: {
    margin: 0,
    fontSize: "1.3rem",
    fontWeight: 600,
    color: "#0f172a",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
});

export const SearchBoxWrapper = styled("div")({
  display: "flex",
  background: "rgba(255, 255, 255, 0.8)",
  border: "1px solid rgba(148, 163, 184, 0.25)",
  borderRadius: "8px",
  padding: "8px 12px",
  alignItems: "center",
  gap: "8px",
  transition: "all 0.2s ease",
  "&:focus-within": {
    borderColor: "#3b82f6",
    boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.15)",
  },
  input: {
    background: "transparent",
    border: "none",
    color: "#0f172a",
    outline: "none",
    width: "100%",
    fontSize: "1rem",
    "&::placeholder": {
      color: "#64748b",
    },
  },
});

export const ModeSelectors = styled("div")({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "8px",
});

export const ModeButton = styled("button")<{ active: boolean; btnColor?: string }>(
  ({ active, btnColor }) => ({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid transparent",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.15s ease",
    background: active ? btnColor || "#3b82f6" : "rgba(15, 23, 42, 0.03)",
    color: active ? "#ffffff" : "#334155",
    borderColor: active ? "transparent" : "rgba(148, 163, 184, 0.2)",
    boxShadow: active ? "0 4px 12px rgba(59, 130, 246, 0.2)" : "none",
    "&:hover": {
      background: active ? btnColor || "#3b82f6" : "rgba(15, 23, 42, 0.06)",
      transform: "translateX(2px)",
    },
  })
);

export const SectionTitle = styled("h3")({
  margin: "0 0 10px",
  fontSize: "1.1rem",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: "#475569",
});

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

/* ================== Selection Box (Group Mode) ================== */
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
  border: "1.5px solid #fbbf24",
  background: "rgba(251, 191, 36, 0.12)",
  pointerEvents: "none",
  zIndex: 50,
  borderRadius: "4px",
}));

/* ================== Context Menu ================== */
export const ContextMenu = styled("div")<{ x: number; y: number }>(({ x, y }) => ({
  position: "fixed",
  top: y,
  left: x,
  background: "rgba(255, 255, 255, 0.95)",
  border: "1px solid rgba(148, 163, 184, 0.2)",
  borderRadius: "12px",
  padding: "6px",
  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.12)",
  zIndex: 1000,
  display: "flex",
  flexDirection: "column",
  gap: "2px",
  minWidth: "160px",
  backdropFilter: "blur(12px)",
}));

export const ContextMenuItem = styled("button")({
  background: "transparent",
  border: "none",
  color: "#334155",
  padding: "8px 12px",
  borderRadius: "6px",
  textAlign: "left",
  fontSize: "1rem",
  fontWeight: "bold",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  transition: "all 0.15s ease",
  "&:hover": {
    background: "rgba(15, 23, 42, 0.04)",
    color: "#3b82f6",
  },
  "&.danger": {
    "&:hover": {
      background: "rgba(239, 68, 68, 0.1)",
      color: "#ef4444",
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
  background: "rgba(15, 23, 42, 0.4)",
  backdropFilter: "blur(8px)",
  zIndex: 1500,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
});

export const BoxListModalContainer = styled("div")({
  background: "rgba(253, 253, 253, 0.98)",
  border: "1px solid rgba(148, 163, 184, 0.2)",
  borderRadius: "20px",
  width: "100%",
  maxWidth: "900px",
  padding: "24px",
  boxShadow: "0 24px 60px rgba(15, 23, 42, 0.15)",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  ".modal-header": {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "2px solid rgba(15, 23, 42, 0.1)",
    paddingBottom: "12px",
    h3: {
      margin: 0,
      fontSize: "1.5rem",
      fontWeight: 700,
      color: "#0f172a",
      textTransform: "uppercase",
    },
    ".close-btn": {
      background: "transparent",
      border: "none",
      color: "#64748b",
      cursor: "pointer",
      "&:hover": { color: "#ef4444" },
    },
  },
  ".grid-container": {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))",
    gap: "12px",
    maxHeight: "450px",
    overflowY: "auto",
    paddingRight: "8px",
    "&::-webkit-scrollbar": {
      width: "6px",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "rgba(0,0,0,0.1)",
      borderRadius: "3px",
    },
  },
});

export const BoxThumbnailItem = styled("div")<{
  isActive: boolean;
  bgUrl?: string;
  isDragging?: boolean;
}>(({ isActive, bgUrl, isDragging }) => ({
  aspectRatio: "1.2",
  borderRadius: "8px",
  border: isActive ? "2.5px solid #3b82f6" : "1px solid rgba(148, 163, 184, 0.25)",
  backgroundImage: bgUrl ? `url(${bgUrl})` : "none",
  backgroundSize: "cover",
  backgroundPosition: "center",
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  padding: "6px",
  position: "relative",
  opacity: isDragging ? 0.4 : 1,
  boxShadow: isActive ? "0 0 10px rgba(59, 130, 246, 0.4)" : "none",
  transition: "all 0.15s ease",
  "&:hover": {
    transform: "scale(1.03)",
    borderColor: isActive ? "#3b82f6" : "rgba(15, 23, 42, 0.3)",
  },
  ".box-num": {
    fontSize: "0.75rem",
    background: "rgba(255, 255, 255, 0.85)",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    padding: "2px 4px",
    borderRadius: "4px",
    alignSelf: "flex-start",
    color: "#0f172a",
    fontWeight: 600,
  },
  ".box-count": {
    fontSize: "0.75rem",
    background: "rgba(255, 255, 255, 0.85)",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    padding: "2px 4px",
    borderRadius: "4px",
    alignSelf: "flex-end",
    color: "#475569",
  },
}));

/* ================== Shortcuts Info Help Overlay ================== */
export const HelpOverlay = styled("div")({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(15, 23, 42, 0.4)",
  zIndex: 2500,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
  backdropFilter: "blur(6px)",
});

export const HelpContainer = styled("div")({
  background: "rgba(253, 253, 253, 0.98)",
  border: "1px solid rgba(148, 163, 184, 0.2)",
  borderRadius: "16px",
  width: "100%",
  maxWidth: "550px",
  padding: "24px",
  boxShadow: "0 24px 60px rgba(15, 23, 42, 0.15)",
  h3: {
    margin: "0 0 16px",
    fontSize: "1.5rem",
    color: "#0f172a",
    textTransform: "uppercase",
    borderBottom: "2px solid rgba(15, 23, 42, 0.1)",
    paddingBottom: "8px",
  },
  ".shortcuts-grid": {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    ".shortcut-row": {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid rgba(15,23,42,0.05)",
      paddingBottom: "6px",
      ".key": {
        background: "rgba(15, 23, 42, 0.04)",
        border: "1px solid rgba(148, 163, 184, 0.25)",
        borderRadius: "4px",
        padding: "2px 8px",
        fontSize: "0.95rem",
        fontFamily: "monospace",
        color: "#3b82f6",
        fontWeight: "bold",
      },
      ".desc": {
        fontSize: "1.1rem",
        color: "#334155",
      },
    },
  },
  button: {
    width: "100%",
    marginTop: "20px",
    background: "#3b82f6",
    color: "#ffffff",
    fontWeight: "bold",
    border: "none",
    padding: "12px",
    borderRadius: "999px",
    cursor: "pointer",
    fontSize: "1.1rem",
    textTransform: "uppercase",
    transition: "background-color 0.15s ease",
    "&:hover": {
      background: "#2563eb",
    },
  },
});

/* ================== Extra Buttons ================== */
export const CompareButton = styled("button")({
  width: "100%",
  padding: "10px 16px",
  background: "linear-gradient(90deg, #7c3aed 0%, #6d28d9 100%)",
  color: "#ffffff",
  border: "none",
  borderRadius: "8px",
  fontSize: "1rem",
  fontWeight: "bold",
  cursor: "pointer",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  transition: "all 0.15s ease",
  "&:hover": {
    background: "linear-gradient(90deg, #6d28d9 0%, #5b21b6 100%)",
    transform: "translateY(-1px)",
    boxShadow: "0 4px 14px rgba(124, 58, 237, 0.4)",
  },
});

export const CloseBtn = styled("button")({
  background: "rgba(15, 23, 42, 0.05)",
  border: "1px solid rgba(148, 163, 184, 0.2)",
  color: "#334155",
  fontWeight: "bold",
  padding: "8px 16px",
  borderRadius: "999px",
  cursor: "pointer",
  fontSize: "1rem",
  transition: "all 0.15s ease",
  "&:hover": {
    background: "rgba(15, 23, 42, 0.1)",
    color: "#0f172a",
  },
});

export const ModalCloseButton = styled("button")({
  background: "transparent",
  border: "none",
  color: "#64748b",
  cursor: "pointer",
  padding: "6px",
  borderRadius: "6px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "color 0.15s ease",
  "&:hover": {
    color: "#ef4444",
  },
});

export const HelpCloseButton = styled("button")({
  width: "100%",
  marginTop: "20px",
  background: "#3b82f6",
  color: "#ffffff",
  fontWeight: "bold",
  border: "none",
  padding: "12px",
  borderRadius: "999px",
  cursor: "pointer",
  fontSize: "1.1rem",
  textTransform: "uppercase",
  transition: "background-color 0.15s ease",
  "&:hover": {
    background: "#2563eb",
  },
});

/* ================== Pokemon Detail Panel (right column) ================== */
export const DetailPanel = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "0px",
  padding: "0px",
  background: "rgba(255, 255, 255, 0.72) !important",
  color: "#0f172a",
  border: "1px solid rgba(148, 163, 184, 0.2)",
  borderRadius: "12px",
  boxShadow: "0 6px 20px rgba(15, 23, 42, 0.03)",
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
  background: "rgba(15, 23, 42, 0.02)",
  width: "100%",
  padding: "8px 14px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxSizing: "border-box",
  borderBottom: "1px solid rgba(15, 23, 42, 0.06)",
  ".dex-no": {
    color: "#64748b",
    fontFamily: '"Press Start 2P", monospace',
    fontSize: "0.65rem",
  },
  ".shiny-star": {
    color: "#d97706",
    fontFamily: '"Press Start 2P", monospace',
    fontSize: "0.65rem",
    textShadow: "0 0 4px rgba(217, 119, 6, 0.2)",
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
    width: "120px",
    height: "120px",
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

export const DetailNatureBar = styled("div")({
  width: "calc(100% - 28px)",
  margin: "0 14px 10px",
  background: "rgba(15, 23, 42, 0.03)",
  border: "1px solid rgba(15, 23, 42, 0.06)",
  borderRadius: "4px",
  padding: "8px 12px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxSizing: "border-box",
  ".label": {
    color: "#0f766e",
    fontFamily: '"Press Start 2P", monospace',
    fontSize: "0.65rem",
    textTransform: "uppercase",
  },
  ".value": {
    color: "#0f172a",
    fontFamily: '"Press Start 2P", monospace',
    fontSize: "0.65rem",
    fontWeight: "bold",
  },
});

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

