import Link from "next/link";
import { ArrowRight, Github, Sparkles, ShieldCheck, Boxes, Wand2 } from "lucide-react";
import { Button } from "@/global/components/ui/button";
import { Badge } from "@/global/components/ui/badge";
import { AppHeader } from "@/global/components/shared/AppHeader";
import { Footer } from "@/global/components/shared/Footer";
import { ROUTES } from "@/global/constants";
import { siteConfig } from "@/global/config";

const FEATURES = [
  {
    icon: Boxes,
    title: "Feature-sliced architecture",
    body: "Every feature owns its types, components, hooks, and services. Scales from solo projects to teams.",
  },
  {
    icon: Wand2,
    title: "Shadcn UI + dark mode",
    body: "Production-ready primitives with light, dark, and system themes wired in from the first commit.",
  },
  {
    icon: ShieldCheck,
    title: "Type-safe by default",
    body: "Strict TypeScript, Zod-validated env, validated forms, and a typed API client.",
  },
  {
    icon: Sparkles,
    title: "Husky + lint-staged",
    body: "Prettier, ESLint, type checks, and build verification run on the right hooks. Nothing breaks main.",
  },
] as const;

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1">
        <section className="container mx-auto max-w-6xl px-4 py-20 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-6">
              v0.1.0 • Frontend template
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
              The Next.js starter that ships.
            </h1>
            <p className="text-muted-foreground mt-6 text-lg sm:text-xl">
              {siteConfig.description}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href={ROUTES.dashboard}>
                  See the dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={siteConfig.links.github} target="_blank" rel="noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  Star on GitHub
                </a>
              </Button>
            </div>
            <div className="bg-muted/40 mt-6 inline-flex items-center gap-2 rounded-md border px-3 py-1.5 font-mono text-sm">
              <span className="text-muted-foreground">$</span>
              <span>npx next2point0</span>
            </div>
          </div>
        </section>

        <section className="container mx-auto max-w-6xl px-4 pb-20">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="bg-card hover:bg-card/80 rounded-xl border p-6 transition-colors"
              >
                <div className="bg-primary/10 text-primary mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-muted-foreground mt-2 text-sm">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-muted/30 border-t">
          <div className="container mx-auto max-w-6xl px-4 py-16 text-center">
            <h2 className="text-3xl font-semibold tracking-tight">Two templates, one CLI.</h2>
            <p className="text-muted-foreground mx-auto mt-3 max-w-2xl">
              Choose the frontend template to ship a marketing site or a client-only app. Choose the
              fullstack template when you need Prisma, Auth.js, server actions, and a typed
              database.
            </p>
            <div className="mt-6 flex justify-center">
              <Button asChild>
                <Link href={ROUTES.register}>
                  Get started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
