import React from "react";
import { IndianRupee, ShoppingBag, Clock, TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getDashboardMetrics } from "@/app/actions/admin.action";

export async function MetricsGrid() {
  const result = await getDashboardMetrics();
  
  const { grossRevenue, pendingOrdersCount, awaitingQuotesCount, successRate } = 
    result.success && result.data
      ? result.data
      : { grossRevenue: 0, pendingOrdersCount: 0, awaitingQuotesCount: 0, successRate: 0 };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Gross Revenue Card */}
      <Card className="bg-[#FDFBF7] border-[#EBE4DC] shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Gross Revenue
          </CardTitle>
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
            <IndianRupee className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="space-y-1.5">
          <div className="text-2xl font-bold tracking-tight text-[#4E3E2F]">
            ₹{grossRevenue.toLocaleString("en-IN")}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-2xs font-semibold text-emerald-700 border border-emerald-200">
              +12.4%
            </span>
            <span className="text-3xs text-muted-foreground">vs last month</span>
          </div>
        </CardContent>
      </Card>

      {/* Pending Orders Card */}
      <Card className="bg-[#FDFBF7] border-[#EBE4DC] shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Pending Orders
          </CardTitle>
          <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-200">
            <ShoppingBag className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="space-y-1.5">
          <div className="text-2xl font-bold tracking-tight text-[#4E3E2F]">
            {pendingOrdersCount}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-2xs font-semibold text-amber-700 border border-amber-200 animate-pulse">
              Needs Packing
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Awaiting Quotes Card */}
      <Card className="bg-[#FDFBF7] border-[#EBE4DC] shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Awaiting Quotes
          </CardTitle>
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 animate-pulse">
            <Clock className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="space-y-1.5">
          <div className="text-2xl font-bold tracking-tight text-[#4E3E2F]">
            {awaitingQuotesCount}
          </div>
          <p className="text-3xs text-muted-foreground">
            New custom booking inquiries needing pricing.
          </p>
        </CardContent>
      </Card>

      {/* Success Rate Card */}
      <Card className="bg-[#FDFBF7] border-[#EBE4DC] shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Quote Success Rate
          </CardTitle>
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
            <TrendingUp className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-2xl font-bold tracking-tight text-[#4E3E2F]">
            {successRate.toFixed(0)}%
          </div>
          <div className="space-y-1.5">
            <Progress value={successRate || 10} className="h-1.5 bg-neutral-200" />
            <div className="flex justify-between text-4xs text-muted-foreground uppercase font-bold tracking-wider">
              <span>Success Rate</span>
              <span>Goal: 75%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
