"use client";

import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/global/components/ui/card";
import { Skeleton } from "@/global/components/ui/skeleton";
import { ErrorState } from "@/global/components/shared/ErrorState";
import { cn } from "@/global/utils/cn";
import { useDashboard } from "../hooks/useDashboard";
import type { DashboardStat } from "../@types/dashboard.types";

function TrendIcon({ trend }: { trend: DashboardStat["trend"] }) {
  if (trend === "up") return <ArrowUpRight className="h-4 w-4 text-emerald-500" />;
  if (trend === "down") return <ArrowDownRight className="h-4 w-4 text-rose-500" />;
  return <Minus className="text-muted-foreground h-4 w-4" />;
}

export function DashboardOverview() {
  const { data, isLoading, isError, refetch } = useDashboard();

  if (isError) {
    return (
      <ErrorState
        title="Could not load dashboard"
        description="We were unable to load your dashboard data."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {(isLoading ? Array.from({ length: 4 }) : (data?.stats ?? [])).map((stat, index) => {
        if (isLoading || !stat) {
          return (
            <Card key={index}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-7 w-20" />
                <Skeleton className="mt-2 h-3 w-16" />
              </CardContent>
            </Card>
          );
        }
        const s = stat as DashboardStat;
        return (
          <Card key={s.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">{s.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-semibold">{s.value}</span>
                <TrendIcon trend={s.trend} />
              </div>
              <p
                className={cn(
                  "mt-1 text-xs",
                  s.trend === "up" && "text-emerald-500",
                  s.trend === "down" && "text-rose-500",
                  s.trend === "flat" && "text-muted-foreground",
                )}
              >
                {s.change} vs last week
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
