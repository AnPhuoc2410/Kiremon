export type AuthUser = {
  userId: string;
  username: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
  level: number;
  pokemonCaught: number;
  emailConfirmed: boolean;
};

export type AuthResponse = AuthUser & {
  token: string;
  expiresAt: string;
};

export type AuthLoginData = {
  accessToken: string;
  expires: string;
  user: AuthUser;
};

export type LoginRequest = {
  usernameOrEmail: string;
  password: string;
  reCaptchaToken?: string | null;
};

export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName?: string | null;
  lastName?: string | null;
};

export type ConfirmEmailRequest = {
  userId: string;
  token: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ResetPasswordRequest = {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
};

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export type ExternalLoginRequest = {
  provider: string;
  token: string;
};

export type LoginResponse = AuthResponse;

export type RegisterResponse = AuthResponse;

export type ApiResponse<T = unknown> = {
  message?: string;
  data?: T;
  statusCode?: number;
  isSuccess?: boolean;
  reason?: string | null;
};
