import React, { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../config/auth.apis";
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
  FlexCenter,
} from "../../styles";

const Forgot: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword({ email });
      setSent(true);
      toast.success("Password reset email sent! Please check your inbox.");
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to send reset email";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPage>
      <AuthCard>
        <AuthHeader>
          <AuthLogo src="/pokeball-logo.png" alt="pokeball" />
          <div>
            <AuthTitle>Forgot your Trainer ID?</AuthTitle>
            <AuthSubtitle>
              We'll send a Potion... err, a recovery link to your email.
            </AuthSubtitle>
          </div>
        </AuthHeader>

        {!sent ? (
          <AuthForm onSubmit={handleSubmit}>
            <FormLabel htmlFor="forgot-email">Trainer Email</FormLabel>
            <AuthInput
              id="forgot-email"
              type="email"
              placeholder="you@pokemon.world"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <AuthSubmit type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send reset link"}
            </AuthSubmit>
          </AuthForm>
        ) : (
          <FlexCenter style={{ flexDirection: "column", padding: "20px", textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📧</div>
            <AuthTitle style={{ color: "#10b981", marginBottom: "8px" }}>
              Email Sent!
            </AuthTitle>
            <AuthSubtitle style={{ marginBottom: "20px" }}>
              Check your inbox for password reset instructions.
            </AuthSubtitle>
            <AuthSubmit type="button" onClick={() => setSent(false)}>
              Send Another Email
            </AuthSubmit>
          </FlexCenter>
        )}

        <div style={{ marginTop: 12 }}>
          <SmallText>
            Remembered? <Link to="/login">Sign in</Link>
          </SmallText>
        </div>
      </AuthCard>
    </AuthPage>
  );
};

export default Forgot;
