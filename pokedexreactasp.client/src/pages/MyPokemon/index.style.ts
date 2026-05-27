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
  height: "50vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: units.spacing.base,
});

const DeleteConfirmationModal = styled("div")({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: 32,
  padding: "0 16px",
  "div:last-child": {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
});

const WrapperCardList = styled("div")({
  position: "relative",
});

const SlotCard = styled("button")({
  width: "100%",
  aspectRatio: "1 / 0.92",
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
  marginBottom: 5,
});

const SpriteImage = styled("img")({
  width: 88,
  height: 88,
  objectFit: "contain",
  imageRendering: "pixelated",
  msInterpolationMode: "nearest-neighbor",
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
  padding: "3px 4px",
  fontWeight: 700,
  width: "calc(100% - 4px)",
  margin: "0 2px 2px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export {
  Page,
  Header,
  Grid,
  EmptyState,
  DeleteConfirmationModal,
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
