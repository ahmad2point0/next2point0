import "server-only";
import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z.string().min(16, "AUTH_SECRET must be at least 16 characters"),
  AUTH_URL: z.string().url().default("http://localhost:3000"),
  AUTH_GITHUB_ID: z.string().optional().default(""),
  AUTH_GITHUB_SECRET: z.string().optional().default(""),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

export type ServerEnv = z.infer<typeof schema>;

const skipValidation =
  process.env.SKIP_ENV_VALIDATION === "1" || process.env.SKIP_ENV_VALIDATION === "true";

function loadEnv(): ServerEnv {
  if (skipValidation) {
    // Used when env isn't available at build time (CI / pre-push hook).
    // Real values are read at request time when this module re-evaluates with proper env.
    return {
      DATABASE_URL: process.env.DATABASE_URL ?? "postgresql://placeholder@localhost:5432/build",
      AUTH_SECRET: process.env.AUTH_SECRET ?? "skip-validation-placeholder-not-secret",
      AUTH_URL: process.env.AUTH_URL ?? "http://localhost:3000",
      AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID ?? "",
      AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET ?? "",
      NODE_ENV: (process.env.NODE_ENV as ServerEnv["NODE_ENV"]) ?? "development",
    };
  }

  const parsed = schema.safeParse({
    DATABASE_URL: process.env.DATABASE_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_URL: process.env.AUTH_URL,
    AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID,
    AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET,
    NODE_ENV: process.env.NODE_ENV,
  });

  if (!parsed.success) {
    console.error("Invalid server environment variables:", parsed.error.flatten().fieldErrors);
    throw new Error(
      "Invalid server environment variables. See .env.example. Set SKIP_ENV_VALIDATION=1 to bypass at build time.",
    );
  }

  return parsed.data;
}

export const serverEnv = loadEnv();
