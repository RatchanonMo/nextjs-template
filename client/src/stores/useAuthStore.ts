import { AxiosError } from "axios";
import { authAPI } from "@/lib/api/authAPI";
import { getStoredToken, setAuthToken, setStoredToken } from "@/lib/api/client";
import { useTaskStore } from "@/stores/useTaskStore";
import { ChangePasswordFormData, LoginFormData, RegisterFormData, User } from "@/types/auth";
import { create } from "zustand";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof AxiosError) {
    const payload = error.response?.data as
      | {
          message?: string;
          errors?: Array<{ msg?: string; message?: string }>;
        }
      | undefined;

    const firstValidationError = payload?.errors?.find((item) => item.msg || item.message);
    return payload?.message ?? firstValidationError?.msg ?? firstValidationError?.message ?? fallback;
  }
  return error instanceof Error ? error.message : fallback;
};

type AuthState = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isChecking: boolean;
  error: string | null;
  bootstrapAuth: () => Promise<void>;
  login: (payload: LoginFormData) => Promise<void>;
  register: (payload: RegisterFormData) => Promise<void>;
  changePassword: (payload: ChangePasswordFormData) => Promise<string>;
  logout: () => void;
  clearError: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isChecking: true,
  error: null,

  bootstrapAuth: async () => {
    const token = getStoredToken();
    if (!token) {
      set({ token: null, user: null, isChecking: false });
      return;
    }

    try {
      setAuthToken(token);
      const user = await authAPI.getMe();
      set({ token, user, isChecking: false, error: null });
    } catch {
      setStoredToken(null);
      setAuthToken(null);
      set({ token: null, user: null, isChecking: false, error: null });
    }
  },

  login: async (payload) => {
    try {
      set({ isLoading: true, error: null });
      const { token, user } = await authAPI.login(payload);
      setStoredToken(token);
      setAuthToken(token);
      set({ token, user, isLoading: false, error: null });
    } catch (error) {
      set({
        isLoading: false,
        error: getErrorMessage(error, "Unable to sign in"),
      });
      throw error;
    }
  },

  register: async (payload) => {
    try {
      set({ isLoading: true, error: null });
      const { token, user } = await authAPI.register(payload);
      setStoredToken(token);
      setAuthToken(token);
      set({ token, user, isLoading: false, error: null });
    } catch (error) {
      set({
        isLoading: false,
        error: getErrorMessage(error, "Unable to create account"),
      });
      throw error;
    }
  },

  changePassword: async (payload) => {
    try {
      set({ isLoading: true, error: null });
      const message = await authAPI.changePassword(payload);

      useTaskStore.getState().clearTasks();
      setStoredToken(null);
      setAuthToken(null);

      set({
        user: null,
        token: null,
        isLoading: false,
        isChecking: false,
        error: null,
      });

      return message;
    } catch (error) {
      set({
        isLoading: false,
        error: getErrorMessage(error, "Unable to change password"),
      });
      throw error;
    }
  },

  logout: () => {
    void authAPI.logout().catch(() => undefined);
    useTaskStore.getState().clearTasks();
    setStoredToken(null);
    setAuthToken(null);
    set({ user: null, token: null, error: null, isLoading: false, isChecking: false });
  },

  clearError: () => set({ error: null }),
}));
