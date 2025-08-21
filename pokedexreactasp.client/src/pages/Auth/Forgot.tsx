import React, { useState } from 'react';
import * as S from './Forgot.style';
import { Link } from 'react-router-dom';

const Forgot: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // UI only - show success path
    alert('If this were wired, a recovery email would be sent.');
  };

  return (
    <S.Page>
      <S.Card>
        <S.Header>
          <S.Logo src="/pokeball-logo.png" alt="pokeball" />
          <div>
            <S.Title>Forgot your Trainer ID?</S.Title>
            <S.Subtitle>We'll send a Potion... err, a recovery link to your email.</S.Subtitle>
          </div>
        </S.Header>

        <S.Form onSubmit={handleSubmit}>
          <label htmlFor="forgot-email" style={{ fontSize: 13, color: '#626876' }}>Trainer Email</label>
          <S.Input id="forgot-email" placeholder="you@pokemon.world" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <S.Submit type="submit">Send reset link</S.Submit>
        </S.Form>

        <div style={{ marginTop: 12 }}>
          <S.SmallText>
            Remembered? <Link to="/login">Sign in</Link>
          </S.SmallText>
        </div>
      </S.Card>
    </S.Page>
  );
};

export default Forgot;
