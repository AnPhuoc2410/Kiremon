import styled from "@emotion/styled";
import { colors } from "@/components/utils";

export const TooltipWrapper = styled("div")({
  fontFamily: '"VT323", monospace',
  fontSize: "20px",
  lineHeight: "1.4",
  color: "#212529",
  zIndex: 10001,
  width: "100%",
});

export const RPGDialogueBox = styled("div")({
  backgroundColor: "#ffffff", // Light mode background matching the web theme
  borderTop: "4px solid #212529", // Thick black top border
  borderBottom: "none",
  borderLeft: "none",
  borderRight: "none",
  padding: "20px 24px",
  boxShadow: "0 -4px 15px rgba(0, 0, 0, 0.08)", // Soft upward shadow
  position: "relative",
  minHeight: "140px",
  width: "100%",
});

export const DialogueContainer = styled("div")({
  display: "flex",
  gap: "24px",
  alignItems: "flex-start",
  width: "100%",
  maxWidth: "1000px",
  margin: "0 auto",
  position: "relative",
});

export const AvatarContainer = styled("div")({
  flexShrink: 0,
  width: "96px",
  height: "96px",
  border: "3px solid #212529", // Black border
  borderRadius: "6px",
  backgroundColor: "#e8e8e0", // Retro beige avatar background
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.1)",
  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    imageRendering: "pixelated",
  },
});

export const DialogueContent = styled("div")({
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  minHeight: "96px",
});

export const SpeakerTitle = styled("div")({
  fontSize: "24px",
  fontWeight: "bold",
  color: "#e3350d", // Pokémon red title
  marginBottom: "6px",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
});

export const DialogueText = styled("p")({
  margin: "0 0 12px 0",
  fontSize: "20px",
  color: "#212529", // Dark text matching site theme
  whiteSpace: "pre-line",
  lineHeight: "1.4",
});

export const DialogueFooter = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "auto",
  width: "100%",
});

export const SkipButton = styled("button")({
  background: "transparent",
  border: "none",
  color: "#777777", // Gray text
  fontSize: "18px",
  cursor: "pointer",
  fontFamily: '"VT323", monospace',
  padding: "4px 8px",
  "&:hover": {
    color: "#e3350d", // Red on hover
    textDecoration: "underline",
  },
});

export const ButtonGroup = styled("div")({
  display: "flex",
  gap: "12px",
});

export const RetroButton = styled("button")<{
  variant?: "primary" | "secondary";
}>(({ variant = "primary" }) => ({
  fontFamily: '"VT323", monospace',
  fontSize: "19px",
  padding: "6px 16px",
  cursor: "pointer",
  border: "2px solid #212529", // Black border
  borderRadius: "4px",
  outline: "none",
  backgroundColor: variant === "primary" ? "#212529" : "#ffffff",
  color: variant === "primary" ? "#ffffff" : "#212529",
  transition: "all 0.1s ease",
  boxShadow: "0 3px 0px rgba(0, 0, 0, 0.15)",
  "&:hover": {
    backgroundColor: variant === "primary" ? "#e3350d" : "#212529", // Red for primary, Black for secondary
    borderColor: variant === "primary" ? "#e3350d" : "#212529",
    color: "#ffffff",
  },
  "&:active": {
    transform: "translateY(2px)",
    boxShadow: "0 1px 0px rgba(0, 0, 0, 0.15)",
  },
}));
