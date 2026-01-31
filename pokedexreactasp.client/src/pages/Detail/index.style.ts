import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { colors, units } from "@/components/utils";

const Page = styled("div")({
  "#pokeball-bg": {
    position: "fixed",

    right: "-64vw",
    top: 0,
    zIndex: -1,
    "@media (min-width: 640px)": {
      right: "-32vw",
    },
    "@media (min-width: 1024px)": {
      right: "-16vw",
    },
  },
});

const PokeName = styled("div")(
  {
    position: "relative",
    height: "40px",
    width: "65vw",
    "@media (min-width: 1024px)": {
      width: "32vw",
    },
    marginTop: units.spacing.xl,
    // Flex layout for name and icon
    display: "flex",
    alignItems: "center",

    h1: {
      textTransform: "uppercase",
      position: "relative", // Changed from absolute to flow with flex
      top: -10, // Adjustment for alignment
      left: 0, // Reset
      marginLeft: "20px",
      zIndex: 2,
      marginRight: "12px", // Space between name and icon
      "@media (min-width: 1024px)": {
        marginLeft: "124px",
      },
    },

    // Speaker Icon Button
    ".cry-btn": {
      zIndex: 2,
      background: "transparent",
      border: "none",
      cursor: "pointer",
      color: "#333", // Default color
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "4px",
      marginTop: "-4px", // Align with text
      transition: "transform 0.1s ease",

      "&:hover": {
        transform: "scale(1.1)",
      },

      "&:active": {
        transform: "scale(0.95)",
      },

      svg: {
        filter: "drop-shadow(1px 1px 0 #fff)", // Contrast
      },
    },
    div: {
      position: "absolute",
      width: "100%",
      background: colors["gray-700"],
      bottom: 0,
    },
    ".genera-text": {
      position: "absolute",
      top: 35,
      left: 24,
      fontSize: "1rem",
      "@media (min-width: 1024px)": {
        left: 128,
      },
    },
  },
  `
    div:nth-of-type(1) {
      height: 1.75rem;
      right: 20px;
    }
    div:nth-of-type(2) {
      height: 1.25rem;
      right: 10px;
    }
    div:nth-of-type(3) {
      height: 0.75rem;
      right: 0;
    }
  `,
);

const Content = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: units.spacing.xl,
  padding: "0 16px",
  maxWidth: "1340px",
  margin: "0 auto",
  h3: {
    marginBottom: units.spacing.base,
  },
});

const ImageContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
  marginBottom: "15px",

  "@media (min-width: 768px)": {
    marginBottom: "20px",
  },
});

const AbilitiesWrapper = styled("div")({
  display: "grid",
  gridTemplateColumns: "repeat(1, 1fr)",

  "> div:nth-of-type(1)": {
    marginBottom: "20px",
  },

  "@media (min-width: 768px)": {
    gridTemplateColumns: "repeat(2, 1fr)",

    "> div:nth-of-type(1)": {
      marginBottom: "0px",
    },
  },
});

const PokemonContainer = styled("div")({
  display: "grid",
  gridTemplateColumns: "1fr",
  maxWidth: "1340px",
  margin: "0 auto",
  alignItems: "center",

  "> div.img-pokemon": {
    order: 1,
  },
  "> div.card-pxl": {
    margin: "0 20px",
    marginTop: "20px",
    order: 2,
  },

  "@media (min-width: 768px)": {
    gridTemplateColumns: "40% 1fr",

    "> div.img-pokemon": {
      order: 2,
    },
    "> div.card-pxl": {
      order: 1,
    },
  },

  "@media (min-width: 1024px)": {
    marginTop: "10px",
    gridTemplateColumns: "30% 1fr",
  },
});

const shake = keyframes`
  0% { transform: translate(0, 0) rotate(0); }
  20% { transform: translate(-10px, 0) rotate(-20deg); }
  30% { transform: translate(10px, 0) rotate(20deg); }
  50% { transform: translate(-10px, 0) rotate(-10deg); }
  60% { transform: translate(10px, 0) rotate(10deg); }
  100% { transform: translate(0, 0) rotate(0); }
`;

const CatchingModal = styled("div")`
  .pokeball {
    animation: ${shake} 1.25s cubic-bezier(0.36, 0.07, 0.19, 0.97) 2;
  }
`;

const PostCatchModal = styled("div")({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  p: {
    textAlign: "center",
  },
});

const NicknamingModal = styled("div")({
  width: "100vw",
  padding: "0 16px",
  "@media (min-width: 1024px)": {
    width: "32vw",
  },
});

const NicknamingForm = styled("form")({
  display: "flex",
  flexDirection: "column",
  gap: units.spacing.base,
});

const DescriptionLoadingWrapper = styled("div")({
  div: {
    justifyContent: "flex-start",
  },
});

export const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  width: 100%;

  p {
    font-size: 1.1rem;
    color: ${colors.text.secondary};
  }
`;

const ImageLoadingWrapper = styled("div")({
  width: 256,
  height: 256,
  display: "grid",
  placeItems: "center",
  margin: "0 auto",
});

const PokemonStatsWrapper = styled("div")({
  marginTop: "20px",
  textAlign: "left",

  "> h4": {
    marginBottom: "10px",
  },
});

const Grid = styled("div")(
  {
    display: "grid",
    columnGap: 8,
    rowGap: 0,
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  },
  `
  @media (min-width: 640px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
  `,
);

const AnotherWrapper = styled("div")({
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  gap: 16,
});

const StatBar = styled("div")<{ value: number; color: string }>(
  ({ value, color }) => ({
    height: "10px",
    width: `${Math.min(value / 1.5, 100)}%`,
    backgroundColor: color,
    borderRadius: "4px",
    transition: "width 0.5s ease-in-out",
  }),
);

const StatContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  marginBottom: "52px",
  ".stat-name": {
    width: "120px",
    textTransform: "capitalize",
  },
  ".stat-value": {
    width: "40px",
    textAlign: "right",
    marginRight: "8px",
  },
  ".stat-bar-container": {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: "4px",
  },
});

const InfoSection = styled("div")({
  display: "flex",
  flexWrap: "wrap",
  gap: "16px",
  padding: "16px",
  borderRadius: "8px",
  backgroundColor: "#FAFAFA",
  margin: "16px 0",
  boxShadow: "4px 4px 0 #E5E7EB",

  ".info-item": {
    flex: "1 1 150px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  ".info-label": {
    fontSize: "1.5rem",
    color: "#6B7280",
    textTransform: "uppercase",
  },

  ".info-value": {
    fontSize: "1.25rem",
    fontWeight: "700",
    color: "#1F2937",
  },
});

const SpriteGallery = styled("div")({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: "20px",
  marginTop: "16px",

  ".sprite-item": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },

  ".sprite-label": {
    fontSize: "1rem",
    color: "#6B7280",
    textAlign: "center",
  },
});

const FlavorTextBox = styled("div")({
  padding: "16px",
  backgroundColor: "transparent",
  fontStyle: "italic",
  position: "relative",
  margin: "12px 0",
  p: {
    padding: "0 12px",
    lineHeight: "1.6",
    fontSize: "1.3rem",
    fontWeight: "800",
    color: "#374151",
    textAlign: "center",
  },
});

const TabsContainer = styled("div")({
  display: "flex",
  borderBottom: "2px solid #E5E7EB",
  marginBottom: "20px",
  overflowX: "auto",
  gap: "2px",

  ".tab": {
    padding: "12px 16px",
    cursor: "pointer",
    whiteSpace: "nowrap",
    borderBottom: "3px solid transparent",
    transition: "all 0.3s ease",

    p: {
      fontSize: "1rem",
      fontWeight: "600",
      color: "#6B7280",
    },

    "&.active": {
      borderBottomColor: "#3B82F6",

      p: {
        color: "#1E40AF",
        fontWeight: "700",
      },
    },

    "&:hover:not(.active)": {
      p: {
        color: "#374151",
      },
    },
  },
});

const SoundBar = styled("div")({
  width: "100%",
  height: "30px",
  marginTop: "8px",
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "15px",
  overflow: "hidden",
  backgroundColor: "rgba(0, 0, 0, 0.1)",
  cursor: "pointer",

  ".sound-bar-progress": {
    position: "absolute",
    height: "100%",
    left: 0,
    top: 0,
    backgroundColor: "#FF5555",
    transition: "width 0.1s linear",
  },

  ".sound-bar-visualization": {
    display: "flex",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    padding: "0 8px",
    justifyContent: "space-between",
  },

  ".sound-bar-line": {
    width: "3px",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    height: "40%",
    borderRadius: "2px",
    transformOrigin: "center bottom",
    transition: "transform 0.1s ease",
  },
});

const badgeGlowLegendary = keyframes`
  0%, 100% {
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2), 0 0 25px rgba(245, 158, 11, 0.7), 0 0 45px rgba(245, 158, 11, 0.4), 0 0 65px rgba(245, 158, 11, 0.2);
  }
  50% {
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2), 0 0 35px rgba(245, 158, 11, 0.9), 0 0 55px rgba(245, 158, 11, 0.6), 0 0 80px rgba(245, 158, 11, 0.3);
  }
`;

const badgeGlowMythical = keyframes`
  0%, 100% {
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2), 0 0 25px rgba(139, 92, 246, 0.7), 0 0 45px rgba(139, 92, 246, 0.4), 0 0 65px rgba(139, 92, 246, 0.2);
  }
  50% {
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2), 0 0 35px rgba(139, 92, 246, 0.9), 0 0 55px rgba(139, 92, 246, 0.6), 0 0 80px rgba(139, 92, 246, 0.3);
  }
`;

const ClassificationText = styled("div")<{
  isLegendary?: boolean;
  isMythical?: boolean;
}>`
  background-color: ${(props) => (props.isLegendary ? "#F59E0B" : "#8B5CF6")};
  color: white;
  text-transform: capitalize;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.875rem;
  padding: 4px 12px;
  letter-spacing: 0.5px;
  margin-bottom: 12px;

  box-shadow: ${(props) =>
    props.isLegendary
      ? "0px 1px 2px rgba(0, 0, 0, 0.2), 0 0 25px rgba(245, 158, 11, 0.7)"
      : "0px 1px 2px rgba(0, 0, 0, 0.2), 0 0 25px rgba(139, 92, 246, 0.7)"};
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
  animation: ${(props) =>
      props.isLegendary ? badgeGlowLegendary : badgeGlowMythical}
    2s ease-in-out infinite;

  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(
      rgba(255, 255, 255, 0.15),
      rgba(255, 255, 255, 0)
    );
    border-radius: 6px 6px 0 0;
  }

  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }

  @media (max-width: 640px) {
    font-size: 0.75rem;
    padding: 2px 8px;
  }
`;

// Pokemon Image Wrapper - simple wrapper
const PokemonImageWrapper = styled("div")`
  position: relative;
  display: inline-block;
`;

export {
  Content,
  Page,
  PokeName,
  CatchingModal,
  PostCatchModal,
  NicknamingForm,
  NicknamingModal,
  DescriptionLoadingWrapper,
  ImageLoadingWrapper,
  Grid,
  ImageContainer,
  AnotherWrapper,
  PokemonContainer,
  PokemonStatsWrapper,
  AbilitiesWrapper,
  StatBar,
  StatContainer,
  InfoSection,
  SpriteGallery,
  FlavorTextBox,
  TabsContainer,
  SoundBar,
  ClassificationText,
  PokemonImageWrapper,
};
