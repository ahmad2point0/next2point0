import { z } from "zod";

const clientSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:3000/api"),
  NEXT_PUBLIC_ANALYTICS_ID: z.string().optional().default(""),
});

const clientEnv = {
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_ANALYTICS_ID: process.env.NEXT_PUBLIC_ANALYTICS_ID,
};

const parsed = clientSchema.safeParse(clientEnv);

if (!parsed.success) {
  const formatted = parsed.error.flatten().fieldErrors;
  console.error("Invalid environment variables:", formatted);
  throw new Error("Invalid environment variables. See .env.example.");
}

export const env = parsed.data;
export type Env = typeof env;
