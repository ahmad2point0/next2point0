# Conventions

## Naming

| Kind                   | Style                           | Example                               |
| ---------------------- | ------------------------------- | ------------------------------------- |
| Folder                 | kebab-case                      | `dashboard/`, `auth/`                 |
| Shadcn UI file         | kebab-case                      | `button.tsx`, `dropdown-menu.tsx`     |
| Shared component file  | PascalCase                      | `AppHeader.tsx`                       |
| Feature component file | PascalCase                      | `LoginForm.tsx`                       |
| Hook file              | camelCase starting with `use`   | `useDebounce.ts`                      |
| Service file           | `<feature>.service.ts`          | `auth.service.ts`                     |
| Type files             | `<feature>.types.ts`, `.dto.ts` | `auth.dto.ts`                         |
| Zustand store          | `<name>.store.ts`               | `auth.store.ts`                       |
| Constant export        | UPPER_SNAKE_CASE                | `ROUTES`, `AUTH_ENDPOINTS`            |
| Component export       | PascalCase, named               | `export function LoginForm()`         |
| Hook export            | camelCase                       | `export function useLogin()`          |
| Page default export    | PascalCase ending in `Page`     | `export default function LoginPage()` |

## Import order

```ts
// 1. Built-ins
import path from "node:path";

// 2. External packages
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

// 3. Internal absolute imports (@/...)
import { Button } from "@/global/components/ui/button";
import { authService } from "@/features/auth";

// 4. Sibling/relative imports
import { loginSchema } from "../utils/authValidator";

// 5. Type-only imports go with their group, marked
import type { LoginDto } from "../@types/auth.dto";
```

Always import from a feature's barrel for cross-feature use: `import { LoginForm } from "@/features/auth"` — not `from "@/features/auth/components/LoginForm"`.

## Component rules

- One component per file. Filename matches component name.
- Named exports for shared and feature components.
- Default exports only for Next.js route files (`page.tsx`, `layout.tsx`, etc.).
- Server components by default. Add `"use client"` only when needed.
- Typed props. No `any`. No `React.FC`.
- Target ~200 lines per component. Split when bigger.
- Every list-rendering component handles three states: loading, error, empty.

## Forms

- `react-hook-form` + `zod` + `@hookform/resolvers/zod`.
- Schemas in `features/<feature>/utils/<feature>Validator.ts`.
- Use Shadcn `Form*` components (`Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage`, `FormDescription`).
- Submit handlers receive validated values, not raw form events.

## Comments

Default: write none. Names should explain what.

Write a comment when **why** is non-obvious:

```ts
// The third-party API ignores 'page' below 2 — pre-emptively skip the first page.
```

Don't write:

```ts
// This function logs the user in
function login() { ... }
```

Don't reference current work in comments. PR descriptions and commits are where that lives.

## TypeScript

- `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride` are all on.
- No `any`. Use `unknown` and narrow with type guards.
- Prefer `interface` for object shapes, `type` for unions/aliases.
- `import type` for type-only imports.
- Feature barrels export both values and types: `export { authService } from "./services"; export type { LoginDto } from "./@types"`.

## Tailwind

- Use design tokens: `bg-background`, `text-foreground`, `bg-muted`, `border-border`. No hex.
- Prefer canonical class names (Tailwind v4): `bg-linear-to-br`, `supports-backdrop-filter:...`.
- Order with `prettier-plugin-tailwindcss` (already configured).
- Use `cn()` from `@/global/utils/cn` to combine conditional classes.

## Routes

Use the typed `ROUTES` map:

```ts
import { ROUTES } from "@/global/constants";

<Link href={ROUTES.dashboard}>Dashboard</Link>
```

Never hardcode `"/dashboard"`.

## Git commits

Format: `<type>(<scope>): <subject>`.

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

Examples:

- `feat(projects): add empty state for project list`
- `fix(auth): handle expired refresh tokens`
- `chore(deps): bump tailwindcss to 4.0.0`

`commitlint` enforces this via the `commit-msg` hook.

## Branches

- `main` — frontend template, always shippable.
- `feat/backend` — fullstack template, kept in sync with `main` via merge.
- Feature branches: `feat/<short-description>` (`feat/projects-bulk-actions`).
- Bug fix branches: `fix/<short-description>`.

## Pull requests

- Title in conventional-commit style.
- Description includes: what changed, why, screenshots for UI changes, manual test steps.
- Husky already enforces lint + typecheck + build before push. CI should re-run them.
