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

export function OrderFeed() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const client = supabase;
        if (!client) {
            console.error("Supabase client not initialized");
            setIsLoading(false);
            return;
        }

        // 1. Fetch initial orders
        const fetchOrders = async () => {
            try {
                const { data, error } = await client
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

                if (error) throw error;

                if (data) {
                    const transformedOrders = data.map((o: any) => ({
                        id: o.id,
                        room: o.room_number,
                        items: o.order_items?.map((oi: any) => oi.menu_items?.name || "Unknown Item") || [],
                        status: o.status,
                        time: new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        total: `$${o.total_amount}`
                    }));
                    setOrders(transformedOrders);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();

        // 2. Subscribe to Realtime Inserts
        const channel = client
            .channel('schema-db-changes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'orders',
                },
                (payload) => {
                    const newOrder = payload.new as any;

                    // Optimistic update - in reality we might want to fetch relations
                    setOrders((prev) => [
                        {
                            id: newOrder.id,
                            room: newOrder.room_number,
                            items: ["New Order..."], // Placeholder until refresh/fetch
                            status: newOrder.status,
                            time: new Date(newOrder.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            total: `$${newOrder.total_amount}`
                        },
                        ...prev
                    ].slice(0, 10));

                    // Trigger refresh to get relation data (items names)
                    fetchOrders();
                }
            )
            .subscribe();

        return () => {
            client.removeChannel(channel);
        };
    }, []);

    return (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm overflow-hidden h-full flex flex-col">
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
                <h3 className="font-semibold text-white flex items-center gap-2">
                    <ShoppingBag size={18} className="text-primary" />
                    Live Order Feed
                </h3>
                <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full animate-pulse">
                    Realtime
                </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {isLoading && (
                    <div className="text-center py-8 text-gray-500 text-sm">Loading orders...</div>
                )}

                {!isLoading && orders.length === 0 && (
                    <div className="text-center py-8 text-gray-500 text-sm">No orders yet.</div>
                )}

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
