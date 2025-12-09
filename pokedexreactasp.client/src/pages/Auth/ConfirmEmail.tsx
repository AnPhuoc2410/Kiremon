import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import * as S from './Login.style';
import { confirmEmail, resendConfirmationEmail } from '../../config/auth.apis';
import toast from 'react-hot-toast';

const ConfirmEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'idle'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    const userId = searchParams.get('userId');
    const token = searchParams.get('token');

    if (!userId || !token) {
      setStatus('error');
      setErrorMessage('Invalid confirmation link. Please check your email and try again.');
      return;
    }

    const handleConfirm = async () => {
      try {
        await confirmEmail({ userId, token });
        setStatus('success');
        toast.success('Email confirmed successfully! You can now log in.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } catch (error: any) {
        setStatus('error');
        const message = error?.response?.data?.message || error?.message || 'Failed to confirm email. The link may have expired.';
        setErrorMessage(message);
        toast.error(message);
      }
    };

    handleConfirm();
  }, [searchParams, navigate]);

  const handleResend = async () => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    try {
      await resendConfirmationEmail(email);
      toast.success('Confirmation email sent! Please check your inbox.');
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to resend confirmation email';
      toast.error(message);
    }
  };

  return (
    <S.Page>
      <S.Card>
        <S.Header>
          <S.Logo src="/pokeball-logo.png" alt="Pokéball logo" />
          <div>
            <S.Title>Email Confirmation</S.Title>
            <S.Subtitle>Verifying your Trainer ID...</S.Subtitle>
          </div>
        </S.Header>

        {status === 'loading' && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚡</div>
            <S.Text>Confirming your email...</S.Text>
          </div>
        )}

        {status === 'success' && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
            <S.Text style={{ color: '#10b981', fontWeight: 600, marginBottom: '16px' }}>
              Email confirmed successfully!
            </S.Text>
            <S.Text style={{ fontSize: '14px', color: '#6b7280' }}>
              Redirecting to login page...
            </S.Text>
          </div>
        )}

        {status === 'error' && (
          <div style={{ padding: '20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
              <S.Text style={{ color: '#ef4444', fontWeight: 600, marginBottom: '8px' }}>
                Confirmation Failed
              </S.Text>
              <S.Text style={{ fontSize: '14px', color: '#6b7280', marginBottom: '20px' }}>
                {errorMessage}
              </S.Text>
            </div>

            <div style={{
              background: '#fef3c7',
              border: '1px solid #fbbf24',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '20px'
            }}>
              <S.Text style={{ fontSize: '14px', color: '#92400e', marginBottom: '12px', fontWeight: 600 }}>
                Need a new confirmation email?
              </S.Text>
              <S.Form style={{ gap: '8px' }}>
                <S.Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <S.Submit type="button" onClick={handleResend}>
                  Resend Confirmation Email
                </S.Submit>
              </S.Form>
            </div>

            <div style={{ textAlign: 'center' }}>
              <Link to="/login" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
                Back to Login
              </Link>
            </div>
          </div>
        )}
      </S.Card>
    </S.Page>
  );
};

export default ConfirmEmail;

