"use client";

import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { useAuthStore } from "@/global/store";
import type { LoginDto } from "../@types/auth.dto";
import type { AuthResponse } from "../@types/auth.response";

export function useLogin() {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation<AuthResponse, Error, LoginDto>({
    mutationFn: (dto) => authService.login(dto),
    onSuccess: (response) => {
      setUser(response.user);
    },
  });
}
