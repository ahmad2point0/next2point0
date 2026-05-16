# Authentication

Auth.js v5 (NextAuth) with the Prisma adapter, JWT session strategy, Credentials provider, and optional GitHub OAuth.

## File map

| File                                      | Purpose                                                                     |
| ----------------------------------------- | --------------------------------------------------------------------------- |
| `src/auth.config.ts`                      | Edge-safe config: pages, callbacks, authorized rule. Imported by proxy.     |
| `src/auth.ts`                             | Full server-only config with providers + adapter. Exports `auth`, `signIn`. |
| `src/proxy.ts`                            | Runs `auth.config` on every request. Protects `/dashboard/**`. (Next 16+)   |
| `src/app/api/auth/[...nextauth]/route.ts` | Auth.js HTTP handlers.                                                      |

## Why two configs

`proxy.ts` runs at the edge. Edge runtimes don't have `bcrypt`, `prisma`, or the Node crypto module. So `auth.config.ts` only contains the bits that work everywhere (callbacks, page routes). `auth.ts` adds the providers and the adapter and is only imported from server code (route handlers, server actions, server components).

If you put `bcrypt` in `auth.config.ts` the dev server will crash when the proxy tries to load.

> Note: Next.js called this file `middleware.ts` before version 16. It is the same idea, just renamed to `proxy.ts`. Same edge runtime, same matcher config, same use cases.

## Sign in flow

1. User submits the login form in `LoginForm.tsx`.
2. `useLogin` calls `loginAction` (`features/auth/actions/auth.action.ts`).
3. `loginAction` validates with `loginSchema`, then calls `signIn("credentials", ...)`.
4. The Credentials provider's `authorize` callback looks up the user by email, compares password hash with `bcrypt.compare`, and returns the user shell.
5. Auth.js issues a JWT session cookie.
6. The form pushes the user to `/dashboard`. The proxy allows the navigation because the session is now present.

## Sign up flow

`registerAction` creates the user with a hashed password, then immediately signs them in by calling `signIn("credentials", ...)`. Same cookie behavior as login.

## Session shape

The default JWT carries the user id in `token.sub`. The `session` callback in `auth.config.ts` copies that into `session.user.id`. Read it like:

```ts
const session = await auth();
if (!session?.user?.id) redirect("/login");
const userId = session.user.id;
```

## Adding GitHub OAuth

1. Set `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET` in `.env`.
2. The provider is already wired conditionally in `auth.ts` — it only registers when both env vars are present.
3. Add a "Continue with GitHub" button to your forms that calls `signIn("github")`.

The GitHub OAuth callback URL you give GitHub is `${AUTH_URL}/api/auth/callback/github`.

## Protecting a route

The proxy already protects `/dashboard/**`. For finer-grained checks:

```tsx
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (!isAdmin(session.user.id)) redirect("/dashboard");
  // ...
}
```

To extend the matcher, edit `proxy.ts`:

```ts
export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
```

The default matcher runs the proxy on all routes except static assets and the auth API.

## Sign out

```ts
"use server";
import { signOut } from "@/auth";
export async function logoutAction() {
  await signOut({ redirect: false });
}
```

The `UserMenu` component already wires this up. Click the avatar → Sign out.

## Password rules

`registerSchema` enforces:

- At least 8 characters
- One uppercase letter
- One number

Edit `src/features/auth/utils/authValidator.ts` to tighten or relax. The same schema validates server-side, so client and server never disagree.

## Why JWT instead of database sessions

Database sessions require a round-trip per request. JWT sessions only verify a signature. For most apps the JWT trade-off (sessions can't be revoked server-side without re-issuing the signing key) is acceptable. If you need revocation, switch the strategy in `auth.ts`:

```ts
session: {
  strategy: "database";
}
```

Then enable the Session model fully (it's already in the schema). Document any switch in a follow-up PR.
