"use client";

import { useQuery } from "@tanstack/react-query";
import { projectsService } from "../services/projects.service";

export function useProjects() {
  return useQuery({
    queryKey: ["projects", "list"],
    queryFn: () => projectsService.list(),
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ["projects", id],
    queryFn: () => projectsService.get(id),
    enabled: !!id,
  });
}
