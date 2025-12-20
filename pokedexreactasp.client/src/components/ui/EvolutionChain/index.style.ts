import styled from "@emotion/styled";

export const EvolutionContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
  width: "100%",
  padding: "24px 16px",
  overflowX: "auto",
  overflowY: "visible",

  // Linear chain layout
  ".linear-chain": {
    display: "flex",
    alignItems: "center",
    gap: 0,
    flexWrap: "wrap",
    justifyContent: "center"
  },

  ".evolution-stage": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },

  // Pokemon card styles
  ".pokemon-card": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "16px 20px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)",
    transition: "all 0.25s ease",
    border: "2px solid transparent",
    textDecoration: "none",
    minWidth: "120px",

    "&:hover": {
      transform: "translateY(-6px)",
      boxShadow: "0 12px 24px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.06)",
      borderColor: "#e0e0e0"
    },

    "img": {
      imageRendering: "pixelated",
      transition: "transform 0.2s ease"
    },

    "&:hover img": {
      transform: "scale(1.1)"
    }
  },

  ".pokemon-card--small": {
    padding: "12px 16px",
    minWidth: "100px",

    ".pokemon-id": {
      fontSize: "0.7rem"
    },
    ".pokemon-name": {
      fontSize: "0.85rem"
    }
  },

  ".pokemon-card--large": {
    padding: "20px 24px",
    minWidth: "140px",
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.1), 0 3px 6px rgba(0, 0, 0, 0.06)",

    ".pokemon-id": {
      fontSize: "0.8rem"
    },
    ".pokemon-name": {
      fontSize: "1.1rem"
    }
  },

  ".pokemon-id": {
    color: "#9CA3AF",
    fontSize: "0.75rem",
    fontWeight: 500,
    marginTop: "4px"
  },

  ".pokemon-name": {
    fontWeight: 600,
    textTransform: "capitalize",
    marginTop: "2px",
    color: "#1F2937",
    fontSize: "0.95rem"
  },

  // Evolution arrow styles
  ".evolution-arrow": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "0 12px",
    minWidth: "90px",

    ".arrow-content": {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "4px"
    },

    ".item-sprite": {
      width: "32px",
      height: "32px",
      imageRendering: "pixelated",
      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
    },

    ".trigger-text": {
      color: "#6B7280",
      fontSize: "1rem",
      fontWeight: 500,
      textAlign: "center",
      textTransform: "capitalize",
      maxWidth: "100px",
      lineHeight: 1.3
    },

    ".arrow-symbol": {
      color: "#9CA3AF",
      fontSize: "24px",
      fontWeight: 300,
      transition: "color 0.2s ease"
    }
  },

  ".evolution-arrow--diagonal-up": {
    ".arrow-symbol": {
      transform: "rotate(-30deg)"
    }
  },

  ".evolution-arrow--diagonal-down": {
    ".arrow-symbol": {
      transform: "rotate(30deg)"
    }
  },

  // Split evolution (2 branches)
  ".split-evolution": {
    display: "flex",
    flexDirection: "column",
    gap: "24px"
  },

  ".split-branch": {
    display: "flex",
    alignItems: "center",

    ".branch-content": {
      display: "flex",
      alignItems: "center"
    }
  },

  ".split-branch--top": {
    alignItems: "flex-end",
    marginBottom: "8px"
  },

  ".split-branch--bottom": {
    alignItems: "flex-start",
    marginTop: "8px"
  },

  // Radial layout for branching evolutions (like Eevee)
  "&.radial-layout": {
    minHeight: "880px",
    padding: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflowX: "auto"
  },

  ".radial-chain": {
    position: "relative",
    flexShrink: 0
  },

  ".radial-svg": {
    pointerEvents: "none",
    overflow: "visible"
  },

  ".radial-center": {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 1,

    ".pokemon-card": {
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.08)",
      border: "3px solid #FFD700"
    }
  },

  ".radial-branch": {
    position: "absolute",
    zIndex: 1
  },

  // SVG Arrow styles
  ".arrow-group": {
    ".arrow-label-container": {
      overflow: "visible"
    }
  },

  ".arrow-label-wrapper": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    borderRadius: "8px",
    padding: "6px 10px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
    gap: "3px"
  },

  ".item-sprite-svg": {
    width: "32px",
    height: "32px",
    imageRendering: "pixelated"
  },

  ".arrow-label-text": {
    fontSize: "0.75rem",
    color: "#374151",
    fontWeight: 600,
    textAlign: "center",
    textTransform: "capitalize",
    lineHeight: 1.2,
    maxWidth: "100px"
  },

  // Responsive adjustments
  "@media (max-width: 768px)": {
    ".radial-chain": {
      width: "400px",
      height: "400px",
      transform: "scale(0.8)",
      transformOrigin: "center center"
    },

    ".linear-chain": {
      flexDirection: "column",
      gap: "16px"
    },

    ".split-evolution": {
      flexDirection: "column"
    },

    ".evolution-arrow": {
      margin: "8px 0",

      ".arrow-symbol": {
        transform: "rotate(90deg)"
      }
    },

    ".evolution-arrow--diagonal-up, .evolution-arrow--diagonal-down": {
      ".arrow-symbol": {
        transform: "rotate(90deg)"
      }
    }
  }
});

