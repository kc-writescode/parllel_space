
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CheckCircle2, AlertCircle, ShoppingBag, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

interface Order {
    id: string;
    room: string;
    items: string[];
    status: "pending" | "processing" | "completed" | "cancelled";
    time: string;
    total: string;
}

const INITIAL_MOCK_ORDERS: Order[] = [
    { id: "ORD-001", room: "304", items: ["Club Sandwich", "Iced Tea"], status: "processing", time: "2 min ago", total: "$24.50" },
    { id: "ORD-002", room: "112", items: ["Extra Towels", "Shampoo"], status: "pending", time: "Just now", total: "$0.00" },
    { id: "ORD-003", room: "505", items: ["Caesar Salad", "Sparkling Water"], status: "completed", time: "15 min ago", total: "$18.00" },
];

export function OrderFeed() {
    const [orders, setOrders] = useState<Order[]>(INITIAL_MOCK_ORDERS);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!supabase) return; // Fallback to mock if no client

        // 1. Fetch initial orders (if table exists)
        const fetchOrders = async () => {
            if (!supabase) return;
            const { data, error } = await supabase
                .from('orders')
                .select(`
            id,
            room_number,
            status,
            total_amount,
            created_at,
            order_items (
              menu_items (name)
            )
          `)
                .order('created_at', { ascending: false })
                .limit(10);

            if (!error && data && data.length > 0) {
                // Transform DB shape to UI shape
                const transformedOrders = data.map((o: any) => ({
                    id: o.id,
                    room: o.room_number,
                    items: o.order_items?.map((oi: any) => oi.menu_items?.name || "Unknown Item") || [],
                    status: o.status,
                    time: new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    total: `$${o.total_amount}`
                }));
                setOrders(transformedOrders);
                setIsConnected(true);
            }
        };

        fetchOrders();

        if (!supabase) return;

        // 2. Subscribe to Realtime Inserts
        const channel = supabase
            .channel('schema-db-changes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'orders',
                },
                async (payload) => {
                    // Ideally fetch full relations, but for now just show the new order
                    // In a real app we'd fetch the related items immediately
                    const newOrder = payload.new as any;

                    setOrders((prev) => [
                        {
                            id: newOrder.id,
                            room: newOrder.room_number,
                            items: ["Fetching items..."], // Placeholder until refresh
                            status: newOrder.status,
                            time: "Just now",
                            total: `$${newOrder.total_amount}`
                        },
                        ...prev
                    ].slice(0, 10));

                    // Trigger a re-fetch to get the actual items
                    fetchOrders();
                }
            )
            .subscribe();

        return () => {
            if (supabase) supabase.removeChannel(channel);
        };
    }, []);

    // Simulating incoming orders ONLY if not connected to Supabase
    useEffect(() => {
        if (isConnected) return; // Don't simulate if real data is flowing

        const interval = setInterval(() => {
            if (Math.random() > 0.7) return; // 30% chance of new order

            const newOrder: Order = {
                id: "ORD-" + Math.floor(Math.random() * 1000),
                room: ["201", "405", "118", "Ph-Lobby"][Math.floor(Math.random() * 4)],
                items: [["Burger", "Fries"], ["Pizza", "Coke"], ["Extra Pillow"], ["Wake Up Call"]][Math.floor(Math.random() * 4)],
                status: "pending",
                time: "Just now",
                total: "$" + (Math.random() * 50 + 10).toFixed(2)
            };

            setOrders(prev => [newOrder, ...prev].slice(0, 10)); // Keep only recent 10
        }, 8000);

        return () => clearInterval(interval);
    }, [isConnected]);


    return (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm overflow-hidden h-full flex flex-col">
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
                <h3 className="font-semibold text-white flex items-center gap-2">
                    <ShoppingBag size={18} className="text-primary" />
                    Live Order Feed
                </h3>
                <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full animate-pulse">
                    Monitoring
                </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <AnimatePresence initial={false}>
                    {orders.map((order) => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="p-3 rounded-lg border border-neutral-800 bg-neutral-950 hover:bg-neutral-900 transition-colors group cursor-pointer"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center border",
                                        order.status === "pending" ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
                                            order.status === "processing" ? "bg-blue-500/10 border-blue-500/20 text-blue-500" :
                                                "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                                    )}>
                                        {order.status === "pending" && <Clock size={18} />}
                                        {order.status === "processing" && <AlertCircle size={18} />}
                                        {order.status === "completed" && <CheckCircle2 size={18} />}
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-white text-sm">Room {order.room}</h4>
                                        <p className="text-xs text-gray-400 mt-0.5 max-w-[180px] truncate">
                                            {order.items.join(", ")}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="font-semibold text-white text-sm">{order.total}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{order.time}</p>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="mt-3 pt-3 border-t border-neutral-900 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="flex-1 px-3 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded hover:bg-primary hover:text-white transition-colors">
                                    Accept
                                </button>
                                <button className="px-3 py-1.5 bg-neutral-800 text-gray-400 text-xs font-medium rounded hover:bg-neutral-800 hover:text-white transition-colors">
                                    Details
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
