"use client";

import { useTransition } from "react";
import { FolderKanban, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/global/components/ui/button";
import { EmptyState } from "@/global/components/shared/EmptyState";
import { CreateProjectDialog } from "./CreateProjectDialog";
import { useDeleteProject } from "../hooks/useProjects";
import type { Project } from "../@types/projects.types";
import { ProjectCard } from "./ProjectCard";

interface ProjectsTableProps {
  projects: Project[];
}

export function ProjectsTable({ projects }: ProjectsTableProps) {
  const [, startTransition] = useTransition();
  const deleteProject = useDeleteProject();

  const onDelete = (id: string) => {
    startTransition(() => {
      deleteProject.mutate(id, {
        onSuccess: () => toast.success("Project deleted"),
        onError: (error) => toast.error(error.message),
      });
    });
  };

  if (projects.length === 0) {
    return (
      <EmptyState
        icon={<FolderKanban className="h-6 w-6" />}
        title="No projects yet"
        description="Create your first project to start tracking work."
        action={<CreateProjectDialog />}
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <div key={project.id} className="relative">
          <ProjectCard project={project} />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label={`Delete ${project.name}`}
            className="absolute right-3 bottom-3 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
            onClick={() => onDelete(project.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
