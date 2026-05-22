import styled from "@emotion/styled";
import { colors } from "@/components/utils";

export const FloatingTourButton = styled("button")({
  position: "fixed",
  bottom: "24px",
  right: "24px",
  zIndex: 9999,
  background: "#e3350d", // Pokeball Red
  color: "#ffffff",
  border: "4px solid #212529",
  borderRadius: "50%",
  width: "64px",
  height: "64px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  boxShadow:
    "0 6px 0px rgba(0, 0, 0, 0.2), inset -4px -4px 0px #b02508, inset 4px 4px 0px #ff6f52",
  transition: "transform 0.1s ease, bottom 0.3s ease",
  fontFamily: '"VT323", monospace',
  fontSize: "14px",
  fontWeight: "bold",
  padding: "0",
  outline: "none",
  "&:hover": {
    transform: "scale(1.1) rotate(10deg)",
  },
  "&:active": {
    transform: "scale(0.95)",
    boxShadow: "0 2px 0px rgba(0, 0, 0, 0.2), inset -4px -4px 0px #b02508",
  },
  // Split lines style for Pokeball look
  "&::before": {
    content: '""',
    position: "absolute",
    width: "100%",
    height: "4px",
    background: "#212529",
    top: "calc(50% - 2px)",
    left: "0",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    width: "16px",
    height: "16px",
    background: "#ffffff",
    border: "3px solid #212529",
    borderRadius: "50%",
    top: "calc(50% - 8px)",
    left: "calc(50% - 8px)",
    zIndex: 1,
  },
});

export const FloatingTourText = styled("span")({
  position: "absolute",
  bottom: "-25px",
  background: "#212529",
  color: "#f8f9fa",
  padding: "2px 8px",
  borderRadius: "4px",
  fontSize: "12px",
  whiteSpace: "nowrap",
  border: "2px solid #ffffff",
  boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
});

export const TooltipWrapper = styled("div")({
  fontFamily: '"VT323", monospace',
  fontSize: "18px",
  lineHeight: "1.3",
  color: "#212529",
  maxWidth: "480px",
  width: "90vw",
  zIndex: 10000,
});

export const DialogueBox = styled("div")({
  backgroundColor: "#f5f5f0", // Gameboy/DS dialog background
  border: "6px solid #4b3d30", // Dark wooden/metallic outer bezel
  borderRadius: "12px",
  padding: "4px",
  boxShadow:
    "0 8px 16px rgba(0,0,0,0.3), inset -4px -4px 0px #352a20, inset 4px 4px 0px #6d5b4a",
  position: "relative",
});

export const DialogueInner = styled("div")({
  backgroundColor: "#ffffff",
  border: "4px solid #212529", // Double border outline
  borderRadius: "8px",
  padding: "16px",
  display: "flex",
  gap: "16px",
  minHeight: "120px",
  boxShadow: "inset -3px -3px 0px #e0e0d8",
  "@media (max-width: 480px)": {
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: "10px",
  },
});

export const AvatarContainer = styled("div")({
  flexShrink: 0,
  width: "80px",
  height: "80px",
  border: "3px solid #212529",
  borderRadius: "8px",
  backgroundColor: "#e8e8e0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  boxShadow: "2px 2px 0px #888880, inset -2px -2px 0px #c0c0b8",
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
