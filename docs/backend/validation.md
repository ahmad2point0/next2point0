# Validation

One schema. Both sides.

The same Zod schema validates the form (in the browser) and the request (on the server). Define it once. Import from both.

## Where schemas live

`features/<feature>/utils/<feature>Validator.ts`. Always.

```ts
// features/projects/utils/projectsValidator.ts
import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(2).max(80),
  description: z.string().max(280).optional().default(""),
  status: z.enum(["active", "paused", "completed"]).default("active"),
  members: z.coerce.number().int().min(1).max(50).default(1),
});

export type CreateProjectSchema = z.infer<typeof createProjectSchema>;
```

## Client side

In a form:

```tsx
const form = useForm<CreateProjectSchema>({
  resolver: zodResolver(createProjectSchema),
  defaultValues: { ... },
});
```

The user gets immediate feedback. The submit handler receives values that are already typed and valid.

## Server side

In an action:

```ts
"use server";

import { createProjectSchema } from "../utils/projectsValidator";

export async function createProjectAction(input: unknown) {
  const parsed = createProjectSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Invalid input", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  // parsed.data is typed
}
```

This is **not optional**. Client validation is UX. Server validation is correctness. A malicious or buggy client will send bad data eventually. The action is the wall.

## Returning field errors

The action returns `fieldErrors: parsed.error.flatten().fieldErrors`. The form can then call `form.setError(field, { message })` for each entry, but most of the time `toast.error(result.message)` is enough for the user, plus per-field highlights come from the client validation that already ran.

## Coercion

Browsers send strings. Numbers from inputs need `z.coerce.number()`. Booleans from checkboxes need `z.coerce.boolean()`. Build coercion into the schema so the client and server both produce the same shape.

## Schema reuse

If two actions need slightly different shapes, derive:

```ts
export const updateProjectSchema = createProjectSchema.partial().extend({
  id: z.string().min(1),
});
```

Don't duplicate fields. When `name` becomes optional in update, you don't want it to mean different things on each side.

## Cross-field validation

Use `refine`:

```ts
z.object({ password: z.string(), confirm: z.string() }).refine(
  (data) => data.password === data.confirm,
  {
    message: "Passwords must match",
    path: ["confirm"],
  },
);
```

Works the same on both sides.

## When you have to differ

If the server schema legitimately differs (e.g., the server adds `ownerId` from session and shouldn't accept it from input), keep two schemas in the same file:

```ts
export const createInputSchema = z.object({ name: z.string() }); // client form
export const createPersistedSchema = createInputSchema.extend({
  // server use
  ownerId: z.string(),
});
```

But don't redefine validation rules in two places. Compose.
