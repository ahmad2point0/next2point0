import "server-only";
import { auth } from "@/auth";
import { projectsRepository } from "../repository/projects.repo";
import type { Project, CreateProjectInput, UpdateProjectInput } from "../@types/projects.types";

class UnauthorizedError extends Error {
  constructor() {
    super("You must be signed in.");
    this.name = "UnauthorizedError";
  }
}

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) throw new UnauthorizedError();
  return session.user.id;
}

export const projectsService = {
  async list(): Promise<Project[]> {
    const ownerId = await requireUserId();
    return projectsRepository.listForUser(ownerId);
  },

  async get(id: string): Promise<Project | null> {
    const ownerId = await requireUserId();
    return projectsRepository.getForUser(id, ownerId);
  },

  async create(input: CreateProjectInput): Promise<Project> {
    const ownerId = await requireUserId();
    return projectsRepository.create(ownerId, input);
  },

  async update(input: UpdateProjectInput): Promise<Project | null> {
    const ownerId = await requireUserId();
    return projectsRepository.update(ownerId, input);
  },

  async delete(id: string): Promise<boolean> {
    const ownerId = await requireUserId();
    return projectsRepository.delete(ownerId, id);
  },
};
