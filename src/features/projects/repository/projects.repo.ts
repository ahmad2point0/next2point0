import "server-only";
import { prisma } from "@/global/lib/prisma";
import type { Project, CreateProjectInput, UpdateProjectInput } from "../@types/projects.types";

function serialize(project: {
  id: string;
  name: string;
  description: string;
  status: "active" | "paused" | "completed";
  members: number;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}): Project {
  return {
    id: project.id,
    name: project.name,
    description: project.description,
    status: project.status,
    members: project.members,
    ownerId: project.ownerId,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  };
}

export const projectsRepository = {
  async listForUser(ownerId: string): Promise<Project[]> {
    const rows = await prisma.project.findMany({
      where: { ownerId },
      orderBy: { updatedAt: "desc" },
    });
    return rows.map(serialize);
  },

  async getForUser(id: string, ownerId: string): Promise<Project | null> {
    const row = await prisma.project.findFirst({ where: { id, ownerId } });
    return row ? serialize(row) : null;
  },

  async create(ownerId: string, input: CreateProjectInput): Promise<Project> {
    const row = await prisma.project.create({
      data: {
        ownerId,
        name: input.name,
        description: input.description ?? "",
        status: input.status ?? "active",
        members: input.members ?? 1,
      },
    });
    return serialize(row);
  },

  async update(ownerId: string, input: UpdateProjectInput): Promise<Project | null> {
    const existing = await prisma.project.findFirst({
      where: { id: input.id, ownerId },
      select: { id: true },
    });
    if (!existing) return null;

    const row = await prisma.project.update({
      where: { id: input.id },
      data: {
        name: input.name,
        description: input.description,
        status: input.status,
        members: input.members,
      },
    });
    return serialize(row);
  },

  async delete(ownerId: string, id: string): Promise<boolean> {
    const existing = await prisma.project.findFirst({ where: { id, ownerId } });
    if (!existing) return false;
    await prisma.project.delete({ where: { id } });
    return true;
  },
};
