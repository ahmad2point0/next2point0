import { Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/global/components/ui/card";
import { Badge } from "@/global/components/ui/badge";
import { formatRelative } from "@/global/utils";
import type { Project } from "../@types/projects.types";

const STATUS_VARIANT: Record<Project["status"], "default" | "secondary" | "outline"> = {
  active: "default",
  paused: "secondary",
  completed: "outline",
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div className="space-y-1">
          <CardTitle className="text-base">{project.name}</CardTitle>
          <CardDescription>{project.description}</CardDescription>
        </div>
        <Badge variant={STATUS_VARIANT[project.status]} className="capitalize">
          {project.status}
        </Badge>
      </CardHeader>
      <CardContent className="text-muted-foreground flex items-center justify-between text-xs">
        <span className="inline-flex items-center gap-1">
          <Users className="h-3.5 w-3.5" />
          {project.members} member{project.members === 1 ? "" : "s"}
        </span>
        <span>Updated {formatRelative(project.updatedAt)}</span>
      </CardContent>
    </Card>
  );
}
