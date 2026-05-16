# SEO

Set once in `siteConfig`, used everywhere through `buildMetadata`.

## Site defaults

`src/global/config/site.ts`:

```ts
export const siteConfig = {
  name: "Next2Point0",
  description: "A production-ready Next.js starter template...",
  url: env.NEXT_PUBLIC_SITE_URL,
  ogImage: "/og.png",
  keywords: [...],
  authors: [...],
  links: { github, twitter, website },
};
```

Edit this when you start your project.

## Per-page metadata

Use `buildMetadata` in every page:

```tsx
import { buildMetadata } from "@/global/utils/seo";

export const metadata = buildMetadata({
  title: "Dashboard",
  description: "A snapshot of what is happening across your team.",
  path: "/dashboard",
});
```

`buildMetadata` returns a Next.js `Metadata` object with title, description, canonical URL, OG tags, Twitter card, and keywords filled in. It uses `siteConfig` for defaults.

### Options

- `title` — appended as `"{title} | {siteName}"`. Omit for the root.
- `description` — falls back to `siteConfig.description`.
- `path` — relative path used to build the canonical URL.
- `image` — override the OG image for this page.
- `noIndex` — set to `true` to add `robots: noindex, nofollow`.

## OG image

Drop a 1200x630 PNG at `public/og.png`. `buildMetadata` references it by default.

For dynamic OG images (per-page screenshots), add a route at `src/app/og/route.tsx` using `next/og` and update `buildMetadata` to point at it. Out of scope for the starter.

## Sitemap

`src/app/sitemap.ts` generates the sitemap from `ROUTES`. When you add a new public route, add it to that list.

```ts
import { ROUTES } from "@/global/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  return [ROUTES.home, ROUTES.login, ...].map(...);
}
```

## Robots

`src/app/robots.ts`:

```ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
```

Adjust the `disallow` list if you have admin or staging routes you don't want indexed.

## Structured data

Not built in. If your product benefits from JSON-LD (articles, products, breadcrumbs), add a `<script type="application/ld+json">` per page or use a helper. Schema.org is a useful reference.

## Performance

SEO and Core Web Vitals overlap. The defaults here help:

- App Router with React Server Components reduces JS payload.
- `next/font` removes layout shift from web fonts.
- `next/image` for any image work (the template uses `next.config.ts` `images.remotePatterns`).
- TanStack Query's `staleTime` reduces refetch chatter.

Audit each release with Lighthouse or PageSpeed Insights.
