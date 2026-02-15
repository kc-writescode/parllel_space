
"use client";

import { useEffect, useState } from "react";
import { Mic, Phone, AlertCircle, Volume2 } from "lucide-react";
import { motion } from "framer-motion";

export function ActiveCallMonitor() {
    const [isTalking, setIsTalking] = useState(false);
    const [transcript, setTranscript] = useState<string[]>([]);

    // Simulation of a conversation
    useEffect(() => {
        const dialog = [
            { speaker: "Guest (Room 304)", text: "Hello? Is this room service?" },
            { speaker: "AI Agent", text: "Yes, this is the Concierge. How can I help you today?" },
            { speaker: "Guest (Room 304)", text: "I'd like to order a Club Sandwich, but without mayo." },
            { speaker: "AI Agent", text: "One Club Sandwich, no mayo. Would you like any drinks with that?" },
            { speaker: "Guest (Room 304)", text: "Just a Diet Coke, please." },
            { speaker: "AI Agent", text: "Got it. Anything else?" },
            { speaker: "Guest (Room 304)", text: "No, that's all. Can you charge it to the room?" },
            { speaker: "AI Agent", text: "Certainly. It will be charged to Room 304. It should arrive in 20 minutes." }
        ];

        let i = 0;
        const interval = setInterval(() => {
            if (i >= dialog.length) {
                setTranscript([]); // Reset
                i = 0;
            }

            const line = dialog[i];
            setTranscript(prev => [...prev, `${line.speaker}: ${line.text}`].slice(-5));
            setIsTalking(true);
            setTimeout(() => setIsTalking(false), 2000);

            i++;
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm overflow-hidden flex flex-col h-full relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none" />

            {/* Header */}
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/80">
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                    <h3 className="font-semibold text-white text-sm">Active Call: Room 304</h3>
                </div>
                <div className="px-2 py-1 rounded bg-neutral-800 text-xs text-gray-400 font-mono">
                    00:42
                </div>
            </div>

            {/* Waveform Visualization (Mock) */}
            <div className="h-24 flex items-center justify-center gap-1 bg-neutral-950/50 border-b border-neutral-800">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="w-1 bg-primary/60 rounded-full"
                        animate={{
                            height: isTalking ? [10, 40, 10] : 4,
                            opacity: isTalking ? 1 : 0.3
                        }}
                        transition={{
                            duration: 0.5,
                            repeat: Infinity,
                            delay: i * 0.05
                        }}
                    />
                ))}
            </div>

            {/* Transcript Log */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-sm">
                {transcript.map((line, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-2 rounded ${line.startsWith("AI") ? "bg-primary/10 text-primary border border-primary/20 ml-4" : "bg-neutral-800/50 text-gray-300 mr-4"}`}
                    >
                        {line}
                    </motion.div>
                ))}
            </div>

            {/* Agent Status */}
            <div className="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 border border-emerald-500/30">
                    <Mic size={16} />
                </div>
                <div>
                    <p className="text-xs font-medium text-white">Agent Status: Listening</p>
                    <p className="text-[10px] text-gray-500">Latency: 45ms • Model: GPT-4o-Realtime</p>
                </div>
                <button className="ml-auto px-3 py-1.5 bg-red-500/10 text-red-500 text-xs font-medium rounded hover:bg-red-500 hover:text-white transition-colors border border-red-500/20">
                    Terminate
                </button>
            </div>
        </div>
    );
}
