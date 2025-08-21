import React, { useState } from 'react';
import * as S from './Register.style';
import { Link, useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // UI only for now
    navigate('/login');
  };

  return (
    <S.Page>
      <S.Card>
        <S.Header>
          <S.Logo src="/pokeball-logo.png" alt="pokeball" />
          <div>
            <S.Title>New Trainer Signup</S.Title>
            <S.Subtitle>Create your Trainer ID and start exploring</S.Subtitle>
          </div>
        </S.Header>

        <S.Form onSubmit={handleSubmit}>
          <label htmlFor="register-email" style={{ fontSize: 13, color: '#626876' }}>Email</label>
          <S.Input id="register-email" placeholder="you@pokemon.world" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <label htmlFor="register-password" style={{ fontSize: 13, color: '#626876' }}>Password</label>
          <S.Input id="register-password" type="password" placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} required />

          <label htmlFor="register-confirm" style={{ fontSize: 13, color: '#626876' }}>Confirm password</label>
          <S.Input id="register-confirm" type="password" placeholder="Confirm password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />

          <S.Submit type="submit">Register</S.Submit>
        </S.Form>

        <div style={{ marginTop: 12 }}>
          <S.SmallText>
            Already have an account? <Link to="/login">Sign in</Link>
          </S.SmallText>
        </div>
      </S.Card>
    </S.Page>
  );
};

export default Register;
