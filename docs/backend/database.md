# Database

PostgreSQL + Prisma. Schema lives at [`prisma/schema.prisma`](../../prisma/schema.prisma). Seed lives at [`prisma/seed.ts`](../../prisma/seed.ts).

## Local setup

You need a running Postgres on `localhost:5432`. The fastest way:

```bash
docker run -d \
  --name next2point0-pg \
  -p 5432:5432 \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=next2point0 \
  postgres:16
```

Then set `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/next2point0` in `.env`.

## First-time bootstrap

```bash
bun install
bun run db:generate   # generate Prisma client
bun run db:push       # apply schema to the database
bun run db:seed       # insert demo data
bun run dev
```

The seed creates two users (`jane@example.com` and `john@example.com`, both password `Password123`) and four projects owned by Jane.

## Common commands

| Command               | What it does                                        |
| --------------------- | --------------------------------------------------- |
| `bun run db:generate` | Generate the Prisma Client TS types                 |
| `bun run db:push`     | Push schema without creating a migration (dev only) |
| `bun run db:migrate`  | Create a versioned migration (use for production)   |
| `bun run db:studio`   | Open Prisma Studio in your browser                  |
| `bun run db:seed`     | Run the seed script                                 |

## Schema

Auth.js adapter tables: `User`, `Account`, `Session`, `VerificationToken`. Don't remove or rename these — `@auth/prisma-adapter` requires this shape.

Domain table: `Project` with `ownerId` foreign key to `User`. Cascade delete on user removal. Index on `ownerId` because every read filters by it.

## Adding a model

1. Edit `prisma/schema.prisma`.
2. Add `@@index` on every FK or commonly-queried column.
3. Run `bun run db:generate`.
4. Run `bun run db:push` (dev) or `bun run db:migrate dev --name <description>` (when you want a migration file).
5. Update `prisma/seed.ts` if needed.
6. Create the repository at `src/features/<feature>/repository/<feature>.repo.ts`.

## Production migrations

In production, use `prisma migrate deploy` against a non-development database. The CI step looks like:

```bash
DATABASE_URL=$PROD_URL bun run prisma migrate deploy
```

Never use `db push` in production — it doesn't track schema history.

## Connection pooling

For serverless (Vercel, Cloudflare), use a pooled connection. Set `DATABASE_URL` to the pooled host and a separate `DIRECT_URL` for migrations. The Prisma client picks up `DATABASE_URL` automatically; add `DIRECT_URL` to the schema:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

Then add `DIRECT_URL` to `env.server.ts`.

## Backups

Not built in. Use your provider's backup mechanism (Supabase nightly, Neon branching, AWS RDS automated backups).
