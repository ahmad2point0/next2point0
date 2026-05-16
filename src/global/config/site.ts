import { env } from "./env";

export const siteConfig = {
  name: "Next2Point0",
  shortName: "next2point0",
  description:
    "A production-ready Next.js starter template with clean architecture, Shadcn UI, dark mode, and a feature-sliced folder structure.",
  url: env.NEXT_PUBLIC_SITE_URL,
  ogImage: "/og.png",
  keywords: [
    "Next.js",
    "Starter Template",
    "TypeScript",
    "Tailwind CSS",
    "Shadcn UI",
    "App Router",
  ],
  authors: [{ name: "Muhammad Ahmad", url: "https://ahmad2point0.com" }],
  creator: "Muhammad Ahmad",
  links: {
    github: "https://github.com/ahmad2point0/next2point0",
    twitter: "https://twitter.com/ahmad2point0",
    website: "https://ahmad2point0.com",
  },
} as const;

export type SiteConfig = typeof siteConfig;
