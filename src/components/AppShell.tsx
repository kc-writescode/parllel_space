"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Bot,
    LayoutDashboard,
    UtensilsCrossed,
    PhoneCall,
    Settings,
    CreditCard,
    Building2,
    PlugZap
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AppShellProps {
    children: ReactNode;
}

const NAV_ITEMS = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/orders", label: "Order Queue", icon: UtensilsCrossed },
    { href: "/calls", label: "Call Logs", icon: PhoneCall },
    { href: "/integrations", label: "Pos Integrations", icon: PlugZap },
    { href: "/menu", label: "Live Menu", icon: Bot },
    { href: "/property", label: "Property Settings", icon: Building2 },
];

export function AppShell({ children }: AppShellProps) {
    const pathname = usePathname();

    return (
        <div className="flex min-h-screen bg-background text-foreground font-sans">
            {/* Sidebar */}
            <aside className="w-64 border-r border-mute glass-dark flex flex-col fixed h-full z-50">
                <div className="h-16 flex items-center px-6 border-b border-mute">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center mr-3">
                        <Bot size={20} className="text-white" />
                    </div>
                    <span className="font-bold text-lg tracking-tight">Concierge AI</span>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <div className="px-2 mb-2 text-xs font-medium text-mute-foreground uppercase tracking-wider">
                        Management
                    </div>
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group",
                                    isActive
                                        ? "bg-primary/20 text-primary border border-primary/20"
                                        : "text-gray-400 hover:bg-neutral-900 hover:text-white"
                                )}
                            >
                                <Icon size={18} className={cn("mr-3", isActive ? "text-primary" : "text-gray-500 group-hover:text-white")} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-mute">
                    <div className="flex items-center p-2 rounded-lg bg-neutral-900/50 border border-neutral-800">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs">
                            MA
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-white">Marriott Austin</p>
                            <p className="text-xs text-green-400 flex items-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5 animate-pulse"></span>
                                Online
                            </p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 min-h-screen flex flex-col relative overflow-hidden">
                {/* Ambient Gradient Background */}
                <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none opacity-50" />
                <div className="absolute bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

                <header className="h-16 border-b border-mute flex items-center justify-between px-8 sticky top-0 z-40 glass-dark">
                    <h1 className="text-lg font-semibold text-white/90">
                        {NAV_ITEMS.find(i => i.href === pathname)?.label || "Active Session"}
                    </h1>
                    <div className="flex items-center space-x-4">
                        <button className="px-3 py-1.5 text-xs font-medium bg-neutral-900 border border-neutral-800 rounded-md text-gray-400 hover:text-white transition-colors">
                            Docs
                        </button>
                        <button className="px-3 py-1.5 text-xs font-medium bg-primary hover:bg-primary/90 text-white rounded-md transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)]">
                            + New Order
                        </button>
                    </div>
                </header>

                <div className="flex-1 p-8 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
