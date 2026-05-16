# next2point0

A production-ready Next.js starter template with clean architecture, Shadcn UI, dark mode, type-safe environment variables, and a feature-sliced folder structure.

```bash
npx next2point0
```

The CLI asks for your project name, lets you pick the template, clones the right branch, removes `.git`, and installs dependencies with Bun.

## Templates

| Template           | Branch         | Includes                                                                           |
| ------------------ | -------------- | ---------------------------------------------------------------------------------- |
| Frontend           | `main`         | Next.js 16, App Router, Tailwind v4, Shadcn UI, Zustand, TanStack Query, RHF + Zod |
| Frontend + Backend | `feat/backend` | Everything in frontend + Prisma + Auth.js + server actions + protected routes      |

## What you get out of the box

- **App Router** with marketing landing, auth flow (login + register), protected dashboard with sidebar, profile and settings pages, sample Projects feature, custom 404 and error boundaries.
- **Shadcn UI** primitives (button, input, card, dialog, dropdown, form, tabs, badge, sonner toaster, and more) on top of Radix.
- **Dark mode** via `next-themes` with a class strategy. System preference is the default.
- **Forms**: `react-hook-form` + `zod` everywhere, with shared `Form*` components matching Shadcn.
- **State**: Zustand for client state (with `persist`), TanStack Query for server state.
- **API**: typed `apiClient` (axios) with token refresh interceptor, cookie storage, and typed `ApiError`.
- **Env**: Zod-validated environment with a public schema that fails fast on bad config.
- **SEO**: `buildMetadata` helper, dynamic sitemap, robots.
- **DX**: Prettier + ESLint + lint-staged + Husky (pre-commit, commit-msg, pre-push), commitlint with Conventional Commits, strict TypeScript with `noUncheckedIndexedAccess`.

## Quick start

```bash
npx next2point0
cd your-project
cp .env.example .env
bun run dev
```

Open <http://localhost:3000>.

## Scripts

| Script                 | What it does                   |
| ---------------------- | ------------------------------ |
| `bun run dev`          | Start the dev server           |
| `bun run build`        | Production build               |
| `bun run start`        | Run the production build       |
| `bun run lint`         | Run ESLint                     |
| `bun run lint:fix`     | Run ESLint with `--fix`        |
| `bun run typecheck`    | `tsc --noEmit`                 |
| `bun run format`       | Prettier write across the repo |
| `bun run format:check` | Prettier check                 |

## Folder structure (short version)

```
src/
├── app/                  Next.js App Router routes
├── features/             Feature slices (auth, dashboard, projects, profile, settings)
│   └── <feature>/
│       ├── @types/       Domain types, DTOs, response shapes
│       ├── components/   Feature-only UI
│       ├── hooks/        Feature-only hooks
│       ├── services/     API/data access for this feature
│       ├── utils/        Feature-only utils (Zod schemas, etc.)
│       └── index.ts      Public API for the feature
├── global/               Shared across features
│   ├── components/
│   │   ├── ui/           Shadcn primitives
│   │   └── shared/       Layout-level components
│   ├── config/           env, site config, apiClient
│   ├── constants/        routes, endpoints, strings
│   ├── hooks/            reusable hooks
│   ├── lib/              third-party clients (analytics, etc.)
│   ├── store/            zustand stores
│   ├── utils/            cn, formatDate, seo helper, etc.
│   └── @types/           shared types
└── styles/globals.css    Tailwind + design tokens
```

Full reference in [`docs/folder-structure.md`](docs/folder-structure.md).

## Documentation

| Topic              | Where                                                          |
| ------------------ | -------------------------------------------------------------- |
| Getting started    | [`docs/getting-started.md`](docs/getting-started.md)           |
| Architecture       | [`docs/architecture.md`](docs/architecture.md)                 |
| Folder structure   | [`docs/folder-structure.md`](docs/folder-structure.md)         |
| Conventions        | [`docs/conventions.md`](docs/conventions.md)                   |
| State management   | [`docs/state-management.md`](docs/state-management.md)         |
| API layer          | [`docs/api-layer.md`](docs/api-layer.md)                       |
| Forms + validation | [`docs/forms-and-validation.md`](docs/forms-and-validation.md) |
| Theming            | [`docs/theming.md`](docs/theming.md)                           |
| SEO                | [`docs/seo.md`](docs/seo.md)                                   |
| Scripts            | [`docs/scripts.md`](docs/scripts.md)                           |
| Deployment         | [`docs/deployment.md`](docs/deployment.md)                     |
| Scaling            | [`docs/scaling.md`](docs/scaling.md)                           |
| Contributing       | [`docs/contributing.md`](docs/contributing.md)                 |

## License

MIT.
