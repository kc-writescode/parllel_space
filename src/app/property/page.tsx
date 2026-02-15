"use client";

import { Building2, Globe, Phone } from "lucide-react";

export default function PropertyPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-8 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Building2 className="text-primary" />
                    Property Profile
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="group">
                            <label className="block text-sm font-medium text-gray-400 mb-1">Hotel Name</label>
                            <input type="text" defaultValue="Grand Austin Hotel" className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:outline-none focus:border-primary/50" />
                        </div>

                        <div className="group">
                            <label className="block text-sm font-medium text-gray-400 mb-1">Brand Voice</label>
                            <select className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:outline-none focus:border-primary/50">
                                <option>Professional & Corporate</option>
                                <option>Warm & Welcoming</option>
                                <option>Luxury & Concierge</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="group">
                            <label className="block text-sm font-medium text-gray-400 mb-1">Internal Phone Extension</label>
                            <div className="flex bg-neutral-950 border border-neutral-800 rounded-lg overflow-hidden">
                                <span className="bg-neutral-900 px-3 py-3 text-gray-500 border-r border-neutral-800 flex items-center">
                                    <Phone size={14} />
                                </span>
                                <input type="text" defaultValue="001" className="flex-1 bg-transparent p-3 text-white focus:outline-none" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button className="px-6 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
