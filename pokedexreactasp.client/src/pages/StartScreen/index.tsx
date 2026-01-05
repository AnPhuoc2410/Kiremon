import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Text, Button } from "../../components/ui";

import * as T from "./index.style";

const StartScreen: React.FC = () => {
  const navigate = useNavigate();
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  // Set random background on first load
  useEffect(() => {
    setCurrentBgIndex(T.getRandomBackgroundIndex());
  }, []);

  const handlePrevBackground = () => {
    setCurrentBgIndex((prev) => 
      prev === 0 ? T.backgroundImages.length - 1 : prev - 1
    );
  };

  const handleNextBackground = () => {
    setCurrentBgIndex((prev) => 
      prev === T.backgroundImages.length - 1 ? 0 : prev + 1
    );
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrevBackground();
      } else if (e.key === "ArrowRight") {
        handleNextBackground();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handlePrevBackground, handleNextBackground]);

  return (
    <T.Container backgroundUrl={T.backgroundImages[currentBgIndex]}>
      {/* Left Navigation Button */}
      <T.BackgroundNavButton direction="left" onClick={handlePrevBackground}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </T.BackgroundNavButton>

      {/* Right Navigation Button */}
      <T.BackgroundNavButton direction="right" onClick={handleNextBackground}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </T.BackgroundNavButton>

      <T.Centering>
        <Text as="h1" variant="outlined" size="xl">
          Pokémon Game
        </Text>
        <Button onClick={() => navigate("/pokemons")} variant="light">
          Press Start
        </Button>
        <Text variant="outlined" size="base">
          Source API{" "}
          <T.A href="https://pokeapi.co" target="_blank">
            here
          </T.A>
        </Text>
      </T.Centering>

      <div
        style={{
          position: "absolute",
          bottom: 18,
          display: "flex",
          alignItems: "center",
          gap: "5px",
        }}>
        <Text variant="outlined">&copy;{new Date().getFullYear()} Sheme</Text>
        <Text variant="outlined">
          | Want to contribute?{" "}
          <T.A href="https://github.com/AnPhuoc2410/Kiremon" target="_blank">
            GitHub
          </T.A>
        </Text>
      </div>
    </T.Container>
  );
};

export default StartScreen;
