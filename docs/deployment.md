# Deployment

The frontend template is a standard Next.js App Router app. It deploys anywhere that runs Next.js.

## Vercel (recommended)

1. Push your repo to GitHub.
2. In Vercel, click "Add New Project" and select the repo.
3. Set environment variables (Settings → Environment Variables):
   - `NEXT_PUBLIC_SITE_URL` — your production URL
   - `NEXT_PUBLIC_API_URL` — your backend API URL
   - `NEXT_PUBLIC_ANALYTICS_ID` (optional)
4. Deploy.

Vercel autodetects Next.js. No `vercel.json` needed for the default case.

## Cloudflare Pages

Next.js on Cloudflare Pages works via `@cloudflare/next-on-pages`. Use Node.js compatibility mode. Document this when you adopt it — out of scope for the starter.

## Docker

Create a `Dockerfile`:

```dockerfile
FROM oven/bun:1 AS base
WORKDIR /app

FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN bun run build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
EXPOSE 3000
CMD ["bun", "run", "start"]
```

Build and run:

```bash
docker build -t my-app .
docker run -p 3000:3000 --env-file .env my-app
```

Switch to `output: "standalone"` in `next.config.ts` for smaller images if you don't need full `node_modules` at runtime.

## Environment variables in CI/CD

Use your platform's secrets store. Never commit `.env`.

Required:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_API_URL`

Optional:

- `NEXT_PUBLIC_ANALYTICS_ID`

## Build verification before deploy

Run locally before pushing a release:

```bash
bun run lint
bun run typecheck
bun run build
```

The `pre-push` hook does this automatically, but CI should re-run it.

## Post-deploy checks

- Hit the home page and verify metadata is correct (view source, check `<title>` and OG tags).
- Visit `/sitemap.xml` and `/robots.txt`.
- Toggle dark mode and confirm persistence across reloads.
- Test the login form — error toast on bad creds, redirect on success.
- Lighthouse audit. Target ≥ 95 on Performance and SEO for the marketing pages.
