
"use client";

import { MetricCard } from "@/components/MetricCard";
import { OrderFeed } from "@/components/OrderFeed";
import { ActiveCallMonitor } from "@/components/ActiveCallMonitor";
import { PhoneIncoming, UtensilsCrossed, TrendingUp, Clock } from "lucide-react";

export default function Home() {
  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Active Calls (Today)"
          value="42"
          change="+12%"
          positive={true}
          icon={PhoneIncoming}
          gradient="yes"
        />
        <MetricCard
          title="Orders Placed"
          value="18"
          change="+5%"
          positive={true}
          icon={UtensilsCrossed}
        />
        <MetricCard
          title="Revenue (Voice)"
          value="$450.25"
          change="+8.2%"
          positive={true}
          icon={TrendingUp}
        />
        <MetricCard
          title="Avg Call Duration"
          value="1m 32s"
          change="-10s"
          positive={true}
          icon={Clock}
        />
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        <div className="lg:col-span-2 h-full min-h-[400px]">
          <ActiveCallMonitor />
        </div>
        <div className="h-full min-h-[400px]">
          <OrderFeed />
        </div>
      </div>
    </div>
  );
}
