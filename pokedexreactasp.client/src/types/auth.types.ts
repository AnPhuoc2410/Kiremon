import { UserResponse } from "./users.type";

export type AuthResponse = {
  userId: string;
  username: string;
  email: string;
  token: string;
  expiresAt: string;
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
  level: number;
  pokemonCaught: number;
  emailConfirmed: boolean;
};

export type AuthLoginData = {
  accessToken: string;
  expires: string;
};

export type LoginRequest = {
  usernameOrEmail: string;
  password: string;
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

export type LoginResponse = AuthResponse;

export type RegisterResponse = AuthResponse;

export type ApiResponse<T = unknown> = {
  message?: string;
  data?: T;
  statusCode?: number;
  isSuccess?: boolean;
  reason?: string | null;
};

export type LogoutRequest = {
  token: string;
};

export type LogoutResponse = {
  message: string;
  statusCode: number;
  isSuccess: boolean;
};

export type ExtractTokenResponse = {
  message: string;
  statusCode: number;
  reason: string | null;
  isSuccess: boolean;
  data: UserResponse;
};

