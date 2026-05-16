"use client";

import { FolderKanban, Plus } from "lucide-react";
import { Button } from "@/global/components/ui/button";
import { Skeleton } from "@/global/components/ui/skeleton";
import { EmptyState } from "@/global/components/shared/EmptyState";
import { ErrorState } from "@/global/components/shared/ErrorState";
import { useProjects } from "../hooks/useProjects";
import { ProjectCard } from "./ProjectCard";

export function ProjectsTable() {
  const { data, isLoading, isError, refetch } = useProjects();

  if (isError) {
    return (
      <ErrorState
        title="Could not load projects"
        description="We were unable to fetch your projects."
        onRetry={() => refetch()}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon={<FolderKanban className="h-6 w-6" />}
        title="No projects yet"
        description="Create your first project to start tracking work."
        action={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New project
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
