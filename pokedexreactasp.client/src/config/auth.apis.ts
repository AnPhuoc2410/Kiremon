import axios from "axios";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ConfirmEmailRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  LogoutResponse,
} from "../types/auth.types";
import { UserResponse } from "../types/users.type";
import api from "./axios.config";

export const login = async (
  user: LoginRequest,
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth/login", {
    usernameOrEmail: user.usernameOrEmail,
    password: user.password,
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

export const doLogout = async (token: string): Promise<LogoutResponse> => {
  const response = await axios.post(
    `/auth/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`, // Pass token in Authorization header
      },
    },
  );

  return response.data;
};

export const doExtractToken = async (token: string): Promise<UserResponse> => {
  const response = await api.get(`/auth/extract-token`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
};

// Wrapper for AuthContext compatibility
export const doExtractUserFromToken = async (token: string): Promise<{ data: UserResponse }> => {
  const data = await doExtractToken(token);
  return { data };
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
