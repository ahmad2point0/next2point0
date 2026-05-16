import { Plus } from "lucide-react";
import { Button } from "@/global/components/ui/button";
import { PageHeader } from "@/global/components/shared/PageHeader";
import { DashboardOverview } from "@/features/dashboard";
import { ProjectsTable } from "@/features/projects";
import { buildMetadata } from "@/global/utils/seo";

export const metadata = buildMetadata({ title: "Dashboard", path: "/dashboard" });

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="A snapshot of what is happening across your team."
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New project
          </Button>
        }
      />
      <DashboardOverview />
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-lg font-semibold">Projects</h2>
            <p className="text-muted-foreground text-sm">Recent activity across your workspace.</p>
          </div>
        </div>
        <ProjectsTable />
      </section>
    </>
  );
}
