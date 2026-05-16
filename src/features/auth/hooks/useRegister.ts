"use client";

import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { useAuthStore } from "@/global/store";
import type { RegisterDto } from "../@types/auth.dto";
import type { AuthResponse } from "../@types/auth.response";

export function useRegister() {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation<AuthResponse, Error, RegisterDto>({
    mutationFn: (dto) => authService.register(dto),
    onSuccess: (response) => {
      setUser(response.user);
    },
  });
}
