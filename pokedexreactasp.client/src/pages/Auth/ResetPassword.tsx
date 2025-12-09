import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import * as S from './Login.style';
import { resetPassword } from '../../config/auth.apis';
import toast from 'react-hot-toast';

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [tokenInput, setTokenInput] = useState('');

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    const emailParam = searchParams.get('email');

    if (tokenParam && emailParam) {
      setToken(tokenParam);
      setEmail(emailParam);
    } else {
      setShowTokenInput(true);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    const finalToken = token || tokenInput;
    const finalEmail = email || '';

    if (!finalToken || !finalEmail) {
      toast.error('Missing token or email. Please use the link from your email.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword({
        email: finalEmail,
        token: finalToken,
        newPassword: password,
        confirmPassword: confirmPassword,
      });
      toast.success('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to reset password. The link may have expired.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <S.Page>
      <S.Card>
        <S.Header>
          <S.Logo src="/pokeball-logo.png" alt="Pokéball logo" />
          <div>
            <S.Title>Reset Password</S.Title>
            <S.Subtitle>Create a new password for your Trainer account</S.Subtitle>
          </div>
        </S.Header>

        <S.Form onSubmit={handleSubmit}>
          {showTokenInput && (
            <>
              <label htmlFor="reset-email" style={{ fontSize: 13, color: '#626876' }}>
                Email
              </label>
              <S.Input
                id="reset-email"
                type="email"
                placeholder="Enter your email"
                value={email || ''}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <label htmlFor="reset-token" style={{ fontSize: 13, color: '#626876' }}>
                Reset Token (from email)
              </label>
              <S.Input
                id="reset-token"
                type="text"
                placeholder="Paste the token from your email"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                required
              />
            </>
          )}

          <label htmlFor="new-password" style={{ fontSize: 13, color: '#626876' }}>
            New Password
          </label>
          <S.Input
            id="new-password"
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />

          <label htmlFor="confirm-password" style={{ fontSize: 13, color: '#626876' }}>
            Confirm Password
          </label>
          <S.Input
            id="confirm-password"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
          />

          <S.Submit type="submit" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </S.Submit>
        </S.Form>

        <div style={{ marginTop: 12, textAlign: 'center' }}>
          <S.SmallText>
            Remember your password? <Link to="/login">Sign in</Link>
          </S.SmallText>
        </div>
      </S.Card>
    </S.Page>
  );
};

export default ResetPassword;

