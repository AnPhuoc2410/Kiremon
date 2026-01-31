import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { confirmEmail, resendConfirmationEmail } from "@/config/auth.apis";
import toast from "react-hot-toast";
import Loading from "@/components/ui/Loading";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

// Import shared styles
import {
  AuthPage,
  AuthCard,
  AuthHeader,
  AuthLogo,
  AuthTitle,
  AuthSubtitle,
  AuthForm,
  AuthInput,
  AuthSubmit,
  Paragraph,
} from "@/styles";

// Page-specific animations
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

// Page-specific styled components
const StatusContainer = styled.div`
  text-align: center;
  padding: 40px 20px;
`;

const SuccessIcon = styled.div`
  position: relative;
  display: inline-block;
  margin-bottom: 24px;
`;

const BadgeImage = styled.img`
  width: 120px;
  height: 120px;
  filter: drop-shadow(0 8px 20px rgba(239, 68, 68, 0.3));
  animation: ${successBounce} 2s ease-in-out infinite;
`;

const SparkleIndicator = styled.div`
  position: absolute;
  top: -15px;
  right: -15px;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: 0 4px 12px rgba(251, 191, 36, 0.5);
  animation: ${shimmer} 2s ease-in-out infinite;
`;

const SuccessTitle = styled(Paragraph)`
  color: #10b981;
  font-weight: 700;
  font-size: 26px;
  margin-bottom: 12px;
  text-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
`;

const ErrorTitle = styled(Paragraph)`
  color: #ef4444;
  font-weight: 700;
  font-size: 20px;
  margin-bottom: 12px;
`;

const LoadingTitle = styled(Paragraph)`
  font-size: 18px;
  font-weight: 600;
  color: #f59e0b;
  margin-top: 16px;
  margin-bottom: 8px;
`;

const DotsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
`;

const Dot = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${(props) => props.color};
  box-shadow: 0 2px 8px ${(props) => props.color}66;
`;

const WarningBox = styled.div`
  background: #fef3c7;
  border: 1px solid #fbbf24;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
`;

const ConfirmEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "idle"
  >("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const userId = searchParams.get("userId");
    const token = searchParams.get("token");

    if (!userId || !token) {
      setStatus("error");
      setErrorMessage(
        "Invalid confirmation link. Please check your email and try again.",
      );
      return;
    }

    const handleConfirm = async () => {
      try {
        await confirmEmail({ userId, token });
        setStatus("success");
        toast.success("Email confirmed successfully! You can now log in.");
        setTimeout(() => {
          navigate("/login");
        }, 4000);
      } catch (error: any) {
        setStatus("error");
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to confirm email. The link may have expired.";
        setErrorMessage(message);
        toast.error(message);
      }
    };

    handleConfirm();
  }, [searchParams, navigate]);

  const handleResend = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      await resendConfirmationEmail(email);
      toast.success("Confirmation email sent! Please check your inbox.");
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to resend confirmation email";
      toast.error(message);
    }
  };

  return (
    <AuthPage>
      <AuthCard>
        <AuthHeader>
          <AuthLogo src="/pokeball-logo.png" alt="Pokéball logo" />
          <div>
            <AuthTitle>Email Confirmation</AuthTitle>
            <AuthSubtitle>Verifying your Trainer ID...</AuthSubtitle>
          </div>
        </AuthHeader>

        {status === "loading" && (
          <StatusContainer>
            <Loading label="" />
            <LoadingTitle>Verifying Trainer ID...</LoadingTitle>
            <Paragraph color="muted">
              Please wait while we confirm your email
            </Paragraph>
          </StatusContainer>
        )}

        {status === "success" && (
          <StatusContainer>
            <SuccessIcon>
              <BadgeImage src="/badge.png" alt="Pokéball" />
              <SparkleIndicator>✨</SparkleIndicator>
            </SuccessIcon>
            <SuccessTitle>Trainer Verified!</SuccessTitle>
            <Paragraph color="muted" style={{ marginBottom: 20 }}>
              Your account Kiremon is ready to use!
            </Paragraph>
            <DotsContainer>
              <Dot color="#ef4444" />
              <Dot color="#3b82f6" />
              <Dot color="#fbbf24" />
            </DotsContainer>
          </StatusContainer>
        )}

        {status === "error" && (
          <div style={{ padding: "20px" }}>
            <StatusContainer style={{ padding: "0 0 20px 0" }}>
              <img
                src="/teamRocket.png"
                alt="Error"
                style={{ width: 80, height: 80, marginBottom: 20 }}
              />
              <ErrorTitle>Verification Failed!</ErrorTitle>
              <Paragraph color="muted">{errorMessage}</Paragraph>
            </StatusContainer>

            <WarningBox>
              <Paragraph
                style={{ color: "#92400e", marginBottom: 12, fontWeight: 600 }}
              >
                Need a new confirmation email?
              </Paragraph>
              <AuthForm style={{ gap: 8 }}>
                <AuthInput
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <AuthSubmit type="button" onClick={handleResend}>
                  Resend Confirmation Email
                </AuthSubmit>
              </AuthForm>
            </WarningBox>

            <div style={{ textAlign: "center" }}>
              <Link
                to="/login"
                style={{
                  color: "#2563eb",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Back to Login
              </Link>
            </div>
          </div>
        )}
      </AuthCard>
    </AuthPage>
  );
};

export default ConfirmEmail;
