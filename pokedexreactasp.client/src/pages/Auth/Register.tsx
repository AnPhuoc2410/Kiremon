import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../../config/auth.apis";
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

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await signup({
        username: username || email.split("@")[0],
        email,
        password,
        confirmPassword: confirm,
        firstName: null,
        lastName: null,
      });
      toast.success(
        "Registration successful! Please check your email to confirm your account.",
      );
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Registration failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPage>
      <AuthCard width="520px">
        <AuthHeader>
          <AuthLogo src="/pokeball-logo.png" alt="pokeball" />
          <div>
            <AuthTitle>New Trainer Signup</AuthTitle>
            <AuthSubtitle>
              Create your Trainer ID and start exploring
            </AuthSubtitle>
          </div>
        </AuthHeader>

        <AuthForm onSubmit={handleSubmit}>
          <FormLabel htmlFor="register-username">Username</FormLabel>
          <AuthInput
            id="register-username"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <FormLabel htmlFor="register-email">Email</FormLabel>
          <AuthInput
            id="register-email"
            type="email"
            placeholder="you@pokemon.world"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <FormLabel htmlFor="register-password">Password</FormLabel>
          <AuthInput
            id="register-password"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />

          <FormLabel htmlFor="register-confirm">Confirm password</FormLabel>
          <AuthInput
            id="register-confirm"
            type="password"
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            minLength={6}
          />

          <AuthSubmit type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </AuthSubmit>
        </AuthForm>

        <div style={{ marginTop: 12 }}>
          <SmallText>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#2563EB", fontWeight: 600 }}>
              Sign in
            </Link>
          </SmallText>
        </div>
      </AuthCard>
    </AuthPage>
  );
};

export default Register;
