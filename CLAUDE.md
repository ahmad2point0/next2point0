# CLAUDE.md — next2point0 (fullstack template, `feat/backend`)

This document tells AI assistants (Claude Code, Cursor, Copilot, etc.) how to work in this codebase. Follow these rules unless the human explicitly overrides them.

## Repository overview

Next2point0 fullstack template. Everything in the frontend template, plus:

- **Database**: PostgreSQL + Prisma.
- **Auth**: Auth.js v5 (NextAuth) with Credentials and optional GitHub provider. JWT session strategy. Cookie-based.
- **Mutations**: Server Actions, validated with Zod.
- **Reads**: Server components call services directly. No client-side data fetching for the protected pages.
- **Boundary**: Repositories own Prisma. Services own auth/session checks. Actions own validation + revalidation. Components stay UI-only.

Branches:

- `main` — frontend-only template. Auth happens against an external API.
- `feat/backend` (this branch) — fullstack template.

When you fix a bug or add a shared feature that also makes sense on `main`, prefer to land it on `main` first and merge forward.

## Folder structure rules

Same as the frontend template, with these additions:

```
prisma/
├── schema.prisma         Database schema
└── seed.ts               Seed script

src/
├── auth.config.ts        Edge-safe Auth.js config (used by middleware)
├── auth.ts               Full Auth.js config with providers (server-only)
├── middleware.ts         Protected-route middleware
├── app/api/
│   ├── auth/[...nextauth]/route.ts    Auth.js handlers
│   └── health/route.ts                /api/health
├── features/<feature>/
│   ├── actions/<feature>.action.ts   Server actions (validated, return ActionResult<T>)
│   ├── repository/<feature>.repo.ts  The ONLY layer that touches Prisma
│   └── services/<feature>.service.ts Session checks + business logic
└── global/
    ├── config/env.server.ts    Server-only Zod-validated env (DATABASE_URL, AUTH_SECRET, ...)
    └── lib/prisma.ts           Singleton Prisma client (server-only)
```

## Data flow (read)

```
Server Component (page.tsx)
  └─▶ service.list()              [requires session]
       └─▶ repository.listForUser(ownerId)
            └─▶ prisma.<model>.findMany(...)
```

## Data flow (write)

```
Client Form (RHF + Zod)
  └─▶ mutation hook (useCreateProject)
       └─▶ server action (createProjectAction)        [validates again with Zod]
            └─▶ service.create(input)                  [requires session]
                 └─▶ repository.create(ownerId, input)
                      └─▶ prisma.<model>.create(...)
       └─▶ revalidatePath("/dashboard")
       └─▶ queryClient.invalidateQueries({ queryKey: ["projects"] })
```

## Auth rules

- **Read the session** via `await auth()` from `@/auth` in server components, actions, and services.
- **`middleware.ts` already protects `/dashboard/**`** via the `authorized`callback in`auth.config.ts`. Don't duplicate per-page session checks unless you need granular logic.
- **`auth.config.ts` is edge-safe.** It cannot import `bcrypt`, `prisma`, or other Node-only modules. The full provider list with credential checks lives in `auth.ts`.
- **`auth.ts` is server-only.** Never import it into a client component.
- **Add a provider**: add to the `providers` array in `auth.ts`. Add its env vars to `env.server.ts`. Document in `.env.example`.

## Server actions rules

- Every action lives in `features/<feature>/actions/<feature>.action.ts`, marked `"use server"`.
- Every action accepts `input: unknown` and validates with a Zod schema before touching services.
- Every action returns an `ActionResult<T>` discriminated union: `{ ok: true; data: T } | { ok: false; message: string; fieldErrors?: ... }`. Never throw to the client.
- Every mutating action calls `revalidatePath(...)` for affected routes.
- Actions never read or write Prisma directly. Go through the service.

## Repository pattern

The repository is the only layer that imports `@/global/lib/prisma`. This keeps the Prisma surface small and replaceable.

- Repositories are pure data access. No auth checks, no business rules, no revalidation.
- They take primitive inputs (ids, plain objects) and return plain serializable data (dates as ISO strings).
- They are server-only (`import "server-only"` at the top).

If you find yourself importing `prisma` outside `repository/` you have a smell to fix.

## Env rules

Two files, two contexts:

- **`src/global/config/env.ts`** — client-safe. Only `NEXT_PUBLIC_*` variables. Validated with Zod. Safe to import anywhere.
- **`src/global/config/env.server.ts`** — server-only. `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL`, `AUTH_GITHUB_*`. Marked `import "server-only"`. Never import from a client component.

When adding a new env var:

1. Add it to the appropriate schema in `env.ts` or `env.server.ts`.
2. Add an example value to `.env.example`.
3. Use the typed `env` or `serverEnv` export. Never `process.env.X` directly.

## Validation rules

- The same Zod schema is used by the form (client) and the action (server). Define it once in `features/<feature>/utils/<feature>Validator.ts`. Import from both sides.
- Always validate on the server even if the client already did. `parsed.success === false` → return `ActionFailure` with `fieldErrors`.

## Database rules

- Schema changes: edit `prisma/schema.prisma`, run `bun run db:generate`, run `bun run db:push` (dev) or `bun run db:migrate` (prod-bound).
- Never commit a model change without also updating the seed if the seed referenced changed fields.
- All FKs use `onDelete: Cascade` unless there's a documented reason otherwise.
- Add `@@index` on every FK column you'll query by.
- Use enums for finite states (e.g., `ProjectStatus`).

## Logging and errors

- Server-side log only what's useful. Don't log user input verbatim.
- `apiClient.ts` still exists for the rare case the server needs to call an external HTTP API. It is not used to talk to your own backend — that's what services + repositories are for.
- A failed action returns `{ ok: false, message }`. The client shows it with `toast.error`. Don't surface raw Prisma errors to users.

## Don't do

- Don't import `prisma` outside `repository/`.
- Don't import `auth.ts` (or anything that transitively imports it) from a client component.
- Don't put `"use client"` on a file that calls `auth()` — that won't work.
- Don't skip Zod validation in actions, even when "the form already validated".
- Don't add a new auth provider without putting its env vars through `env.server.ts`.
- Don't reach for client-side fetching for protected reads. Use a server component and pass data down.

Everything from the frontend `CLAUDE.md` (on `main`) also applies here — see [`docs/`](docs/) for the shared rules. This file overrides where they conflict.
