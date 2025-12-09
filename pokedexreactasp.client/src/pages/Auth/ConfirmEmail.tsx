import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import * as S from './Login.style';
import { confirmEmail, resendConfirmationEmail } from '../../config/auth.apis';
import toast from 'react-hot-toast';
import { keyframes } from '@emotion/react';
import Loading from '../../components/ui/Loading';

const successBounce = keyframes`
  0%, 100% { transform: translateY(0) scale(1); }
  25% { transform: translateY(-15px) scale(1.05); }
  50% { transform: translateY(0) scale(1); }
  75% { transform: translateY(-8px) scale(1.02); }
`;

const shimmer = keyframes`
  0% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
  100% { opacity: 0.6; transform: scale(1); }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

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
        }, 4000);
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
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <Loading label="" />
            <S.Text style={{ fontSize: '18px', fontWeight: 600, color: '#f59e0b', marginTop: '16px', marginBottom: '8px' }}>
              Verifying Trainer ID...
            </S.Text>
            <S.Text style={{ fontSize: '14px', color: '#9ca3af' }}>
              Please wait while we confirm your email
            </S.Text>
          </div>
        )}

        {status === 'success' && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{
              position: 'relative',
              display: 'inline-block',
              marginBottom: '24px'
            }}>
              <img
                src="/badge.png"
                alt="Pokéball"
                style={{
                  width: '120px',
                  height: '120px',
                  filter: 'drop-shadow(0 8px 20px rgba(239, 68, 68, 0.3))',
                  animation: `${successBounce} 2s ease-in-out infinite`
                }}
              />
              <div style={{
                position: 'absolute',
                top: '-15px',
                right: '-15px',
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                boxShadow: '0 4px 12px rgba(251, 191, 36, 0.5)',
                animation: `${shimmer} 2s ease-in-out infinite`
              }}>✨</div>
            </div>
            <S.Text style={{
              color: '#10b981',
              fontWeight: 700,
              fontSize: '26px',
              marginBottom: '12px',
              textShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
              animation: `${fadeInUp} 0.6s ease-out`
            }}>
              Trainer Verified!
            </S.Text>
            <S.Text style={{
              fontSize: '16px',
              color: '#6b7280',
              marginBottom: '20px',
              animation: `${fadeInUp} 0.8s ease-out`
            }}>
              Your account Kiremon is ready to use!
            </S.Text>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '12px',
              marginTop: '20px',
              animation: `${fadeInUp} 1s ease-out`
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#ef4444',
                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)'
              }} />
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#3b82f6',
                boxShadow: '0 2px 8px rgba(59, 130, 246, 0.4)'
              }} />
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#fbbf24',
                boxShadow: '0 2px 8px rgba(251, 191, 36, 0.4)'
              }} />
            </div>
          </div>
        )}

        {status === 'error' && (
          <div style={{ padding: '20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img
                src="/teamRocket.png"
                alt="Error"
                style={{
                  width: '80px',
                  height: '80px',
                  marginBottom: '20px',
                  display: 'block'
                }}
              />
              <S.Text style={{
                color: '#ef4444',
                fontWeight: 700,
                fontSize: '20px',
                marginBottom: '12px'
              }}>
                Verification Failed!
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

