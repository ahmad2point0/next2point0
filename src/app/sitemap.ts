import type { MetadataRoute } from "next";
import { siteConfig } from "@/global/config";
import { ROUTES } from "@/global/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    ROUTES.home,
    ROUTES.login,
    ROUTES.register,
    ROUTES.dashboard,
    ROUTES.profile,
    ROUTES.settings,
  ].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === ROUTES.home ? 1 : 0.7,
  }));
}
