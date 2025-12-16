import styled from "@emotion/styled";
import { units } from "../../components/utils";

export const Container = styled.section`
  max-width: ${units.screenSize["xl"]};
  margin: 0 auto;
  padding: 10px 16px;
  text-align: center;

  @media screen and (min-width: ${units.screenSize["xl"]}) {
    padding: 10px 0;
  }
`;

export const Grid = styled("div")({
  display: "grid",
  gap: "16px",
  margin: "16px 0",
  "@media (min-width: 640px)": {
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  },
  "@media (min-width: 1024px)": {
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  },
  "@media (min-width: 1280px)": {
    gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
  },
});

export const Footer = styled("footer")({
  display: "flex",
  paddingTop: 24,
});

// Scroll to Top Button
export const ScrollToTop = styled.button`
  position: fixed;
  bottom: 100px;
  right: 24px;
  width: 80px;
  height: 80px;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transform: translateY(20px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  padding: 0;

  &.visible {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  &:hover {
    transform: translateY(-8px) scale(1.1);

    img {
      filter: drop-shadow(0 4px 8px rgba(239, 68, 68, 0.3));
      animation: pokeball-spin 0.6s ease-in-out;
    }
  }

  &:active {
    transform: translateY(-4px) scale(1.05);
  }

  @media (max-width: 768px) {
    bottom: 80px;
    right: 16px;
    width: 64px;
    height: 64px;
  }
`;

export const PokeballImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  animation: pokeball-bounce 2s ease-in-out infinite;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.15));
  transition: filter 0.3s ease;

  @keyframes pokeball-bounce {
    0%,
    100% {
      transform: translateY(0) rotate(0deg);
    }
    50% {
      transform: translateY(-4px) rotate(5deg);
    }
  }

  @keyframes pokeball-spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const FallbackIcon = styled.div`
  font-size: 32px;
  font-weight: bold;
  color: #ef4444;
  animation: arrow-bounce 1.5s ease-in-out infinite;

  @keyframes arrow-bounce {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-4px);
    }
  }
`;
