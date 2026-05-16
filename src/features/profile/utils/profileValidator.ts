import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  bio: z.string().max(280, "Keep it under 280 characters").optional().default(""),
});

export type ProfileInput = z.infer<typeof profileSchema>;
