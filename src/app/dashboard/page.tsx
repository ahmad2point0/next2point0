import { PageHeader } from "@/global/components/shared/PageHeader";
import { DashboardOverview } from "@/features/dashboard";
import { CreateProjectDialog, ProjectsTable, projectsService } from "@/features/projects";
import { buildMetadata } from "@/global/utils/seo";

export const metadata = buildMetadata({ title: "Dashboard", path: "/dashboard" });

export default async function DashboardPage() {
  const projects = await projectsService.list();

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="A snapshot of what is happening across your team."
        actions={<CreateProjectDialog />}
      />
      <DashboardOverview />
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-lg font-semibold">Projects</h2>
            <p className="text-muted-foreground text-sm">Recent activity across your workspace.</p>
          </div>
        </div>
        <ProjectsTable projects={projects} />
      </section>
    </>
  );
}
