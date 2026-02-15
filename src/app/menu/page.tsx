"use client";

export default function MenuPage() {
    return (
        <div className="h-full flex flex-col items-center justify-center p-8 bg-neutral-900/30 rounded-xl border border-neutral-800">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Live Menu Manager</h2>
                <p className="text-gray-400 mb-6">Manage availability, 86 items, and update prices in real-time.</p>
                <button className="px-5 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                    Sync Now with Clover
                </button>
            </div>
        </div>
    );
}
