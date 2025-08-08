import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Text, Button } from '../../components/ui';
import { sfx } from '../../components/utils/sfx';
import { Container, Controls, Grid, Preview, Select, Stat, Subtitle, Tile, Title } from './index.style';

const games = [
  {
    key: 'whos-that',
    title: "Who's That Pokémon?",
    subtitle: 'Guess the silhouette',
    to: '/games/whos-that-pokemon',
    preview: '/public/static/pokeball.png'
  },
  {
    key: 'combat-team',
    title: 'Combat Team',
    subtitle: 'Build and simulate battles',
    to: '/games/combat-team',
    preview: '/public/static/pokeball-transparent.png'
  },
  {
    key: 'type-matchup',
    title: 'Type Matchup Quiz',
    subtitle: 'Know your strengths',
    to: '/games/type-matchup',
    preview: '/public/static/pokeball.png'
  },
  {
    key: 'catch-challenge',
    title: 'Catch Challenge',
    subtitle: 'Catch moving Pokémon',
    to: '/games/catch-challenge',
    preview: '/public/static/pokeball-transparent.png'
  }
];

const GamesHub: React.FC = () => {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState<'easy'|'normal'|'hard'>('normal');
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState<number>(() => Number(localStorage.getItem('pokegames@bestStreak') || 0));

  useEffect(() => {
    localStorage.setItem('pokegames@difficulty', difficulty);
  }, [difficulty]);

  useEffect(() => {
    setBest(b => streak > b ? streak : b);
    if (streak > best) localStorage.setItem('pokegames@bestStreak', String(streak));
  }, [streak]);

  const handleOpen = (to: string) => {
    sfx.click();
    navigate(to);
  };

  return (
    <Container>
      <Text as="h1" variant="outlined" size="xl">Mini Games</Text>

      <Controls>
        <label>
          <Text as="span">Difficulty:</Text>
          <Select value={difficulty} onChange={e => setDifficulty(e.target.value as any)}>
            <option value="easy">Easy</option>
            <option value="normal">Normal</option>
            <option value="hard">Hard</option>
          </Select>
        </label>
        <Stat>Best Streak: {best}</Stat>
      </Controls>

      <Grid>
        {games.map((g) => (
          <Tile key={g.key} onClick={() => handleOpen(g.to)} className="pxl-border">
            <Title>{g.title}</Title>
            <Subtitle>{g.subtitle}</Subtitle>
            <Preview>
              <img src={g.preview} alt="preview" width={100} height={100} />
            </Preview>
          </Tile>
        ))}
      </Grid>
    </Container>
  );
};

export default GamesHub;
