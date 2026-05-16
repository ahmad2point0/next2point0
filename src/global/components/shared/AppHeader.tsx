import Link from "next/link";
import { Github } from "lucide-react";
import { auth } from "@/auth";
import { Button } from "@/global/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";
import { ROUTES } from "@/global/constants";
import { siteConfig } from "@/global/config";

const NAV_LINKS = [
  { href: ROUTES.home, label: "Home" },
  { href: ROUTES.dashboard, label: "Dashboard" },
] as const;

export async function AppHeader() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="border-border/40 bg-background/80 supports-backdrop-filter:bg-background/60 sticky top-0 z-40 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href={ROUTES.home} className="flex items-center gap-2 font-semibold">
            <span className="from-primary to-foreground inline-block h-6 w-6 rounded-md bg-linear-to-br" />
            <span>{siteConfig.name}</span>
          </Link>
          <nav className="text-muted-foreground hidden gap-4 text-sm sm:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="icon">
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub repository"
            >
              <Github className="h-4 w-4" />
            </a>
          </Button>
          <ThemeToggle />
          {user ? (
            <UserMenu
              name={user.name ?? user.email ?? "Account"}
              email={user.email ?? ""}
              imageUrl={user.image}
            />
          ) : (
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link href={ROUTES.login}>Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
