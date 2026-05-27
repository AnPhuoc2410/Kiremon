import styled from "@emotion/styled";
import { units } from "@/components/utils";

const Page = styled("div")({
  padding: "12px 16px 0",
  minHeight: "100vh",
  backgroundColor: "#D0D8D8",
  fontFamily: '"Press Start 2P", "Courier New", monospace',
  color: "#181818",
  textRendering: "optimizeSpeed",
  WebkitFontSmoothing: "none",
  MozOsxFontSmoothing: "unset",
  "@media (min-width: 1024px)": {
    padding: "12px 72px 0",
  },
});

const Header = styled("header")({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  margin: "8px 0 12px",
  gap: 12,
  flexWrap: "wrap",
});

const Grid = styled("div")({
  display: "grid",
  gap: "12px",
  padding: "16px",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  "@media (min-width: 640px)": {
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  },
  "@media (min-width: 768px)": {
    gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
  },
  "@media (min-width: 1024px)": {
    gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
  },
  "@media (min-width: 1280px)": {
    gridTemplateColumns: "repeat(8, minmax(0, 1fr))",
  },
});

const EmptyState = styled("div")({
  minHeight: 300,
  width: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: 16,
});

const EmptyStateText = styled("p")({
  margin: 0,
  color: "#000",
  fontSize: 13,
  fontWeight: 700,
});

const ShowAllButton = styled("button")({
  width: 160,
  height: 40,
  minWidth: 160,
  minHeight: 40,
  maxHeight: 40,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "2px solid #000",
  background: "#93c5fd",
  color: "#000",
  fontWeight: 700,
  fontSize: 12,
  boxShadow: "2px 2px 0 0 rgba(0,0,0,1)",
  padding: 0,
  cursor: "pointer",
  alignSelf: "center",
  flex: "0 0 auto",
  "&:hover": {
    background: "#bfdbfe",
  },
});

const DeleteConfirmationModal = styled("div")({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  padding: "0 16px",
});

const DialogContainer = styled("div")({
  width: "100%",
  maxWidth: "480px",
  margin: "0 auto",
  "&.pxl-border": {
    padding: "28px 36px !important",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    backgroundColor: "#F3F4F6",
  },
});

const DialogButtonGroup = styled("div")({
  display: "flex",
  flexDirection: "row",
  gap: "12px",
  marginTop: "8px",
  justifyContent: "center",
  width: "100%",
});

const RetroActionButton = styled("button")<{ isDanger?: boolean; isActive?: boolean }>(
  ({ isDanger, isActive }) => ({
    width: "112px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 0,
    fontSize: "12px",
    fontWeight: "bold",
    fontFamily: '"Press Start 2P", "Courier New", monospace',
    cursor: "pointer",
    border: "2px solid #000000",
    position: "relative",
    outline: isActive ? "3px double #000000" : "none",
    outlineOffset: isActive ? "2px" : "none",
    ...(isDanger
      ? {
          background: isActive ? "#dc2626" : "#000000",
          color: isActive ? "#ffffff" : "#fef08a",
          "&:hover": {
            background: "#dc2626",
            color: "#ffffff",
          },
        }
      : {
          background: isActive ? "#e0f2fe" : "#bae6fd",
          color: "#000000",
          "&:hover": {
            background: "#e0f2fe",
          },
        }),
  })
);

const RetroArrow = styled("span")({
  position: "absolute",
  left: "10px",
  top: "50%",
  transform: "translateY(-50%)",
  fontSize: "10px",
  lineHeight: 1,
  pointerEvents: "none",
});

const WrapperCardList = styled("div")({
  position: "relative",
});

const SlotCard = styled("button")({
  width: "100%",
  aspectRatio: "1 / 0.92",
  maxHeight: 150,
  background: "#F0F8F8",
  border: "2px solid #000000",
  borderRadius: 0,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  padding: 4,
  cursor: "pointer",
  position: "relative",
  boxShadow: "inset -1px -1px 0 #9ca3af, inset 1px 1px 0 #ffffff",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    border: "1px solid #e5e7eb",
    pointerEvents: "none",
  },
  "&:hover, &:focus-visible": {
    borderColor: "#3b82f6",
    outline: "none",
  },
});

const SlotTop = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 4,
  minHeight: 18,
  paddingTop: 2,
  paddingLeft: 4,
  paddingRight: 4,
});

const BadgeRow = styled("div")({
  display: "flex",
  flexWrap: "wrap",
  gap: 4,
});

const Badge = styled("span")({
  fontSize: 10,
  lineHeight: 1.2,
  padding: "1px 4px",
  border: "1px solid #000000",
  borderRadius: 0,
  background: "#1e3a8a",
  color: "#ffffff",
  textTransform: "uppercase",
  fontWeight: 700,
});

const StatusBadge = styled(Badge)({
  background: "#065f46",
});

const ReleaseButton = styled("button")({
  width: 20,
  height: 20,
  minWidth: 20,
  border: "1px solid #000000",
  background: "#ef4444",
  color: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
  fontSize: 10,
  lineHeight: 1,
  fontWeight: 700,
  cursor: "pointer",
  "&:hover": {
    background: "#f87171",
  },
});

const SpriteWrap = styled("div")({
  flex: 1,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 2,
});

const SpriteImage = styled("img")({
  width: 64,
  height: 64,
  objectFit: "contain",
  imageRendering: "pixelated",
  msInterpolationMode: "nearest-neighbor",
  transform: "scale(1.4)",
  transformOrigin: "center",
});

const SlotName = styled("div")({
  fontSize: 11,
  lineHeight: 1.1,
  color: "#000000",
  textAlign: "center",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  textTransform: "capitalize",
  border: "1px solid #000000",
  background: "#ffffff",
  padding: "2px 4px",
  fontWeight: 700,
  width: "calc(100% - 8px)",
  margin: "0 4px 2px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderTop: "2px solid #000000",
});

export {
  Page,
  Header,
  Grid,
  EmptyState,
  EmptyStateText,
  ShowAllButton,
  DeleteConfirmationModal,
  DialogContainer,
  DialogButtonGroup,
  RetroActionButton,
  RetroArrow,
  WrapperCardList,
  SlotCard,
  SlotTop,
  BadgeRow,
  Badge,
  StatusBadge,
  ReleaseButton,
  SpriteWrap,
  SpriteImage,
  SlotName,
};
