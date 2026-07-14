import React, { useState, useEffect, FormEvent } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useNavigate } from "react-router-dom";

import { Text, Header } from "@/components/ui";
import Button from "@/components/ui/Button";
import { pokemonService } from "@/services";
import {
  GameContainer,
  GameCard,
  PokemonImage,
  SilhouetteWrapper,
  ScoreDisplay,
  GuessForm,
  GuessInput,
  ResultMessage,
  ButtonsContainer,
} from "./index.style";

// Pokémon gen 1-8 range (stable sprites)
const POKEMON_MAX_ID = 898;

const getRandomPokemonId = () => Math.floor(Math.random() * POKEMON_MAX_ID) + 1;

const WhosThatPokemon: React.FC = () => {
  const [pokemonList, setPokemonList] = useState<
    { name: string; url: string }[]
  >([]);
  const [pokemonName, setPokemonName] = useState<string>("");
  const [spriteUrl, setSpriteUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [guess, setGuess] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | undefined>(undefined);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const navigate = useNavigate();

  // Load the full list of pokemon once to prevent exposing the current pokemon's name in network tab
  useEffect(() => {
    const fetchList = async () => {
      try {
        const res = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=" + POKEMON_MAX_ID,
        );
        const data = await res.json();
        setPokemonList(data.results);
      } catch (err) {
        console.error("Failed to load pokemon list:", err);
      }
    };
    fetchList();
  }, []);

  const loadRandomPokemon = async () => {
    if (pokemonList.length === 0) return;

    setLoading(true);
    setRevealed(false);
    setIsCorrect(undefined);
    setGuess("");

    try {
      const randomId = getRandomPokemonId();
      const pokemon = pokemonList[randomId - 1]; // 0-indexed

      if (pokemon) {
        setPokemonName(pokemon.name);
        const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${randomId}.png`;
        setSpriteUrl(sprite);
      }
    } catch (error) {
      console.error("Failed to load Pokemon:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pokemonList.length > 0 && !pokemonName) {
      loadRandomPokemon();
    }
  }, [pokemonList]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!pokemonName || revealed) return;

    setTotalAttempts((prev) => prev + 1);
    const normalizedGuess = guess.trim().toLowerCase();
    const correct = normalizedGuess === pokemonName.toLowerCase();

    setIsCorrect(correct);
    setRevealed(true);

    if (correct) {
      setScore((prev) => prev + 1);
    }
  };

  return (
    <>
      <Header
        title="Who's That Pokémon?"
        subtitle="Guess the Pokémon from its silhouette!"
        backTo="/"
      />
      <GameContainer>
        <GameCard className="pxl-border">
          {loading ? (
            <Text>Loading...</Text>
          ) : (
            <>
              <ScoreDisplay>
                Score: {score} / {totalAttempts}
              </ScoreDisplay>

              <PokemonImage>
                {spriteUrl && (
                  <SilhouetteWrapper className={revealed ? "revealed" : ""}>
                    <LazyLoadImage
                      src={spriteUrl}
                      alt="Mystery Pokemon"
                      width={250}
                      height={250}
                    />
                  </SilhouetteWrapper>
                )}
              </PokemonImage>

              {!revealed ? (
                <GuessForm onSubmit={handleSubmit}>
                  <GuessInput
                    type="text"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    placeholder="Enter Pokemon name"
                    className="pxl-border"
                    autoComplete="off"
                  />
                  <Button type="submit" variant="sky">
                    Submit Guess
                  </Button>
                </GuessForm>
              ) : (
                <>
                  <ResultMessage isCorrect={isCorrect}>
                    {isCorrect
                      ? "Correct! Well done!"
                      : `Incorrect. It's ${pokemonName.toUpperCase()}!`}
                  </ResultMessage>

                  <ButtonsContainer>
                    <Button onClick={loadRandomPokemon} variant="sky">
                      Next Pokemon
                    </Button>
                    <Button
                      onClick={() => navigate(`/pokemon/${pokemonName}`)}
                      variant="light"
                    >
                      View Details
                    </Button>
                  </ButtonsContainer>
                </>
              )}
            </>
          )}
        </GameCard>
      </GameContainer>
    </>
  );
};

export default WhosThatPokemon;
