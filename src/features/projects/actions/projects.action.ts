"use server";

import { revalidatePath } from "next/cache";
import { projectsService } from "../services/projects.service";
import {
  createProjectSchema,
  deleteProjectSchema,
  updateProjectSchema,
} from "../utils/projectsValidator";
import type { Project } from "../@types/projects.types";

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
    return {
      ok: false,
      message: "Invalid input",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
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

export async function updateProjectAction(input: unknown): Promise<ActionResult<Project>> {
  const parsed = updateProjectSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Invalid input",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const project = await projectsService.update(parsed.data);
    if (!project) return { ok: false, message: "Project not found" };
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/projects");
    return { ok: true, data: project };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function deleteProjectAction(input: unknown): Promise<ActionResult<{ id: string }>> {
  const parsed = deleteProjectSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Invalid input" };
  }

  try {
    const removed = await projectsService.delete(parsed.data.id);
    if (!removed) return { ok: false, message: "Project not found" };
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/projects");
    return { ok: true, data: { id: parsed.data.id } };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Unknown error" };
  }
}
