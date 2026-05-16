# Protected routes

Three layers of protection. Use the one closest to where you can decide.

## 1. Middleware (route-level)

`src/proxy.ts` (called `middleware.ts` before Next 16) runs on every request. The `authorized` callback in `auth.config.ts` returns `false` for an unauthenticated user on `/dashboard/**`, which redirects them to `/login`.

```ts
// src/auth.config.ts
authorized({ auth, request: { nextUrl } }) {
  const isLoggedIn = !!auth?.user;
  const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
  if (isOnDashboard) return isLoggedIn;
  return true;
}
```

This is the cheapest check. It runs at the edge and short-circuits before any page code loads.

Extend the matcher in `proxy.ts` if you have more protected sections:

```ts
export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
```

## 2. Layout-level (`auth()`)

For double-checking after the proxy, or for sections that need session data anyway, use `auth()` in the layout:

```tsx
// src/app/dashboard/layout.tsx
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function DashboardLayout({ children }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return <>{children}</>;
}
```

The template ships this in `src/app/dashboard/layout.tsx`. Middleware + layout together close any race condition.

## 3. Service-level

Every service method that touches user-owned data calls `requireUserId()`:

```ts
async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) throw new UnauthorizedError();
  return session.user.id;
}
```

Then every query is scoped to that user:

```ts
async list(): Promise<Project[]> {
  const ownerId = await requireUserId();
  return projectsRepository.listForUser(ownerId);
}
```

This is the most important layer. Even if someone bypasses the proxy and the layout — by hitting a server action with a forged request — the service rejects it.

## Why all three

| Layer      | Catches                                          | Performance cost         |
| ---------- | ------------------------------------------------ | ------------------------ |
| Middleware | Unauthenticated navigations                      | Edge, near zero          |
| Layout     | Edge cases where the proxy can't redirect        | One `auth()` call        |
| Service    | Direct server action calls, missing route checks | One `auth()` call per op |

Skipping the service layer is the most dangerous: a forgotten route or a typo in the proxy matcher silently exposes data. Service-level is the floor.

## Role-based access

The default session carries only `id`, `email`, `name`. To add roles:

1. Add `role` to the `User` model in `prisma/schema.prisma`.
2. Push the schema: `bun run db:push`.
3. Extend the JWT callback in `auth.config.ts` to copy `role` into the token.
4. Extend the session callback to copy `role` onto `session.user`.
5. Augment the `Session` type in `src/types/next-auth.d.ts` (create this file if absent).

A `requireRole(role: string)` helper alongside `requireUserId` keeps the service layer terse.
