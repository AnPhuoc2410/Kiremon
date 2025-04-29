import React from "react";
import { useNavigate } from "react-router-dom";

import { Text, Button } from "../../components/ui";

import * as T from "./index.style";

const StartScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <T.Container>
      <T.Centering>
        <Text as="h1" variant="outlined" size="xl">
          Pokémon Game
        </Text>
        <Button onClick={() => navigate("/pokemons")} variant="light">
          Press Start
        </Button>
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
          <T.A href="https://github.com/AnPhuoc2410/PokeBattle" target="_blank">
            GitHub
          </T.A>
        </Text>
      </div>
    </T.Container>
  );
};

export default StartScreen;
