# Architecture

This template uses a **feature-sliced** architecture. Code is organized by business feature, not by technical layer. Every feature is a self-contained module with its own types, components, hooks, services, and utils.

## Why feature-slice

Most starters group code by type: every component in `components/`, every hook in `hooks/`, every API call in `api/`. That works for tiny apps and breaks at scale. When you delete a feature you have to hunt through five folders. When you onboard someone new, they read the whole tree before they can find anything.

Feature slices fix this. To delete a feature, you delete its folder. To understand a feature, you read one folder. To enforce boundaries, you only export through the feature's barrel.

## The layers

```
src/
├── app/         Routing only. Pages compose features.
├── features/    Business features. Each is independent.
└── global/      Anything shared across features.
```

### `src/app/`

Next.js App Router files: `layout.tsx`, `page.tsx`, `error.tsx`, `loading.tsx`, `not-found.tsx`, `sitemap.ts`, `robots.ts`.

Pages stay thin. They:

- Set metadata via `buildMetadata`.
- Compose feature components and shared layout components.
- Do **not** contain business logic, data fetching, or domain types.

### `src/features/<feature>/`

A feature owns:

- `@types/` — domain types, request DTOs, response shapes.
- `components/` — UI used inside this feature.
- `hooks/` — React hooks used inside this feature.
- `services/` — API calls and business logic.
- `utils/` — Zod schemas and feature-only helpers.
- `actions/` — Server actions (frontend template: stubs; backend template: real).
- `index.ts` — Public API. Outside code imports from here.

**Features do not import from other features.** If two features need the same thing, that thing is shared and moves to `global/`.

### `src/global/`

Cross-cutting code. Sub-folders:

- `components/ui/` — Shadcn primitives (button, input, card, dialog, form, etc.).
- `components/shared/` — Layout-level components (AppHeader, Sidebar, Footer, Providers, EmptyState, ErrorState).
- `config/` — `env` (Zod-validated), `siteConfig`, `apiClient`.
- `constants/` — `ROUTES`, `AUTH_ENDPOINTS`, `STRINGS`.
- `hooks/` — `useDebounce`, `useMediaQuery`, `useLocalStorage`, `useToggle`, `useMounted`.
- `lib/` — third-party clients (analytics today; Prisma/Supabase on `feat/backend`).
- `store/` — Zustand stores.
- `utils/` — `cn`, `formatDate`, `formatCurrency`, `buildMetadata`, etc.
- `@types/` — primitive cross-cutting types (`Paginated`, `ApiResult`, `Nullable`).

## Data flow inside a feature

```
Component ── uses ──▶ Hook ── wraps ──▶ Service ── calls ──▶ apiClient ──▶ network
                                            │
                                            ▼
                                   Zod schemas (utils)
```

Concrete example for `auth`:

```
LoginForm.tsx ── useLogin() ── authService.login() ── apiClient.post(AUTH_ENDPOINTS.login)
                  │
                  ▼
            loginSchema (Zod)
```

A component never calls `apiClient` directly. A service never reads from a Zustand store directly — components do that and pass values down.

## Barrel exports

Every feature has an `index.ts` that re-exports its public API. Outside code imports from the barrel:

```ts
// Good
import { LoginForm, useLogin } from "@/features/auth";

// Bad
import { LoginForm } from "@/features/auth/components/LoginForm";
```

The barrel is the contract. Renaming an internal file does not break callers as long as the barrel still exports the same name.

## When to add a new feature

A new feature folder is justified when:

- It owns a meaningful piece of domain (auth, projects, billing, settings).
- It has its own types, services, or hooks that wouldn't make sense outside this slice.
- It composes its own components on its own pages.

A new feature is **not** justified for:

- A single reusable component → put it in `global/components/shared/`.
- A utility function → put it in `global/utils/`.
- A constant or type used by multiple features → put it in `global/`.

## When to share across features

The first time two features need the same thing, copy it. The second time, move it to `global/` and update both imports. Don't pre-share.

## Server vs client components

- Default: server. Pages, layouts, and most components stay server.
- Client: any component that uses state, effects, event handlers, browser APIs, or hooks like `useTheme`. Mark with `"use client"` at the top.
- The boundary is intentional. Push `"use client"` as deep as possible.

## See also

- [`folder-structure.md`](folder-structure.md) — file-by-file reference
- [`state-management.md`](state-management.md) — Zustand vs TanStack Query
- [`api-layer.md`](api-layer.md) — services, hooks, query keys
- [`conventions.md`](conventions.md) — naming and imports
