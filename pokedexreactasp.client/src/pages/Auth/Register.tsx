import React, { useState } from 'react';
import * as S from './Register.style';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../../config/auth.apis';
import toast from 'react-hot-toast';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirm) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await signup({
        username: username || email.split('@')[0],
        email,
        password,
        confirmPassword: confirm,
        firstName: null,
        lastName: null,
      });
      toast.success('Registration successful! Please check your email to confirm your account.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Registration failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
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
          <label htmlFor="register-username" style={{ fontSize: 13, color: '#626876' }}>Username</label>
          <S.Input id="register-username" placeholder="Choose a username" value={username} onChange={(e) => setUsername(e.target.value)} required />

          <label htmlFor="register-email" style={{ fontSize: 13, color: '#626876' }}>Email</label>
          <S.Input id="register-email" type="email" placeholder="you@pokemon.world" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <label htmlFor="register-password" style={{ fontSize: 13, color: '#626876' }}>Password</label>
          <S.Input id="register-password" type="password" placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />

          <label htmlFor="register-confirm" style={{ fontSize: 13, color: '#626876' }}>Confirm password</label>
          <S.Input id="register-confirm" type="password" placeholder="Confirm password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={6} />

          <S.Submit type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </S.Submit>
        </S.Form>

        <div style={{ marginTop: 12 }}>
          <S.SmallText>
            Already have an account? <Link to="/login" style={{ color: '#2563EB', fontWeight: 600 }}>Sign in</Link>
          </S.SmallText>
        </div>
      </S.Card>
    </S.Page>
  );
};

export default Register;
