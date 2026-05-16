"use client";

import { useMutation } from "@tanstack/react-query";
import { registerAction } from "../actions/auth.action";
import type { RegisterInput } from "../utils/authValidator";

export function useRegister() {
  return useMutation<{ ok: true }, Error, RegisterInput>({
    mutationFn: async (input) => {
      const result = await registerAction(input);
      if (!result.ok) throw new Error(result.message);
      return { ok: true };
    },
  });
}
