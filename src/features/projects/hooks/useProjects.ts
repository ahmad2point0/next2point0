"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createProjectAction,
  deleteProjectAction,
  updateProjectAction,
} from "../actions/projects.action";
import type { CreateProjectInput, UpdateProjectInput } from "../@types/projects.types";

const invalidate = (qc: ReturnType<typeof useQueryClient>) =>
  qc.invalidateQueries({ queryKey: ["projects"] });

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateProjectInput) => {
      const result = await createProjectAction(input);
      if (!result.ok) throw new Error(result.message);
      return result.data;
    },
    onSuccess: () => invalidate(qc),
  });
}

export function useUpdateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateProjectInput) => {
      const result = await updateProjectAction(input);
      if (!result.ok) throw new Error(result.message);
      return result.data;
    },
    onSuccess: () => invalidate(qc),
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteProjectAction({ id });
      if (!result.ok) throw new Error(result.message);
      return result.data;
    },
    onSuccess: () => invalidate(qc),
  });
}
