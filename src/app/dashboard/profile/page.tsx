import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Card, CardContent } from "@/global/components/ui/card";
import { PageHeader } from "@/global/components/shared/PageHeader";
import { ProfileForm } from "@/features/profile";
import { prisma } from "@/global/lib/prisma";
import { buildMetadata } from "@/global/utils/seo";
import { ROUTES } from "@/global/constants";

export const metadata = buildMetadata({ title: "Profile", path: "/dashboard/profile" });

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect(ROUTES.login);

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, bio: true },
  });

  return (
    <>
      <PageHeader title="Profile" description="Update how others see you across the product." />
      <Card>
        <CardContent className="pt-6">
          <ProfileForm
            defaultValues={{
              name: user?.name ?? "",
              email: user?.email ?? "",
              bio: user?.bio ?? "",
            }}
          />
        </CardContent>
      </Card>
    </>
  );
}
