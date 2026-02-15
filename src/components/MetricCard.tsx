
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
    title: string;
    value: string;
    change: string;
    positive?: boolean;
    icon: LucideIcon;
    gradient?: string;
}

export function MetricCard({ title, value, change, positive, icon: Icon, gradient }: MetricCardProps) {
    return (
        <div className={cn(
            "relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 shadow-xl backdrop-blur-sm transition-all hover:border-neutral-700 group",
            gradient && "bg-gradient-to-br from-neutral-900 via-neutral-900 to-transparent"
        )}>
            <div className={cn(
                "absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-10 blur-2xl transition-all group-hover:opacity-20",
                gradient || "bg-primary"
            )} />

            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-400">{title}</p>
                    <h3 className="mt-2 text-3xl font-bold text-white tracking-tight">{value}</h3>
                </div>
                <div className="rounded-lg bg-neutral-800/50 p-2.5 text-gray-400 border border-neutral-700/50">
                    <Icon size={20} />
                </div>
            </div>

            <div className="mt-4 flex items-center text-sm">
                <span className={cn(
                    "font-medium flex items-center",
                    positive ? "text-emerald-400" : "text-rose-400"
                )}>
                    {change}
                </span>
                <span className="ml-2 text-gray-500">vs last week</span>
            </div>
        </div>
    );
}
