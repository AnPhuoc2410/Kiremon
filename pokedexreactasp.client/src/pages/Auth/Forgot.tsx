import React, { useState } from 'react';
import * as S from './Forgot.style';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../config/auth.apis';
import toast from 'react-hot-toast';

const Forgot: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword({ email });
      setSent(true);
      toast.success('Password reset email sent! Please check your inbox.');
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to send reset email';
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
            <S.Title>Forgot your Trainer ID?</S.Title>
            <S.Subtitle>We'll send a Potion... err, a recovery link to your email.</S.Subtitle>
          </div>
        </S.Header>

        {!sent ? (
          <S.Form onSubmit={handleSubmit}>
            <label htmlFor="forgot-email" style={{ fontSize: 13, color: '#626876' }}>Trainer Email</label>
            <S.Input id="forgot-email" type="email" placeholder="you@pokemon.world" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <S.Submit type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send reset link'}
            </S.Submit>
          </S.Form>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📧</div>
            <S.Title style={{ color: '#10b981', fontWeight: 600, marginBottom: '8px' }}>
              Email Sent!
            </S.Title>
            <S.Title style={{ fontSize: '14px', color: '#6b7280', marginBottom: '20px' }}>
              Check your inbox for password reset instructions.
            </S.Title>
            <S.Submit type="button" onClick={() => setSent(false)} style={{ marginBottom: '12px' }}>
              Send Another Email
            </S.Submit>
          </div>
        )}

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
