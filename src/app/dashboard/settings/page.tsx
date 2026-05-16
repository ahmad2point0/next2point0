import { PageHeader } from "@/global/components/shared/PageHeader";
import { SettingsForm } from "@/features/settings";
import { buildMetadata } from "@/global/utils/seo";

export const metadata = buildMetadata({ title: "Settings", path: "/dashboard/settings" });

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" description="Manage notifications and account preferences." />
      <SettingsForm />
    </>
  );
}
