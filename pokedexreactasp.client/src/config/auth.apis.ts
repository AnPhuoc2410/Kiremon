import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ConfirmEmailRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  ExternalLoginRequest,
  TwoFactorLoginRequest,
  TwoFactorSetupResponse,
  Enable2FARequest,
  Disable2FARequest,
} from "../types/auth.types";
import createAuthenticatedClient from "../services/api/api-client.auth";

const api = createAuthenticatedClient();

export const login = async (user: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth/login", {
    usernameOrEmail: user.usernameOrEmail,
    password: user.password,
    reCaptchaToken: user.reCaptchaToken,
  });
  return response.data;
};

export const signup = async (
  payload: RegisterRequest,
): Promise<RegisterResponse> => {
  const response = await api.post<RegisterResponse>("/auth/register", {
    username: payload.username,
    email: payload.email,
    password: payload.password,
    confirmPassword: payload.confirmPassword,
    firstName: payload.firstName,
    lastName: payload.lastName,
  });
  return response.data;
};

export const doSendOTPToExistUser = async (
  email: string,
): Promise<string | null> => {
  const response = await api.patch(`/auth/send-otp?email=${email}`);
  try {
    if (response.status !== 200) throw new Error(response.data.message);

    return response.data.data;
  } catch (error) {
    console.log(`Find email error: ${error}`);
    return null;
  }
};

// Email confirmation APIs
export const confirmEmail = async (data: ConfirmEmailRequest) => {
  console.log("Confirming email with data:", data);
  const response = await api.post("/auth/confirm-email", {
    userId: data.userId,
    token: data.token,
  });
  return response.data;
};

export const resendConfirmationEmail = async (email: string) => {
  const response = await api.post("/auth/resend-confirmation", {
    email,
  });
  return response.data;
};

// Password reset APIs
export const forgotPassword = async (data: ForgotPasswordRequest) => {
  const response = await api.post("/auth/forgot-password", {
    email: data.email,
  });
  return response.data;
};

export const resetPassword = async (data: ResetPasswordRequest) => {
  const response = await api.post("/auth/reset-password", {
    email: data.email,
    token: data.token,
    newPassword: data.newPassword,
    confirmPassword: data.confirmPassword,
  });
  return response.data;
};

// Change password (authenticated user)
export const changePassword = async (data: ChangePasswordRequest) => {
  const response = await api.post("/auth/change-password", {
    currentPassword: data.currentPassword,
    newPassword: data.newPassword,
    confirmNewPassword: data.confirmNewPassword,
  });
  return response.data;
};

// External login (Google, Facebook, GitHub)
export const externalLogin = async (
  data: ExternalLoginRequest,
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth/external-login", {
    provider: data.provider,
    token: data.token,
  });
  return response.data;
};

// Two-factor authentication login
export const loginTwoFactor = async (
  data: TwoFactorLoginRequest,
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth/login-2fa", {
    userId: data.userId,
    code: data.code,
    rememberMe: data.rememberMe || false,
  });
  return response.data;
};

// Get 2FA setup information (QR code and secret key)
export const getTwoFactorSetup = async (): Promise<TwoFactorSetupResponse> => {
  const response = await api.get<TwoFactorSetupResponse>("/auth/2fa/setup");
  return response.data;
};

// Enable 2FA with verification code
export const enableTwoFactor = async (
  data: Enable2FARequest,
): Promise<void> => {
  await api.post("/auth/2fa/enable", {
    code: data.code,
  });
};

// Disable 2FA
export const disableTwoFactor = async (
  data: Disable2FARequest,
): Promise<void> => {
  await api.post("/auth/2fa/disable", {
    code: data.code,
  });
};
