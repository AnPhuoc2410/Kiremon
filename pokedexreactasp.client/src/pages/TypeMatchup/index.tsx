import React, { useEffect, useMemo, useState } from 'react';
import { Text, Button } from '../../components/ui';
import TypeIcon from '../../components/ui/Card/TypeIcon';
import { typesService } from '../../services';
import { IPokemonType } from '../../types/pokemon';
import { GameContainer, GameCard, OptionsGrid, OptionButton, ScoreBar } from './index.style';

const EFFECT_OPTIONS = [2, 1, 0.5, 0];

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

const TypeMatchup: React.FC = () => {
  const [types, setTypes] = useState<IPokemonType[]>([]);
  const [attacking, setAttacking] = useState<IPokemonType | null>(null);
  const [defending, setDefending] = useState<IPokemonType | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [correct, setCorrect] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const all = await typesService.getAllTypesWithDetails();
      const filtered = all.filter(t => !['unknown', 'shadow', 'stellar'].includes(t.name));
      setTypes(filtered);
      setLoading(false);
    };
    load();
  }, []);

  const computeMultiplier = (atk: IPokemonType, defName: string): number => {
    const dr = atk.damageRelations;
    const n = defName.toLowerCase();
    if (dr?.no_damage_to?.some(x => x.name === n)) return 0;
    if (dr?.double_damage_to?.some(x => x.name === n)) return 2;
    if (dr?.half_damage_to?.some(x => x.name === n)) return 0.5;
    return 1;
  };

  const nextQuestion = () => {
    if (!types.length) return;
    const atk = pick(types);
    const def = pick(types);
    setAttacking(atk);
    setDefending(def);
    setSelected(null);
    setCorrect(null);
  };

  useEffect(() => {
    if (!loading) nextQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const handleSelect = (opt: number) => {
    if (!attacking || !defending || selected !== null) return;
    const mult = computeMultiplier(attacking, defending.name);
    setSelected(opt);
    setCorrect(mult);
    setTotal(t => t + 1);
    if (opt === mult) setScore(s => s + 1);
  };

  return (
    <GameContainer>
      <Text as="h1" variant="outlined" size="xl">Type Matchup Quiz</Text>
      <GameCard className="pxl-border">
        {loading || !attacking || !defending ? (
          <Text>Loading...</Text>
        ) : (
          <>
            <ScoreBar>
              <Text as="span">Score: {score} / {total}</Text>
              <Button variant="light" onClick={() => { setScore(0); setTotal(0); nextQuestion(); }}>Reset</Button>
            </ScoreBar>

            <div style={{ marginTop: 12 }}>
              <Text as="h3">If an attack of type</Text>
              <div style={{ display: 'inline-flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
                <TypeIcon type={attacking.name} />
                <Text as="span">hits a</Text>
                <TypeIcon type={defending.name} />
                <Text as="span">Pokémon, what's the effectiveness?</Text>
              </div>
            </div>

            <OptionsGrid>
              {EFFECT_OPTIONS.map(v => (
                <OptionButton
                  key={v}
                  onClick={() => handleSelect(v)}
                  correct={selected !== null && v === correct}
                  wrong={selected !== null && v === selected && v !== correct}
                  className="pxl-border"
                >
                  {v === 2 ? 'Super effective (2x)' : v === 1 ? 'Normal (1x)' : v === 0.5 ? 'Not very effective (0.5x)' : 'No effect (0x)'}
                </OptionButton>
              ))}
            </OptionsGrid>

            {selected !== null && (
              <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                <Button variant="sky" onClick={nextQuestion}>Next Question</Button>
              </div>
            )}
          </>
        )}
      </GameCard>
    </GameContainer>
  );
};

export default TypeMatchup;
