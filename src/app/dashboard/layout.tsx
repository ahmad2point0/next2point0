import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AppHeader } from "@/global/components/shared/AppHeader";
import { Sidebar } from "@/global/components/shared/Sidebar";
import { ROUTES } from "@/global/constants";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect(ROUTES.login);

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10">
          <div className="mx-auto w-full max-w-5xl space-y-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
