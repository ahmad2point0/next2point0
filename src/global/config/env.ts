import { z } from "zod";

const schema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:3000/api"),
  NEXT_PUBLIC_ANALYTICS_ID: z.string().optional().default(""),
});

const parsed = schema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_ANALYTICS_ID: process.env.NEXT_PUBLIC_ANALYTICS_ID,
});

if (!parsed.success) {
  console.error("Invalid client environment variables:", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid client environment variables. See .env.example.");
}

export const env = parsed.data;
export type Env = typeof env;
