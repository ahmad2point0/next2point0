# Scaling

How this template grows from a solo project to a team codebase without rewriting.

## What scales by default

- **Feature slices.** New domain = new folder under `features/`. No tree-wide churn.
- **Barrel exports.** Internal renames don't break callers.
- **Typed routes and endpoints.** Refactor a URL? Change one file.
- **Validated env.** New env var? Add it to the Zod schema once, use the typed `env` everywhere.
- **Server state in TanStack Query.** Cache invalidation by key family. Optimistic updates are a one-liner.

## When the team grows

### Splitting a feature

If a feature's folder exceeds ~25 files, split it by subdomain. Example: `features/projects/` becomes `features/projects-list/` and `features/projects-detail/` once the components and hooks diverge enough that they share nothing.

### Adding more shared UI

If you find yourself copying a component between features twice, move it to `global/components/shared/`. If it's a primitive (button variant, input shape), add it to `global/components/ui/` instead.

### Code-owners

When more than ~3 engineers work in the repo, add a `.github/CODEOWNERS`:

```
src/features/auth/        @auth-team
src/features/projects/    @projects-team
src/global/               @platform-team
docs/                     @platform-team
```

### Monorepo

For multiple apps (web, marketing, admin), move to a Turborepo / Bun workspaces monorepo. Migration path:

1. Create `apps/web/` and move the current Next.js project there.
2. Move `src/global/` to `packages/ui/` and `packages/config/`.
3. Update `tsconfig.json` paths and Bun workspaces.

The feature-slice structure inside the app stays identical.

## Performance budgets

Set per-route budgets early:

- Initial JS for any page: < 200 KB compressed.
- LCP: < 2.5s on Slow 4G.
- INP: < 200ms.

The defaults (RSC, `next/font`, `optimizePackageImports: ["lucide-react"]`) get you there. When a route gets heavy, that's the signal to split.

## Observability

The template ships a no-op `analytics` stub at `src/global/lib/analytics.ts`. Wire it to your analytics provider (PostHog, Segment, Mixpanel) by replacing the `track`/`identify` implementations. The shape is intentionally provider-agnostic.

For error tracking, add Sentry's Next.js SDK following [their docs](https://docs.sentry.io/platforms/javascript/guides/nextjs/). Hook in `app/error.tsx`.

## Testing

The starter does not ship tests. When the project earns testing:

- **Unit:** Vitest. Co-locate as `*.test.ts` next to the file.
- **Component:** React Testing Library + Vitest with jsdom.
- **E2E:** Playwright. Keep specs under `e2e/`.

Add a `test` script to `package.json` and a step to the `pre-push` hook.

## Internationalization

Not built in. If you need it:

- Pick `next-intl` (server-component-friendly).
- Move all user-facing strings into translation files. The `STRINGS` constant in `global/constants/strings.ts` is a reasonable starting point.
- Wrap pages in `next-intl`'s provider via `Providers.tsx`.

## Feature flags

For runtime toggles, add a `useFlag(name)` hook backed by your flag service (LaunchDarkly, GrowthBook, PostHog). Keep flag names in `global/constants/flags.ts`.

## Don't scale prematurely

- Don't add a state manager you don't need.
- Don't add testing libraries until you have something worth testing.
- Don't extract a shared package until you have a second consumer.
- Three similar lines is better than a wrong abstraction.

The cost of waiting is small. The cost of bad early structure compounds.
