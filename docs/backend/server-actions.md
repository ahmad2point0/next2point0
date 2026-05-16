# Server actions

Server actions handle every mutation. They live in `features/<feature>/actions/<feature>.action.ts` and are marked `"use server"`.

## Shape

Every action follows the same pattern:

1. Accept `input: unknown`.
2. Validate with a Zod schema.
3. Call a service (which checks the session).
4. Call `revalidatePath` for affected routes.
5. Return an `ActionResult<T>` discriminated union.

```ts
"use server";

import { revalidatePath } from "next/cache";
import { projectsService } from "../services/projects.service";
import { createProjectSchema } from "../utils/projectsValidator";

interface ActionFailure {
  ok: false;
  message: string;
  fieldErrors?: Record<string, string[]>;
}
interface ActionSuccess<T> {
  ok: true;
  data: T;
}
export type ActionResult<T> = ActionSuccess<T> | ActionFailure;

export async function createProjectAction(input: unknown): Promise<ActionResult<Project>> {
  const parsed = createProjectSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Invalid input", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    const project = await projectsService.create(parsed.data);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/projects");
    return { ok: true, data: project };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Unknown error" };
  }
}
```

## Why a discriminated union instead of throwing

Thrown errors in server actions cross the network as opaque strings. Discriminated unions let you carry structured failure info (field errors, codes) to the client without try/catch on the call site. The form gets to render `fieldErrors` directly.

## Calling from a component

Through a TanStack Query mutation:

```tsx
const create = useCreateProject();

create.mutate(values, {
  onSuccess: () => toast.success("Created"),
  onError: (err) => toast.error(err.message),
});
```

The mutation hook converts `{ ok: false }` into a thrown error so the mutation state behaves consistently:

```ts
useMutation({
  mutationFn: async (input) => {
    const result = await createProjectAction(input);
    if (!result.ok) throw new Error(result.message);
    return result.data;
  },
  onSuccess: () => qc.invalidateQueries({ queryKey: ["projects"] }),
});
```

## Direct `<form action={...}>`

You can also call an action via `<form action={createProjectAction}>` without a mutation hook. The downside is no client-side validation feedback before submit, and `formData` parsing instead of typed values. For most app forms, prefer the hook + Zod path.

## Revalidation rules

- After a mutation, call `revalidatePath` for every route whose data is now stale.
- For dynamic segments, use `revalidatePath("/posts/[slug]", "page")`.
- Don't call `revalidatePath("/")` indiscriminately — it nukes the root layout cache.
- If you need to clear a TanStack Query cache as well, do that in the hook's `onSuccess`, not the action.

## Server-only constraints

Actions run on the server. You cannot:

- Read browser globals (`window`, `localStorage`, `document`).
- Use `useState`, `useEffect`, or other React hooks.
- Import client-only modules (`@/global/components/ui/...`) — they don't compile in a server context.

You can:

- Read cookies via `next/headers`.
- Call `auth()` to read the session.
- Throw `redirect()` from `next/navigation` to redirect after the action.

## Adding a new action

1. Write the Zod schema in `features/<feature>/utils/<feature>Validator.ts`.
2. Add the service method that checks the session and calls the repository.
3. Add the action that validates, calls the service, revalidates.
4. Add the mutation hook.
5. Re-export from the feature's `index.ts`.
