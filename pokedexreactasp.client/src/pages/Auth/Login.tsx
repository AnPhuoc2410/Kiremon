import React, { useState, useRef } from "react";
import * as S from "./Login.style";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { login, externalLogin } from "../../config/auth.apis";
import toast from "react-hot-toast";
import ReCAPTCHA from "react-google-recaptcha";
import {
  RECAPTCHA_KEY,
  GOOGLE_CLIENT_ID,
  FACEBOOK_APP_ID,
} from "../../config/api.config";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  CredentialResponse,
} from "@react-oauth/google";
import FacebookLogin from "@greatsumini/react-facebook-login";

const LoginForm: React.FC = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const navigate = useNavigate();
  const { authLogin } = useAuth();

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
  };

  const handleExternalLoginSuccess = async (
    provider: string,
    token: string,
  ) => {
    setSocialLoading(provider);
    try {
      const response = await externalLogin({ provider, token });

      if (response?.token) {
        const expiresDate = response.expiresAt
          ? new Date(response.expiresAt).toISOString()
          : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

        authLogin({
          accessToken: response.token,
          expires: expiresDate,
          user: {
            userId: response.userId,
            username: response.username,
            email: response.email,
            firstName: response.firstName,
            lastName: response.lastName,
            avatarUrl: response.avatarUrl,
            level: response.level,
            pokemonCaught: response.pokemonCaught,
            emailConfirmed: response.emailConfirmed,
          },
        });
        toast.success(`Welcome back via ${provider}!`);
        navigate("/pokemons");
      } else if (response?.emailConfirmed === false) {
        toast.success(
          "Account created! Please check your email to verify your account.",
        );
        navigate("/login");
      } else {
        toast.error(`${provider} login failed. Please try again.`);
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        `${provider} login failed. Please try again.`;
      toast.error(message);
    } finally {
      setSocialLoading(null);
    }
  };

  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      handleExternalLoginSuccess("Google", credentialResponse.credential);
    } else {
      toast.error("Google login failed. No credential received.");
    }
  };

  const handleGoogleError = () => {
    toast.error("Google login failed. Please try again.");
  };

  const handleFacebookSuccess = (response: { accessToken: string }) => {
    if (response.accessToken) {
      handleExternalLoginSuccess("Facebook", response.accessToken);
    } else {
      toast.error("Facebook login failed. No access token received.");
    }
  };

  const handleFacebookError = () => {
    toast.error("Facebook login failed. Please try again.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recaptchaToken) {
      toast.error("Please complete the reCAPTCHA verification");
      return;
    }

    setLoading(true);
    try {
      const response = await login({
        usernameOrEmail,
        password,
        reCaptchaToken: recaptchaToken,
      });

      if (response?.token) {
        const expiresDate = response.expiresAt
          ? new Date(response.expiresAt).toISOString()
          : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

        // Pass full user info to context
        authLogin({
          accessToken: response.token,
          expires: expiresDate,
          user: {
            userId: response.userId,
            username: response.username,
            email: response.email,
            firstName: response.firstName,
            lastName: response.lastName,
            avatarUrl: response.avatarUrl,
            level: response.level,
            pokemonCaught: response.pokemonCaught,
            emailConfirmed: response.emailConfirmed,
          },
        });
        toast.success("Login successful!");
        navigate("/pokemons");
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Login failed. Please check your credentials.";
      toast.error(message);
      // Reset reCAPTCHA on error
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
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
            <S.Title>Welcome, Trainer</S.Title>
            <S.Subtitle>Sign in to continue your adventure</S.Subtitle>
          </div>
        </S.Header>

        <S.Form onSubmit={handleSubmit} aria-label="login form">
          <label htmlFor="email" style={{ fontSize: 13, color: "#626876" }}>
            Trainer ID (Username or Email)
          </label>
          <S.Input
            id="email"
            name="email"
            type="text"
            placeholder="username or you@pokemon.world"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            required
          />

          <label htmlFor="password" style={{ fontSize: 13, color: "#626876" }}>
            Password
          </label>
          <S.Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <S.Submit type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Start Journey"}
          </S.Submit>
        </S.Form>

        <div
          style={{ marginTop: 16, display: "flex", justifyContent: "center" }}
        >
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={RECAPTCHA_KEY}
            onChange={handleRecaptchaChange}
            theme="light"
          />
        </div>

        <S.Row style={{ marginTop: 16 }}>
          <S.Text>
            New trainer?{" "}
            <Link to="/register" style={{ color: "#2563EB", fontWeight: 600 }}>
              Create an account
            </Link>
          </S.Text>
          <S.Text>
            <Link to="/forgot" style={{ color: "#EF4444", fontWeight: 600 }}>
              Forgot?
            </Link>
          </S.Text>
        </S.Row>

        <S.Divider>or</S.Divider>

        <S.Container>
          {/* Google Login - Hidden button triggered by custom UI */}
          <div style={{ position: "relative" }}>
            <S.SocialButton
              type="button"
              aria-label="Sign in with Google"
              disabled={socialLoading !== null}
              style={{ pointerEvents: "none" }}
            >
              {socialLoading === "Google" ? (
                "Connecting..."
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 48 48"
                  >
                    <path
                      fill="#FFC107"
                      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                    />
                    <path
                      fill="#FF3D00"
                      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                    />
                    <path
                      fill="#4CAF50"
                      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                    />
                    <path
                      fill="#1976D2"
                      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                    />
                  </svg>
                  Start with Google
                </>
              )}
            </S.SocialButton>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                opacity: 0,
                cursor: "pointer",
              }}
            >
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                width="100%"
              />
            </div>
          </div>

          {/* Facebook Login */}
          <FacebookLogin
            appId={FACEBOOK_APP_ID}
            onSuccess={handleFacebookSuccess}
            onFail={handleFacebookError}
            render={({ onClick }) => (
              <S.SocialButton
                type="button"
                aria-label="Sign in with Facebook"
                onClick={onClick}
                disabled={socialLoading !== null}
              >
                {socialLoading === "Facebook" ? (
                  "Connecting..."
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 48 48"
                    >
                      <path
                        fill="#039be5"
                        d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"
                      />
                      <path
                        fill="#fff"
                        d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"
                      />
                    </svg>
                    Start with Facebook
                  </>
                )}
              </S.SocialButton>
            )}
          />

          {/* GitHub Login - Coming Soon */}
          <S.SocialButton
            type="button"
            aria-label="Sign in with GitHub"
            onClick={() => toast("GitHub login coming soon!")}
            disabled={socialLoading !== null}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 30 30"
            >
              <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z" />
            </svg>
            Start with GitHub
          </S.SocialButton>
        </S.Container>
      </S.Card>
    </S.Page>
  );
};

const Login: React.FC = () => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <LoginForm />
    </GoogleOAuthProvider>
  );
};

export default Login;
