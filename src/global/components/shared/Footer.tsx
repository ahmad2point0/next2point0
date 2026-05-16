import Link from "next/link";
import { siteConfig } from "@/global/config";

export function Footer() {
  return (
    <footer className="border-border/40 bg-background border-t">
      <div className="container mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row">
        <p className="text-muted-foreground text-center text-sm">
          Built with {siteConfig.name}. © {new Date().getFullYear()} {siteConfig.creator}.
        </p>
        <nav className="text-muted-foreground flex gap-4 text-sm">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground transition-colors"
          >
            GitHub
          </a>
          <a
            href={siteConfig.links.twitter}
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Twitter
          </a>
        </nav>
      </div>
    </footer>
  );
}
