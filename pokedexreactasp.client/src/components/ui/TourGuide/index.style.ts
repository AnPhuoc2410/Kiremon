import styled from "@emotion/styled";
import { colors } from "@/components/utils";

export const TooltipWrapper = styled("div")({
  fontFamily: '"VT323", monospace',
  fontSize: "18px",
  lineHeight: "1.3",
  color: "#212529",
  maxWidth: "480px",
  width: "90vw",
  zIndex: 10000,
});

export const DialogueBubble = styled("div")({
  backgroundColor: "#ffffff",
  border: "4px solid #212529", // Thick black outline
  borderRadius: "20px",
  padding: "16px 20px",
  boxShadow: "0 6px 0px rgba(0, 0, 0, 0.15)", // Retro shadow
  position: "relative",
  minHeight: "100px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
});

export const BubbleTailContainer = styled("div")({
  position: "relative",
  marginLeft: "50px", // Align with avatar position
  marginTop: "-4px", // Overlap bubble border (4px border)
  zIndex: 2, // Render above the bubble's border
});

export const AvatarRow = styled("div")({
  display: "flex",
  justifyContent: "flex-start",
  paddingLeft: "30px", // Put avatar directly under the tail tip
  zIndex: 1,
});

export const AvatarContainer = styled("div")({
  flexShrink: 0,
  width: "76px",
  height: "76px",
  border: "3px solid #212529",
  borderRadius: "12px",
  backgroundColor: "#e8e8e0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  boxShadow: "3px 3px 0px rgba(0, 0, 0, 0.1), inset -2px -2px 0px #c0c0b8",
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
});

export const SpeakerTitle = styled("div")({
  fontSize: "20px",
  fontWeight: "bold",
  color: "#e3350d", // Pokémon red
  marginBottom: "4px",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
});

export const DialogueText = styled("p")({
  margin: "0 0 16px 0",
  fontSize: "19px",
  color: "#333333",
  whiteSpace: "pre-line",
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
  color: "#888888",
  fontSize: "16px",
  cursor: "pointer",
  fontFamily: '"VT323", monospace',
  padding: "4px 8px",
  "&:hover": {
    color: "#e3350d",
    textDecoration: "underline",
  },
});

export const ButtonGroup = styled("div")({
  display: "flex",
  gap: "8px",
});

export const RetroButton = styled("button")<{
  variant?: "primary" | "secondary";
}>(({ variant = "primary" }) => ({
  fontFamily: '"VT323", monospace',
  fontSize: "18px",
  padding: "6px 14px",
  cursor: "pointer",
  border: "3px solid #212529",
  borderRadius: "6px",
  outline: "none",
  backgroundColor: variant === "primary" ? "#4dad5b" : "#f8f9fa", // Green or White
  color: variant === "primary" ? "#ffffff" : "#212529",
  boxShadow:
    variant === "primary"
      ? "0 4px 0px #2a6a33, inset -2px -2px 0px #3c8f49, inset 2px 2px 0px #82cf8d"
      : "0 4px 0px #888888, inset -2px -2px 0px #d0d0d0, inset 2px 2px 0px #ffffff",
  transition: "transform 0.1s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    backgroundColor: variant === "primary" ? "#5cb86a" : "#ffffff",
  },
  "&:active": {
    transform: "translateY(2px)",
    boxShadow: "0 0px 0px, inset -2px -2px 0px rgba(0,0,0,0.1)",
  },
}));

// Pulsing red indicator for clicking next
export const NextIndicator = styled("div")({
  width: "0",
  height: "0",
  borderLeft: "6px solid transparent",
  borderRight: "6px solid transparent",
  borderTop: "8px solid #e3350d",
  position: "absolute",
  bottom: "8px",
  right: "12px",
  animation: "pulse 0.8s infinite alternate",
  "@keyframes pulse": {
    from: {
      transform: "translateY(0)",
    },
    to: {
      transform: "translateY(4px)",
    },
  },
});
