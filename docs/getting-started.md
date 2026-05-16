# Getting started

## Prerequisites

- [Bun](https://bun.sh) >= 1.0 (recommended) or Node.js >= 20 with npm/pnpm
- Git
- A code editor with TypeScript support

## Install with the CLI

```bash
npx next2point0
```

The CLI will ask for:

1. **Project name** — the folder it creates.
2. **Template type** — `1` for Frontend, `2` for Frontend + Backend.

It clones the matching branch, strips `.git`, and runs `bun install`.

## Manual install

```bash
git clone --branch main --single-branch https://github.com/ahmad2point0/next2point0.git my-app
cd my-app
rm -rf .git
bun install
cp .env.example .env
bun run dev
```

For the fullstack variant, replace `main` with `feat/backend`.

## Environment variables

Copy `.env.example` to `.env` and fill in values. Variables are validated at startup by [`src/global/config/env.ts`](../src/global/config/env.ts). Missing or invalid values throw with a clear message.

| Variable                   | Required | Description                         |
| -------------------------- | -------- | ----------------------------------- |
| `NEXT_PUBLIC_SITE_URL`     | Yes      | Public URL used in metadata/sitemap |
| `NEXT_PUBLIC_API_URL`      | Yes      | API base URL the browser hits       |
| `NEXT_PUBLIC_ANALYTICS_ID` | No       | Optional analytics ID               |

## First run

```bash
bun run dev
```

Open <http://localhost:3000>. You should see:

- A marketing landing page with the theme toggle, GitHub link, and CLI command.
- `/login` and `/register` with `react-hook-form` + `zod` validation.
- `/dashboard` with stats cards (skeleton loading) and a Projects grid (empty state, loading state, and error state all wired).
- `/dashboard/profile` with an editable profile form.
- `/dashboard/settings` with notification toggles.

## What to change first

1. **`src/global/config/site.ts`** — name, description, links.
2. **`src/global/config/env.ts`** — add your own env vars and Zod schema entries.
3. **`public/og.png`** — drop in a 1200x630 social preview image.
4. **`README.md`** — replace this template's pitch with your project's.

## Editor setup

- Install the Prettier extension and enable "Format on Save".
- Install the ESLint extension.
- Install the Tailwind CSS IntelliSense extension. It will pick up the canonical class names.

## Next steps

- Read [`docs/architecture.md`](architecture.md) to understand the feature-slice pattern.
- Read [`docs/conventions.md`](conventions.md) for naming and import rules.
- Read [`CLAUDE.md`](../CLAUDE.md) if you use AI coding assistants.
