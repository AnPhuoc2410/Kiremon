import React, { useEffect, useRef, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Text, Button } from '../../components/ui';
import { pokemonService } from '../../services';
import { IPokemon } from '../../types/pokemon';
import { Field, GameCard, GameContainer, PokemonSprite, ThrowArea } from './index.style';

interface GamePokemon extends IPokemon {
  sprites?: {
    other: {
      "official-artwork": {
        front_default: string;
      }
    }
  };
}

function rand(min: number, max: number) { return Math.random() * (max - min) + min; }

const CatchChallenge: React.FC = () => {
  const [pokemon, setPokemon] = useState<GamePokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [x, setX] = useState(50);
  const [y, setY] = useState(50);
  const [score, setScore] = useState(0);
  const [throws, setThrows] = useState(5);
  const timer = useRef<number | null>(null);

  const loadRandomPokemon = async () => {
    setLoading(true);
    const response = await pokemonService.getAllPokemon(200, 0);
    if (response.results.length) {
      const random = response.results[Math.floor(Math.random() * response.results.length)];
      const details = await pokemonService.getPokemonDetail(random.name);
      setPokemon({ ...random, id: details?.id, sprites: details?.sprites });
    }
    setLoading(false);
    setX(50); setY(50);
  };

  useEffect(() => { loadRandomPokemon(); }, []);

  useEffect(() => {
    if (!pokemon) return;
    // Move Pokémon around
    timer.current = window.setInterval(() => {
      setX(v => Math.max(10, Math.min(90, v + rand(-10, 10))));
      setY(v => Math.max(10, Math.min(90, v + rand(-10, 10))));
    }, 900);
    return () => { if (timer.current) window.clearInterval(timer.current); };
  }, [pokemon]);

  const tryCatch = () => {
    if (throws <= 0) return;
    setThrows(t => t - 1);
    // Simple catch formula: closer to center increases chance
    const dx = Math.abs(x - 50) / 50; // 0 to 0.8
    const dy = Math.abs(y - 50) / 50;
    const distanceFactor = 1 - Math.min(1, Math.sqrt(dx*dx + dy*dy)); // 0..1
    const base = 0.35; // base catch rate
    const chance = base + distanceFactor * 0.5; // up to 85%
    if (Math.random() < chance) {
      setScore(s => s + 1);
      setThrows(5);
      loadRandomPokemon();
    }
  };

  return (
    <GameContainer>
      <Text as="h1" variant="outlined" size="xl">Catch Challenge</Text>
      <GameCard className="pxl-border">
        <div style={{ display:'flex', justifyContent:'space-between' }}>
          <Text>Score: {score}</Text>
          <Text>Poké Balls: {throws}</Text>
        </div>

        {loading || !pokemon ? (
          <Text>Loading...</Text>
        ) : (
          <>
            <Field className="pxl-border">
              {pokemon.sprites?.other?.["official-artwork"].front_default && (
                <PokemonSprite
                  src={pokemon.sprites.other["official-artwork"].front_default}
                  x={x}
                  y={y}
                  alt={pokemon.name}
                />
              )}
            </Field>

            <ThrowArea>
              <Button variant="sky" onClick={tryCatch} disabled={throws <= 0}>Throw Poké Ball</Button>
              <Button variant="light" onClick={loadRandomPokemon}>Skip</Button>
              <Button variant="dark" onClick={() => { setScore(0); setThrows(5); }}>Reset</Button>
            </ThrowArea>
          </>
        )}
      </GameCard>
    </GameContainer>
  );
};

export default CatchChallenge;
