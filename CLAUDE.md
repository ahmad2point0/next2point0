# CLAUDE.md — next2point0 (frontend template)

This document tells AI assistants (Claude Code, Cursor, Copilot, etc.) how to work in this codebase. Follow these rules unless the human explicitly overrides them.

## Repository overview

A production-ready Next.js 16 starter template. App Router. TypeScript strict. Tailwind v4 + Shadcn UI. Feature-sliced architecture. Distributed via `npx next2point0`.

Two branches:

- `main` — frontend-only template. No database, no server-side auth. Auth runs against an external API via the service layer.
- `feat/backend` — frontend + Prisma + Auth.js + server actions. This file is replaced there with backend-specific rules.

## Folder structure rules

```
src/
├── app/                  Next.js App Router. Pages are thin and compose features only.
├── features/<feature>/
│   ├── @types/           Domain types, request DTOs, response shapes
│   ├── components/       UI used only inside this feature
│   ├── hooks/            React hooks used only inside this feature
│   ├── services/         API calls and business logic for this feature
│   ├── utils/            Zod schemas, feature-only helpers
│   ├── actions/          Server actions (frontend template: stubs only)
│   └── index.ts          Public API. Outside code imports from here, not from internals.
├── global/               Anything shared across features
│   ├── components/ui/    Shadcn primitives. Lowercase-kebab filenames.
│   ├── components/shared/ Layout-level shared components. PascalCase filenames.
│   ├── config/           env (Zod-validated), site config, apiClient
│   ├── constants/        Typed route map, endpoints, user-facing strings
│   ├── hooks/            Reusable hooks (useDebounce, useMediaQuery, etc.)
│   ├── lib/              Third-party clients (analytics, etc.)
│   ├── store/            Zustand stores
│   ├── utils/            cn, formatDate, formatCurrency, seo helper, etc.
│   └── @types/           Cross-feature primitive types
└── styles/globals.css    Tailwind import + design tokens (CSS variables)
```

**Rule:** Features do not import from each other. If feature A needs something from feature B, that thing is shared and moves to `global/`.

**Rule:** App route files (`page.tsx`, `layout.tsx`) stay thin. They compose feature components and shared layout. They do not contain domain logic.

**Rule:** Outside code imports from `@/features/<feature>` (the barrel), not from `@/features/<feature>/components/...`. Internals can use deep paths freely.

## Naming conventions

| Kind                   | Style                                           | Example                               |
| ---------------------- | ----------------------------------------------- | ------------------------------------- |
| Folder                 | kebab-case                                      | `dashboard/`, `auth/`                 |
| Shadcn UI file         | kebab-case                                      | `button.tsx`, `dropdown-menu.tsx`     |
| Shared component file  | PascalCase                                      | `AppHeader.tsx`, `Sidebar.tsx`        |
| Feature component file | PascalCase                                      | `LoginForm.tsx`, `ProjectCard.tsx`    |
| Hook file              | camelCase starting with `use`                   | `useDebounce.ts`, `useProjects.ts`    |
| Service file           | `<feature>.service.ts`                          | `auth.service.ts`                     |
| Type file              | `<feature>.types.ts`, `.dto.ts`, `.response.ts` | `auth.types.ts`                       |
| Validator file         | `<feature>Validator.ts`                         | `authValidator.ts`                    |
| Zustand store          | `<name>.store.ts`                               | `auth.store.ts`                       |
| Constant export        | UPPER_SNAKE_CASE                                | `ROUTES`, `AUTH_ENDPOINTS`            |
| Component export       | PascalCase named export                         | `export function LoginForm()`         |
| Hook export            | camelCase                                       | `export function useLogin()`          |
| Page default export    | PascalCase, ends in `Page`                      | `export default function LoginPage()` |

## Import order

Group imports with a blank line between groups:

1. Built-in modules (`node:fs`, etc.)
2. External packages (`react`, `next`, `@tanstack/react-query`, `zod`, …)
3. Internal absolute imports (`@/global/...`, `@/features/<feature>`)
4. Sibling and relative imports (`./Component`, `../utils/...`)
5. Type-only imports use `import type { ... }` and go with their group

Prefer importing from the feature's barrel: `import { LoginForm } from "@/features/auth"`.

## Component rules

- One component per file. The filename matches the component name.
- Named exports for everything except Next.js route files (`page.tsx`, `layout.tsx`, `error.tsx`, `loading.tsx`, `not-found.tsx`), which use `export default`.
- Server components by default. Add `"use client"` only when you actually need state, effects, browser APIs, or event handlers.
- Props get a typed interface or inline type. No `any`. No `React.FC`.
- Component files stay under ~200 lines. If a component grows past that, split it.
- Every list-rendering component must handle three states: loading, error, empty. Use `Skeleton`, `ErrorState`, and `EmptyState` from `@/global/components`.

## State management

- **Server state** = anything that comes from the network. Use TanStack Query through a feature hook. Never call services directly from a component.
- **Client state** = UI state, form state, ephemeral toggles. Local `useState` first. Lift to a Zustand store only when more than one component needs it.
- **Persisted client state** = use Zustand `persist` middleware (see `src/global/store/auth.store.ts`).
- **No React Context** for anything Zustand can handle.
- **No Redux**.
- Stores live in `src/global/store/` and are imported by name: `useAuthStore`, `useUiStore`.

## API layer

- One axios instance: `src/global/config/apiClient.ts`. Never create another.
- All requests go through a service: `features/<feature>/services/<feature>.service.ts`.
- Services return typed data. They throw `ApiError` on failure (interceptor converts axios errors).
- Endpoints live in `src/global/constants/endpoints.ts` as typed constants. No inline path strings.
- Hooks wrap services with `useQuery` or `useMutation`. The query key follows `[feature, scope, ...args]` shape: `["projects", "list"]`, `["projects", id]`.
- Token refresh happens automatically via the response interceptor in `apiClient.ts`. Do not duplicate.

## Forms and validation

- All forms use `react-hook-form` + `zod` + `@hookform/resolvers/zod`.
- Schemas live in `features/<feature>/utils/<feature>Validator.ts`. Export the schema and the inferred type: `export const loginSchema = z.object({...}); export type LoginInput = z.infer<typeof loginSchema>;`.
- Use the Shadcn `Form*` components from `@/global/components/ui/form`. Do not roll a custom field/error display.
- Server-side validation in `feat/backend` uses the same Zod schemas — share, don't duplicate.

## Error handling

- Network errors throw `ApiError`. Catch in the mutation/query layer, not the component, when possible.
- User-facing errors go through `sonner` toasts: `toast.error(message)`.
- Inline form errors are rendered by `FormMessage`.
- Page-level errors are caught by `app/error.tsx` (`ErrorState` + reset button).
- Loading-state UI uses `Skeleton` matching the final layout. No spinner-on-blank-page.

## SEO and metadata

- Use `buildMetadata({ title, description, path })` from `@/global/utils/seo`. Do not write raw `Metadata` objects in pages.
- Site-wide defaults live in `src/global/config/site.ts`.
- Update `sitemap.ts` when you add a new public route.

## Theming

- Colors are CSS variables in `src/styles/globals.css`. Use Tailwind utilities backed by tokens: `bg-background`, `text-foreground`, `bg-muted`, `text-muted-foreground`, `border-border`, `bg-primary`, etc.
- Never hardcode hex/RGB in components.
- Dark mode is class-based (`.dark`) via `next-themes`. To preview, click the theme toggle in the header.
- Tailwind v4: prefer canonical class names (`bg-linear-to-br`, not `bg-gradient-to-br`; `supports-backdrop-filter:...`, not `supports-[backdrop-filter]:...`).

## Comment policy

- Default to writing no comments. Names should explain what.
- Add a comment only when the **why** is non-obvious: a hidden constraint, a workaround for a specific bug, a subtle invariant, or behavior that would surprise a reader.
- Never write multi-paragraph docstrings or "this function does X" comments.
- Never reference current tasks, fixes, or "added for X" in comments — that belongs in PR descriptions.

## File and module size

- Components target ~200 lines. Split when bigger.
- Service files target ~150 lines. Split when bigger (e.g., `projects.list.ts`, `projects.mutate.ts`).
- Zod schemas can live in one file per feature.
- Barrel `index.ts` files are public API. They should be obvious and short — re-exports only.

## TypeScript rules

- `strict: true`. `noUncheckedIndexedAccess: true`. `noImplicitOverride: true`.
- No `any`. Use `unknown` and narrow.
- Prefer `type` for unions/aliases and `interface` for object shapes that may be extended.
- Public API of a feature exports types alongside values: `export type { Project } from "./@types"`.
- `import type` for type-only imports.

## What not to do

- Don't import across features. Move shared code to `global/`.
- Don't add a feature folder without a barrel `index.ts`.
- Don't inline endpoint strings. Use `AUTH_ENDPOINTS`, `PROJECTS_ENDPOINTS`.
- Don't call `process.env.X` directly outside `src/global/config/env.ts`. Always go through the validated `env` export.
- Don't add backend-only deps (Prisma, Auth.js, etc.) on `main`. They belong on `feat/backend`.
- Don't bypass Husky hooks with `--no-verify`. Fix the issue.
- Don't introduce a new state manager. Zustand for client, TanStack Query for server.
- Don't introduce a new HTTP client. Use `apiClient`.
- Don't write inline styles. Use Tailwind utilities.
- Don't add components or hooks that aren't actually used by the template's example pages — keep the template lean.

## When making changes

1. Read the relevant feature's barrel `index.ts` first to understand the public API.
2. Search for existing primitives in `@/global/components/ui` and `@/global/components/shared` before building new ones.
3. If a new pattern needs to be invented, ask whether it can be done with what exists.
4. Run `bun run lint`, `bun run typecheck`, `bun run build` before declaring done.
5. Update `docs/` and this `CLAUDE.md` if the rules change.

## Conventional commits

Format: `<type>(<scope>): <subject>`. Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`. Examples:

- `feat(projects): add Projects table with empty state`
- `fix(auth): handle 401 from refresh endpoint`
- `chore(deps): bump next to 16.2.6`

`commitlint` enforces this on `commit-msg`.
