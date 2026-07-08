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
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
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

const BadgeImage = styled.div`
  width: 80px;
  height: 80px;
  background: #e1f3fe;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1f6c9f;
  margin: 0 auto;
  animation: ${fadeIn} 600ms cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid #eaeaea;
`;

const SuccessTitle = styled(Paragraph)`
  color: #111111;
  font-weight: 700;
  font-size: 26px;
  margin-bottom: 12px;
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
`;

const WarningBox = styled.div`
  background: #f7f6f3;
  border: 1px solid #eaeaea;
  border-radius: 4px;
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
          <StatusContainer
            style={{
              animation: `${fadeIn} 600ms cubic-bezier(0.16, 1, 0.3, 1)`,
            }}
          >
            <SuccessIcon>
              <BadgeImage>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12l5 5l10 -10"></path>
                </svg>
              </BadgeImage>
            </SuccessIcon>
            <SuccessTitle>Trainer Verified</SuccessTitle>
            <Paragraph color="muted" style={{ marginBottom: 20 }}>
              Your account is ready to use.
            </Paragraph>
            <DotsContainer>
              <Dot color="#ef4444" />
              <Dot color="#3b82f6" />
              <Dot color="#fbbf24" />
            </DotsContainer>
          </StatusContainer>
        )}

        {status === "error" && (
          <div
            style={{
              padding: "20px",
              animation: `${fadeIn} 600ms cubic-bezier(0.16, 1, 0.3, 1)`,
            }}
          >
            <StatusContainer style={{ padding: "0 0 20px 0" }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  margin: "0 auto 20px",
                  background: "#FDEBEC",
                  color: "#9F2F2D",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #EAEAEA",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6l-12 12"></path>
                  <path d="M6 6l12 12"></path>
                </svg>
              </div>
              <ErrorTitle>Verification Failed</ErrorTitle>
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
