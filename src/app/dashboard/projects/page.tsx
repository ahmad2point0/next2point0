import { Plus } from "lucide-react";
import { Button } from "@/global/components/ui/button";
import { PageHeader } from "@/global/components/shared/PageHeader";
import { ProjectsTable } from "@/features/projects";
import { buildMetadata } from "@/global/utils/seo";

export const metadata = buildMetadata({ title: "Projects", path: "/dashboard/projects" });

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        title="Projects"
        description="All the work in flight across your workspace."
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New project
          </Button>
        }
      />
      <ProjectsTable />
    </>
  );
}
