import { ApiResponse } from "../types/api";
import {
  AuthPayload,
  ChangePasswordFormData,
  LoginFormData,
  RegisterFormData,
  User,
} from "../types/auth";
import { apiClient } from "./client";

type EmailAvailabilityResponse = {
  email: string;
  available: boolean;
};

export const authAPI = {
  async login(payload: LoginFormData): Promise<AuthPayload> {
    const { data } = await apiClient.post<ApiResponse<AuthPayload>>("/auth/login", payload);
    if (!data.success) {
      throw new Error(data.message ?? "Login failed");
    }
    return data.data;
  },

  async register(payload: RegisterFormData): Promise<AuthPayload> {
    const { data } = await apiClient.post<ApiResponse<AuthPayload>>("/auth/register", payload);
    if (!data.success) {
      throw new Error(data.message ?? "Signup failed");
    }
    return data.data;
  },

  async getMe(): Promise<User> {
    const { data } = await apiClient.get<ApiResponse<User>>("/auth/me");
    if (!data.success) {
      throw new Error(data.message ?? "Unable to fetch profile");
    }
    return data.data;
  },

  async changePassword(payload: ChangePasswordFormData): Promise<string> {
    const { data } = await apiClient.post<ApiResponse<null>>("/auth/change-password", payload);
    if (!data.success) {
      throw new Error(data.message ?? "Unable to change password");
    }
    return data.message ?? "Password changed successfully";
  },

  async checkEmailAvailability(email: string): Promise<EmailAvailabilityResponse> {
    const { data } = await apiClient.get<ApiResponse<EmailAvailabilityResponse>>("/auth/check-email", {
      params: { email },
    });

    if (!data.success) {
      throw new Error(data.message ?? "Unable to verify email");
    }

    return data.data;
  },

  async logout(): Promise<void> {
    await apiClient.post("/auth/logout");
  },
};
