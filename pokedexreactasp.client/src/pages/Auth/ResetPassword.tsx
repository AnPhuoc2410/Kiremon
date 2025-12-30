import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { resetPassword } from "../../config/auth.apis";
import toast from "react-hot-toast";

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
  SmallText,
  FormLabel,
} from "../../styles";

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [tokenInput, setTokenInput] = useState("");

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    const emailParam = searchParams.get("email");

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
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    const finalToken = token || tokenInput;
    const finalEmail = email || "";

    if (!finalToken || !finalEmail) {
      toast.error("Missing token or email. Please use the link from your email.");
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
      toast.success("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Failed to reset password. The link may have expired.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPage>
      <AuthCard>
        <AuthHeader>
          <AuthLogo src="/pokeball-logo.png" alt="Pokéball logo" />
          <div>
            <AuthTitle>Reset Password</AuthTitle>
            <AuthSubtitle>Create a new password for your Trainer account</AuthSubtitle>
          </div>
        </AuthHeader>

        <AuthForm onSubmit={handleSubmit}>
          {showTokenInput && (
            <>
              <FormLabel htmlFor="reset-email">Email</FormLabel>
              <AuthInput
                id="reset-email"
                type="email"
                placeholder="Enter your email"
                value={email || ""}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <FormLabel htmlFor="reset-token">Reset Token (from email)</FormLabel>
              <AuthInput
                id="reset-token"
                type="text"
                placeholder="Paste the token from your email"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                required
              />
            </>
          )}

          <FormLabel htmlFor="new-password">New Password</FormLabel>
          <AuthInput
            id="new-password"
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />

          <FormLabel htmlFor="confirm-password">Confirm Password</FormLabel>
          <AuthInput
            id="confirm-password"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
          />

          <AuthSubmit type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </AuthSubmit>
        </AuthForm>

        <div style={{ marginTop: 12, textAlign: "center" }}>
          <SmallText>
            Remember your password? <Link to="/login">Sign in</Link>
          </SmallText>
        </div>
      </AuthCard>
    </AuthPage>
  );
};

export default ResetPassword;

