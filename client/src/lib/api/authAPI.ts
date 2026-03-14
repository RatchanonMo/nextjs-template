import { apiClient } from "@/lib/api/client";
import { AuthPayload, ChangePasswordFormData, EmailAvailabilityResponse, LoginFormData, RegisterFormData, User } from "@/types/auth";

type ApiResponse<T> = { success: boolean; data: T; message?: string };

export const authAPI = {
  async login(payload: LoginFormData): Promise<AuthPayload> {
    const { data } = await apiClient.post<ApiResponse<AuthPayload>>("/auth/login", payload);
    return data.data;
  },

  async register(payload: RegisterFormData): Promise<AuthPayload> {
    const { data } = await apiClient.post<ApiResponse<AuthPayload>>("/auth/register", payload);
    return data.data;
  },

  async getMe(): Promise<User> {
    const { data } = await apiClient.get<ApiResponse<User>>("/auth/me");
    return data.data;
  },

  async changePassword(payload: ChangePasswordFormData): Promise<string> {
    const { data } = await apiClient.post<ApiResponse<null>>("/auth/change-password", payload);
    return data.message ?? "Password changed successfully";
  },

  async logout(): Promise<void> {
    await apiClient.post("/auth/logout");
  },

  async checkEmailAvailability(email: string): Promise<EmailAvailabilityResponse> {
    const { data } = await apiClient.get<ApiResponse<EmailAvailabilityResponse>>("/auth/check-email", {
      params: { email },
    });
    return data.data;
  },
};
