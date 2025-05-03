import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

export const EvolutionContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
  width: "100%",
  padding: "16px 0",
  overflowX: "auto",

  ".evolution-chain": {
    display: "flex",
    alignItems: "center",
    gap: 0
  },

  ".evolution-stage": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },

  ".stage-pokemon": {
    display: "flex",
    flexDirection: "column",
    gap: "24px"
  },

  ".evolution-branch": {
    display: "flex",
    alignItems: "center",
    margin: "8px 0"
  },

  ".pokemon-card": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "16px",
    boxShadow: "0px 1px 3px rgba(16, 24, 40, 0.1), 0px 1px 2px rgba(16, 24, 40, 0.06)",
    transition: "transform 0.2s ease-in-out",
    minWidth: "140px",

    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)"
    }
  },

  ".pokemon-id": {
    color: "#6B7280",
    fontSize: "0.75rem"
  },

  ".pokemon-name": {
    fontWeight: 600,
    textTransform: "capitalize",
    marginTop: "4px"
  },

  ".evolution-arrows": {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    padding: "0 16px",
  },

  ".evolution-arrow": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "0 16px",
    width: "80px",

    ".arrow-label": {
      color: "#4B5563",
      marginBottom: "4px",
      fontSize: "0.75rem",
      fontWeight: 500,
      textAlign: "center"
    },

    ".arrow": {
      color: "#6B7280",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "24px"
    }
  }
});
