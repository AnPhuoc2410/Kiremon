import styled from "@emotion/styled";
import { units } from "@/components/utils";

const Page = styled("div")({
  maxWidth: "1440px",
  margin: "0 auto",
  padding: "0 16px 96px",
  "@media (min-width: 1024px)": {
    padding: "0 32px 96px",
  },
});

const Header = styled("header")({
  display: "flex",
  flexDirection: "column",
  gap: units.spacing.base,
  margin: "20px 0 24px",
  padding: "20px",
  borderRadius: "20px",
  background: "rgba(255, 255, 255, 0.72)",
  border: "1px solid rgba(148, 163, 184, 0.18)",
  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
  backdropFilter: "blur(10px)",
  "@media (min-width: 768px)": {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  // Controls/filters container on the right
  ".controls": {
    display: "flex",
    gap: 8,
    alignItems: "center",
    background: "rgba(0,0,0,0.04)",
    padding: "6px",
    borderRadius: 8,
  },
});

const HeaderCopy = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: units.spacing.xs,
  maxWidth: "42rem",
});

const StatsRow = styled("div")({
  display: "flex",
  flexWrap: "wrap",
  gap: units.spacing.sm,
  alignItems: "center",
});

const StatChip = styled("span")({
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "6px 10px",
  borderRadius: "999px",
  background: "rgba(59, 130, 246, 0.12)",
  color: "#1e293b",
  fontSize: "0.875rem",
  lineHeight: 1,
});

const FilterBar = styled("div")({
  display: "inline-flex",
  gap: 8,
  padding: 6,
  borderRadius: 999,
  background: "rgba(15, 23, 42, 0.04)",
  border: "1px solid rgba(148, 163, 184, 0.2)",
});

const FilterButton = styled("button")<{ active?: boolean }>(({ active }) => ({
  border: "none",
  cursor: "pointer",
  padding: "10px 14px",
  borderRadius: 999,
  background: active ? "#0f172a" : "transparent",
  color: active ? "#ffffff" : "#334155",
  fontSize: "0.95rem",
  lineHeight: 1,
  boxShadow: active ? "0 8px 18px rgba(15, 23, 42, 0.18)" : "none",
  transition:
    "background-color 160ms ease, color 160ms ease, transform 160ms ease, box-shadow 160ms ease",
  "&:hover": {
    transform: "translateY(-1px)",
    backgroundColor: active ? "#0f172a" : "rgba(255, 255, 255, 0.9)",
  },
  "&:focus-visible": {
    outline: "2px solid #0f172a",
    outlineOffset: 2,
  },
}));

const Grid = styled("div")({
  display: "grid",
  gap: "20px",
  gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
  alignItems: "start",
});

const EmptyState = styled("div")({
  minHeight: "50vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: units.spacing.base,
  background: "linear-gradient(180deg, rgba(255,255,255,0.02), transparent)",
  padding: 24,
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.04)",
});

const EmptyPanel = styled("section")({
  width: "100%",
  maxWidth: "720px",
  display: "grid",
  gap: units.spacing.base,
  padding: "28px",
  borderRadius: "24px",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(248,250,252,0.96))",
  border: "1px solid rgba(148, 163, 184, 0.18)",
  boxShadow: "0 20px 50px rgba(15, 23, 42, 0.08)",
});

const EmptyStateInner = styled("div")({
  display: "grid",
  gap: units.spacing.sm,
  textAlign: "center",
});

const EmptyActions = styled("div")({
  display: "flex",
  flexWrap: "wrap",
  gap: units.spacing.sm,
  justifyContent: "center",
});

const AuthPanel = styled("section")({
  marginTop: units.spacing.base,
  padding: "20px",
  borderRadius: "20px",
  background: "rgba(15, 23, 42, 0.96)",
  color: "#e2e8f0",
  display: "grid",
  gap: units.spacing.sm,
  border: "1px solid rgba(148, 163, 184, 0.18)",
  boxShadow: "0 20px 40px rgba(15, 23, 42, 0.18)",
});

const AuthActions = styled("div")({
  display: "flex",
  justifyContent: "center",
  marginTop: units.spacing.sm,
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

const RetroActionButton = styled("button")<{
  isDanger?: boolean;
  isActive?: boolean;
}>(({ isDanger, isActive }) => ({
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
}));

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
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  gap: 8,
  width: "100%",

  // ensure PokeCard expands within the grid cell
  "> *": {
    width: "100%",
  },
});

const CardChrome = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: units.spacing.sm,
  width: "100%",
});

const CardMeta = styled("div")({
  display: "flex",
  flexWrap: "wrap",
  gap: 6,
  justifyContent: "center",
});

const Badge = styled("span")<{ tone?: "gold" | "blue" | "green" | "violet" }>(({
  tone = "blue",
}) => {
  const tones = {
    gold: {
      backgroundColor: "rgba(251, 191, 36, 0.18)",
      color: "#92400e",
      borderColor: "rgba(251, 191, 36, 0.3)",
    },
    blue: {
      backgroundColor: "rgba(96, 165, 250, 0.18)",
      color: "#1d4ed8",
      borderColor: "rgba(96, 165, 250, 0.3)",
    },
    green: {
      backgroundColor: "rgba(52, 211, 153, 0.18)",
      color: "#065f46",
      borderColor: "rgba(52, 211, 153, 0.3)",
    },
    violet: {
      backgroundColor: "rgba(129, 140, 248, 0.18)",
      color: "#3730a3",
      borderColor: "rgba(129, 140, 248, 0.3)",
    },
  } as const;

  return {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 8px",
    borderRadius: 999,
    fontSize: "0.75rem",
    lineHeight: 1,
    border: "1px solid transparent",
    ...tones[tone],
  };
});

const CardActions = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: units.spacing.sm,
  paddingTop: units.spacing.xs,
  borderTop: "1px solid rgba(148, 163, 184, 0.16)",
});

const FavoriteButton = styled("button")({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 40,
  height: 40,
  border: "1px solid rgba(148, 163, 184, 0.2)",
  borderRadius: 12,
  background: "rgba(255, 255, 255, 0.9)",
  cursor: "pointer",
  fontSize: 18,
  lineHeight: 1,
  transition:
    "transform 160ms ease, background-color 160ms ease, box-shadow 160ms ease",
  "&:hover": {
    transform: "translateY(-1px)",
    backgroundColor: "#ffffff",
  },
  "&:active": {
    transform: "translateY(1px)",
  },
  "&:focus-visible": {
    outline: "2px solid #0f172a",
    outlineOffset: 2,
  },
});

export {
  Page,
  Header,
  HeaderCopy,
  StatsRow,
  StatChip,
  FilterBar,
  FilterButton,
  Grid,
  EmptyState,
  EmptyPanel,
  EmptyStateInner,
  EmptyActions,
  AuthPanel,
  AuthActions,
  DeleteConfirmationModal,
  DialogContainer,
  DialogButtonGroup,
  RetroActionButton,
  RetroArrow,
  WrapperCardList,
  CardChrome,
  CardMeta,
  Badge,
  CardActions,
  FavoriteButton,
};
