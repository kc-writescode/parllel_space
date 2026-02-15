"use client";

import { PlugZap, CreditCard, Bot, Check, Signal, Server } from "lucide-react";
import { cn } from "@/lib/utils";

export default function IntegrationsPage() {
    return (
        <div className="h-full space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <PlugZap className="text-primary" /> Active Integrations
                </h2>
                <p className="text-gray-400 mt-2">Manage connected services for ordering and voice.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Retell Voice */}
                <div className="rounded-xl border border-primary/20 bg-neutral-900/50 p-6 shadow-xl backdrop-blur-sm relative overflow-hidden group">
                    <div className="absolute top-4 right-4 text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <Signal size={12} className="animate-pulse" /> Connected
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary mb-4">
                        <Bot size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Retell AI</h3>
                    <p className="text-sm text-gray-400 mt-1">Voice streaming & LLM orchestration.</p>
                    <div className="mt-4 pt-4 border-t border-neutral-800 text-xs font-mono text-gray-500 flex justify-between">
                        <span>Latency: 45ms</span>
                        <span>Usage: 2.4 hrs</span>
                    </div>
                </div>

                {/* Clover POS */}
                <div className="rounded-xl border border-emerald-500/20 bg-neutral-900/50 p-6 shadow-xl backdrop-blur-sm relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
                    <div className="absolute top-4 right-4 text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <Check size={12} /> Synced
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-500 mb-4">
                        <CreditCard size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Clover POS</h3>
                    <p className="text-sm text-gray-400 mt-1">Menu sync & order injection.</p>
                    <div className="mt-4 pt-4 border-t border-neutral-800 text-xs font-mono text-gray-500 flex justify-between">
                        <span>Merchant ID ending in ...4821</span>
                    </div>
                </div>

                {/* Supabase */}
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/30 p-6 backdrop-blur-sm relative overflow-hidden group hover:bg-neutral-800/50 transition-colors">
                    <div className="absolute top-4 right-4 text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <Check size={12} /> Active
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-500 mb-4">
                        <Server size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Database</h3>
                    <p className="text-sm text-gray-400 mt-1">Supabase (PostgreSQL).</p>
                    <div className="mt-4 pt-4 border-t border-neutral-800 text-xs font-mono text-gray-500 flex justify-between">
                        <span>Status: Healthy</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
