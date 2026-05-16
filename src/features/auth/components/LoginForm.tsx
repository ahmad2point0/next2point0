"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/global/components/ui/button";
import { Input } from "@/global/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/global/components/ui/form";
import { ROUTES } from "@/global/constants";
import { loginSchema, type LoginInput } from "../utils/authValidator";
import { useLogin } from "../hooks/useLogin";

export function LoginForm() {
  const router = useRouter();
  const login = useLogin();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: LoginInput) => {
    login.mutate(values, {
      onSuccess: () => {
        toast.success("Welcome back");
        router.push(ROUTES.dashboard);
      },
      onError: (error) => {
        toast.error(error.message || "Sign in failed");
      },
    });
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
                <Input type="email" placeholder="you@example.com" autoComplete="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={login.isPending}>
          {login.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {login.isPending ? "Signing in" : "Sign in"}
        </Button>
        <p className="text-muted-foreground text-center text-sm">
          New here?{" "}
          <Link href={ROUTES.register} className="text-foreground font-medium hover:underline">
            Create an account
          </Link>
        </p>
      </form>
    </Form>
  );
}
