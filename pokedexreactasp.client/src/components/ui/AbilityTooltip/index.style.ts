import styled from "@emotion/styled";

export const TooltipContainer = styled("div")({
  position: "relative",
  display: "flex",
  width: "100%",
  cursor: "help",
  "&:hover .tooltip-content": {
    opacity: 1,
    visibility: "visible",
    transform: "translateX(-50%) translateY(0)",
  },
});

export const TooltipContent = styled("div")({
  position: "absolute",
  bottom: "calc(100% + 8px)",
  left: "50%",
  transform: "translateX(-50%) translateY(5px)",
  background: "rgba(15, 23, 42, 0.95)",
  backdropFilter: "blur(8px)",
  color: "#ffffff",
  borderRadius: "8px",
  width: "250px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
  zIndex: 100,
  opacity: 0,
  visibility: "hidden",
  transition: "all 0.2s ease-in-out",
  pointerEvents: "none",
  display: "flex",
  flexDirection: "column",
  border: "1px solid rgba(255, 255, 255, 0.15)",
  "&::after": {
    content: '""',
    position: "absolute",
    top: "100%",
    left: "50%",
    marginLeft: "-8px",
    borderWidth: "8px",
    borderStyle: "solid",
    borderColor: "rgba(15, 23, 42, 0.95) transparent transparent transparent",
  },
});

export const TooltipHeader = styled("div")({
  padding: "8px 12px",
  background: "rgba(255, 255, 255, 0.05)",
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  borderTopLeftRadius: "8px",
  borderTopRightRadius: "8px",
  textAlign: "center",
  ".title": {
    fontFamily: '"Press Start 2P", monospace',
    fontSize: "0.55rem",
    color: "#38bdf8",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
});

export const TooltipBody = styled("div")({
  padding: "12px 14px",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  textAlign: "center",
});

export const ShortEffect = styled("p")({
  margin: 0,
  fontFamily: '"Outfit", "Inter", sans-serif',
  fontSize: "0.75rem",
  fontWeight: 500,
  color: "#f8fafc",
  lineHeight: 1.5,
  textTransform: "none",
});

export const FullEffect = styled("p")({
  margin: 0,
  fontFamily: '"Outfit", "Inter", sans-serif',
  fontSize: "0.7rem",
  color: "#94a3b8",
  lineHeight: 1.5,
  paddingTop: "8px",
  borderTop: "1px dashed rgba(255, 255, 255, 0.1)",
  textTransform: "none",
});

export const FlavorText = styled("p")({
  margin: 0,
  fontFamily: '"Outfit", "Inter", sans-serif',
  fontSize: "0.75rem",
  color: "#94a3b8",
  lineHeight: 1.5,
  fontStyle: "italic",
  textTransform: "none",
});
