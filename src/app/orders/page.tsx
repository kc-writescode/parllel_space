"use client";

import { OrderFeed } from "@/components/OrderFeed";

export default function OrdersPage() {
    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Order Queue</h2>
                <div className="flex gap-2">
                    <button className="px-3 py-1.5 text-xs font-medium bg-neutral-900 border border-neutral-800 rounded-md text-gray-400 hover:text-white transition-colors">
                        Filter: All Waiters
                    </button>
                    <button className="px-3 py-1.5 text-xs font-medium bg-neutral-900 border border-neutral-800 rounded-md text-gray-400 hover:text-white transition-colors">
                        Export CSV
                    </button>
                </div>
            </div>
            <div className="flex-1 min-h-[500px]">
                <OrderFeed />
            </div>
        </div>
    );
}
