import Link from "next/link";
import { siteConfig } from "@/global/config";
import { ROUTES } from "@/global/constants";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="from-primary/10 via-background to-background hidden flex-col justify-between bg-linear-to-br p-10 lg:flex">
        <Link href={ROUTES.home} className="inline-flex items-center gap-2 font-semibold">
          <span className="from-primary to-foreground h-6 w-6 rounded-md bg-linear-to-br" />
          {siteConfig.name}
        </Link>
        <blockquote className="text-muted-foreground space-y-2 text-sm">
          <p className="text-foreground text-base">
            &ldquo;A starter that does not feel like a starter.&rdquo;
          </p>
          <footer>Built for shipping real products.</footer>
        </blockquote>
      </aside>
      <main className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm space-y-6">{children}</div>
      </main>
    </div>
  );
}
