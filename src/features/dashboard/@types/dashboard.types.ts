export interface DashboardStat {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "flat";
}

export interface DashboardOverview {
  stats: DashboardStat[];
  greeting: string;
}
