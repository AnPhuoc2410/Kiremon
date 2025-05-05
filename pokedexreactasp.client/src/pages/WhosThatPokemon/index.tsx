import React, { useState, useEffect, FormEvent } from 'react';
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useNavigate } from 'react-router-dom';

import { Text } from '../../components/ui';
import Button from '../../components/ui/Button';
import { getAllPokemon, getDetailPokemon } from '../../services/pokemon';
import { IPokemon } from '../../types/pokemon';
import {
  GameContainer,
  GameCard,
  PokemonImage,
  SilhouetteWrapper,
  ScoreDisplay,
  GuessForm,
  GuessInput,
  ResultMessage,
  ButtonsContainer
} from './index.style';

// Extend the base IPokemon interface with the sprites property we need for this game
interface GamePokemon extends IPokemon {
  sprites?: {
    other: {
      "official-artwork": {
        front_default: string;
      }
    }
  };
}

const WhosThatPokemon: React.FC = () => {
  const [currentPokemon, setCurrentPokemon] = useState<GamePokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [guess, setGuess] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | undefined>(undefined);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const navigate = useNavigate();

  // Load a random pokemon
  const loadRandomPokemon = async () => {
    setLoading(true);
    setRevealed(false);
    setIsCorrect(undefined);
    setGuess('');

    try {
      // Get a list of all pokemon
      const response = await getAllPokemon();

      if (response && response.results && response.results.length) {
        const randomIndex = Math.floor(Math.random() * response.results.length);
        const randomPokemon = response.results[randomIndex];

        // Get detailed pokemon info
        const pokemonDetails = await getDetailPokemon(randomPokemon.name);

        if (pokemonDetails && randomPokemon.url) {
          setCurrentPokemon({
            ...randomPokemon,
            id: pokemonDetails.id,
            sprites: pokemonDetails.sprites
          });
        }
      }
    } catch (error) {
      console.error('Failed to load Pokemon:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize the game
  useEffect(() => {
    loadRandomPokemon();
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!currentPokemon || revealed) return;

    setTotalAttempts(prev => prev + 1);
    const normalizedGuess = guess.trim().toLowerCase();
    const normalizedPokemonName = currentPokemon.name.toLowerCase();

    const correct = normalizedGuess === normalizedPokemonName;
    setIsCorrect(correct);
    setRevealed(true);

    if (correct) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextPokemon = () => {
    loadRandomPokemon();
  };

  const handleViewDetails = () => {
    if (currentPokemon) {
      navigate(`/pokemon/${currentPokemon.name}`);
    }
  };

  return (
    <GameContainer>
      <Text as="h1" variant="outlined" size="xl">Who's That Pokémon?</Text>

      <GameCard className="pxl-border">
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <>
            <ScoreDisplay>
              Score: {score} / {totalAttempts}
            </ScoreDisplay>

            <PokemonImage>
              {currentPokemon?.sprites && (
                <SilhouetteWrapper className={revealed ? 'revealed' : ''}>
                  <LazyLoadImage
                    src={currentPokemon.sprites.other["official-artwork"].front_default}
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
                />
                <Button type="submit" variant="sky">
                  Submit Guess
                </Button>
              </GuessForm>
            ) : (
              <>
                <ResultMessage isCorrect={isCorrect}>
                  {isCorrect
                    ? 'Correct! Well done!'
                    : `Incorrect. It's ${currentPokemon?.name.toUpperCase()}!`}
                </ResultMessage>

                <ButtonsContainer>
                  <Button onClick={handleNextPokemon} variant="sky">
                    Next Pokemon
                  </Button>
                  <Button onClick={handleViewDetails} variant="light">
                    View Details
                  </Button>
                </ButtonsContainer>
              </>
            )}
          </>
        )}
      </GameCard>
    </GameContainer>
  );
};

export default WhosThatPokemon;
