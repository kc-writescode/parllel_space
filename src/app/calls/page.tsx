"use client";

import { ActiveCallMonitor } from "@/components/ActiveCallMonitor";
import { Phone, Users, History } from "lucide-react";

export default function CallsPage() {
    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Call Logs & Transcripts</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                <div className="lg:col-span-2 h-full flex flex-col">
                    <div className="mb-4">
                        <div className="p-4 bg-neutral-900/50 border border-neutral-800 rounded-lg">
                            <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                                <History size={16} className="text-primary" />
                                Recently Completed Calls
                            </h3>
                            <div className="space-y-2">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-neutral-950/50 rounded hover:bg-neutral-800 cursor-pointer transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-gray-400 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                                                <Phone size={14} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white">Room {200 + i}</p>
                                                <p className="text-xs text-gray-500">Duration: 2m 14s</p>
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-500">10 mins ago</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-full min-h-[400px]">
                    <ActiveCallMonitor />
                </div>
            </div>
        </div>
    );
}
