import type { Project } from "../@types/projects.types";

const MOCK_PROJECTS: Project[] = [
  {
    id: "p_01",
    name: "Aurora landing redesign",
    description: "Refresh the marketing site with a new motion system.",
    status: "active",
    members: 4,
    updatedAt: "2026-05-12T09:00:00.000Z",
  },
  {
    id: "p_02",
    name: "Billing migration",
    description: "Move from monthly invoices to usage-based pricing.",
    status: "active",
    members: 2,
    updatedAt: "2026-05-10T14:20:00.000Z",
  },
  {
    id: "p_03",
    name: "iOS launch",
    description: "Submit v1 to the App Store and prepare release notes.",
    status: "paused",
    members: 3,
    updatedAt: "2026-04-28T17:45:00.000Z",
  },
  {
    id: "p_04",
    name: "Docs overhaul",
    description: "Rewrite the developer documentation with the new IA.",
    status: "completed",
    members: 5,
    updatedAt: "2026-04-15T11:00:00.000Z",
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const projectsService = {
  async list(): Promise<Project[]> {
    await delay(400);
    return [...MOCK_PROJECTS];
  },

  async get(id: string): Promise<Project | null> {
    await delay(200);
    return MOCK_PROJECTS.find((p) => p.id === id) ?? null;
  },
};
