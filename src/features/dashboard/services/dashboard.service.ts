import type { DashboardOverview } from "../@types/dashboard.types";

const MOCK_OVERVIEW: DashboardOverview = {
  greeting: "Welcome back",
  stats: [
    { id: "active", label: "Active users", value: "1,284", change: "+12.4%", trend: "up" },
    { id: "revenue", label: "Revenue", value: "$24,902", change: "+4.1%", trend: "up" },
    { id: "signups", label: "Sign ups", value: "312", change: "-2.0%", trend: "down" },
    { id: "tickets", label: "Open tickets", value: "18", change: "0.0%", trend: "flat" },
  ],
};

export const dashboardService = {
  async getOverview(): Promise<DashboardOverview> {
    await new Promise((resolve) => setTimeout(resolve, 350));
    return MOCK_OVERVIEW;
  },
};
