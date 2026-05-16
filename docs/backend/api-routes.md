# API routes

Server actions handle 95% of mutations. Use API route handlers (`route.ts` files under `src/app/api/`) only when you actually need an HTTP endpoint:

- Webhooks from third parties (Stripe, GitHub, Resend, your mobile app's backend).
- Health checks and readiness probes (`/api/health` ships out of the box).
- Public APIs consumed by non-React clients.

## File location

```
src/app/api/<segment>/route.ts
```

## Example: `/api/health`

```ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ status: "ok", timestamp: new Date().toISOString() });
}
```

## Validation

The same pattern as server actions:

```ts
import { NextResponse } from "next/server";
import { createProjectSchema } from "@/features/projects";
import { projectsService } from "@/features/projects";
import { auth } from "@/auth";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const json = await request.json();
  const parsed = createProjectSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid input", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const project = await projectsService.create(parsed.data);
  return NextResponse.json({ data: project }, { status: 201 });
}
```

## When NOT to add an API route

- Mutations from React forms → use server actions.
- Reads from React server components → call the service directly.
- Reads from React client components → server action wrapped in a TanStack Query hook, or `useQuery` against a route handler if you really need HTTP semantics.

## Webhooks

Webhooks must validate the sender (HMAC signature, IP allowlist, or shared secret). Never trust the body without verification. The server env should hold the signing secret:

```ts
// src/global/config/env.server.ts
STRIPE_WEBHOOK_SECRET: z.string().min(16),
```

## CORS

Next.js does not enable CORS by default. If a non-browser client (mobile app on a different origin) needs to hit your API, set headers in the route handler or use the `proxy.ts` matcher with a CORS preflight handler.
