import { PageHeader } from "@/global/components/shared/PageHeader";
import { CreateProjectDialog, ProjectsTable, projectsService } from "@/features/projects";
import { buildMetadata } from "@/global/utils/seo";

export const metadata = buildMetadata({ title: "Projects", path: "/dashboard/projects" });

export default async function ProjectsPage() {
  const projects = await projectsService.list();

  return (
    <>
      <PageHeader
        title="Projects"
        description="All the work in flight across your workspace."
        actions={<CreateProjectDialog />}
      />
      <ProjectsTable projects={projects} />
    </>
  );
}
