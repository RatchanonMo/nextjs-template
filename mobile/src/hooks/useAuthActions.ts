import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authAPI } from "../api/authAPI";
import { queryKeys } from "../constants/queryKeys";
import { useAuthStore } from "../store/authStore";
import { LoginFormData, RegisterFormData } from "../types/auth";

export const useAuthActions = () => {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const loginMutation = useMutation({
    mutationFn: (payload: LoginFormData) => authAPI.login(payload),
    onSuccess: (payload) => {
      setAuth({
        user: payload.user,
        tokens: { accessToken: payload.token },
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.me });
    },
  });

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterFormData) => authAPI.register(payload),
    onSuccess: (payload) => {
      setAuth({
        user: payload.user,
        tokens: { accessToken: payload.token },
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.me });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authAPI.logout(),
    onSettled: () => {
      clearAuth();
      queryClient.clear();
    },
  });

  return {
    loginMutation,
    registerMutation,
    logoutMutation,
  };
};
