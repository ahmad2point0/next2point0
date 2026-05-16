"use client";

import { useMutation } from "@tanstack/react-query";
import { loginAction } from "../actions/auth.action";
import type { LoginInput } from "../utils/authValidator";

export function useLogin() {
  return useMutation<{ ok: true }, Error, LoginInput>({
    mutationFn: async (input) => {
      const result = await loginAction(input);
      if (!result.ok) throw new Error(result.message);
      return { ok: true };
    },
  });
}
