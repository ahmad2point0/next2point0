# Forms and validation

One stack for all forms: `react-hook-form` + `zod` + `@hookform/resolvers/zod` + Shadcn `Form*` components.

## Schema first

Define the Zod schema in `features/<feature>/utils/<feature>Validator.ts`:

```ts
// features/auth/utils/authValidator.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;
```

The inferred type drives the form. Never define the form type by hand.

## Form skeleton

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/global/components/ui/form";
import { Input } from "@/global/components/ui/input";
import { Button } from "@/global/components/ui/button";
import { loginSchema, type LoginInput } from "../utils/authValidator";

export function LoginForm() {
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: LoginInput) => {
    // values is already validated. No runtime checks needed.
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Sign in</Button>
      </form>
    </Form>
  );
}
```

`FormMessage` renders the Zod error automatically. No manual error wiring.

## With mutations

Combine with a feature hook:

```tsx
const login = useLogin();

const onSubmit = (values: LoginInput) => {
  login.mutate(values, {
    onSuccess: () => router.push(ROUTES.dashboard),
    onError: (err) => toast.error(err.message),
  });
};

<Button disabled={login.isPending}>{login.isPending ? "Signing in" : "Sign in"}</Button>;
```

## Common Zod patterns

```ts
// Email
z.string().email();

// Password with rules
z.string()
  .min(8, "Must be 8+ characters")
  .regex(/[A-Z]/, "Must include an uppercase letter")
  .regex(/[0-9]/, "Must include a number");

// Optional with default
z.string().max(280).optional().default("");

// Number from string input
z.coerce.number().int().positive();

// Cross-field validation
z.object({ password: z.string(), confirm: z.string() }).refine(
  (data) => data.password === data.confirm,
  {
    message: "Passwords must match",
    path: ["confirm"],
  },
);
```

## When you need server-side validation too

On `feat/backend`, the same Zod schema is imported in both the form and the server action / route handler. Share, don't duplicate. Client validation is UX; server validation is correctness — you need both, but from one schema.

## When not to use react-hook-form

For a single input with no submit step (a search box that filters as you type), `useState` is fine. Reach for `react-hook-form` when you have a form with a submit action.
