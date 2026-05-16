import { Card, CardContent } from "@/global/components/ui/card";
import { PageHeader } from "@/global/components/shared/PageHeader";
import { ProfileForm } from "@/features/profile";
import { buildMetadata } from "@/global/utils/seo";

export const metadata = buildMetadata({ title: "Profile", path: "/dashboard/profile" });

export default function ProfilePage() {
  return (
    <>
      <PageHeader title="Profile" description="Update how others see you across the product." />
      <Card>
        <CardContent className="pt-6">
          <ProfileForm
            defaultValues={{
              name: "Jane Doe",
              email: "jane@example.com",
              bio: "Product engineer building tools for distributed teams.",
            }}
          />
        </CardContent>
      </Card>
    </>
  );
}
