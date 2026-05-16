import { z } from "zod";

export const projectStatusSchema = z.enum(["active", "paused", "completed"]);

export const createProjectSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(80),
  description: z.string().max(280).optional().default(""),
  status: projectStatusSchema.default("active"),
  members: z.coerce.number().int().min(1).max(50).default(1),
});

export const updateProjectSchema = createProjectSchema.partial().extend({
  id: z.string().min(1),
});

export const deleteProjectSchema = z.object({ id: z.string().min(1) });

export type CreateProjectSchema = z.infer<typeof createProjectSchema>;
export type UpdateProjectSchema = z.infer<typeof updateProjectSchema>;
