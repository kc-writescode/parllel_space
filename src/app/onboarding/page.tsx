"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, ChevronRight, Check, Globe, CreditCard, PhoneCall, Loader2, List } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
    id: number;
    title: string;
    description: string;
}

const STEPS: Step[] = [
    { id: 1, title: "Hotel Profile", description: "Basic details about your property" },
    { id: 2, title: "Connect Menu", description: "Import menu from website or Clover" },
    { id: 3, title: "Voice Setup", description: "Configure your AI concierge" },
];



import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function OnboardingPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        hotelName: "",
        websiteUrl: "",
        cloverKey: "",
        voiceId: "female-1"
    });

    const [menuSource, setMenuSource] = useState<'web' | 'clover' | null>(null);
    const [isScraping, setIsScraping] = useState(false);
    const [scrapedItems, setScrapedItems] = useState<any[]>([]);

    const [isSaving, setIsSaving] = useState(false);

    const handleNext = async () => {
        if (currentStep === 3) {
            setIsSaving(true);
            try {
                if (!supabase) throw new Error("Database connection not valid.");

                // 1. Create Hotel
                const { data: hotel, error: hotelError } = await supabase
                    .from('hotels')
                    .insert({
                        name: formData.hotelName,
                        website_url: formData.websiteUrl,
                        clover_merchant_id: formData.cloverKey,
                        voice_id: formData.voiceId,
                        phone_number: "+1512555" + Math.floor(Math.random() * 10000).toString().padStart(4, '0') // Generate random mock number
                    })
                    .select()
                    .single();

                if (hotelError) throw hotelError;

                // 2. Create Menu Items
                if (scrapedItems.length > 0 && hotel) {
                    const menuData = scrapedItems.map(item => ({
                        hotel_id: hotel.id,
                        name: item.name,
                        description: item.description,
                        price: typeof item.price === 'number' ? item.price : parseFloat(item.price),
                        category: "Imported",
                        is_available: true
                    }));

                    const { error: menuError } = await supabase
                        .from('menu_items')
                        .insert(menuData);

                    if (menuError) throw menuError;
                }

                router.push('/');
            } catch (error) {
                console.error("Error saving onboarding data:", error);
                alert("Failed to save setup. Please try again.");
            } finally {
                setIsSaving(false);
            }
            return;
        }
        if (currentStep < 3) setCurrentStep(c => c + 1);
    };

    const handleScrape = async () => {
        if (!formData.websiteUrl) return;

        setIsScraping(true);
        try {
            const res = await fetch('/api/integrations/web/scrape', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: formData.websiteUrl })
            });
            const data = await res.json();
            if (data.success && data.menu) {
                setScrapedItems(data.menu);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsScraping(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-black text-white relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-2xl">
                {/* Progress Bar */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-4">
                        {STEPS.map((step) => (
                            <div
                                key={step.id}
                                className={cn(
                                    "flex items-center gap-2",
                                    currentStep >= step.id ? "text-primary" : "text-gray-600"
                                )}
                            >
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border",
                                    currentStep >= step.id ? "bg-primary text-white border-primary" : "border-gray-700 text-gray-500"
                                )}>
                                    {currentStep > step.id ? <Check size={16} /> : step.id}
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-sm font-medium">{step.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-primary"
                            initial={{ width: "0%" }}
                            animate={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden min-h-[400px]">

                    <AnimatePresence mode="wait">
                        {currentStep === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">Welcome to Concierge AI</h2>
                                    <p className="text-gray-400">Let's get your hotel set up for automated voice ordering.</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="group">
                                        <label className="block text-sm font-medium text-gray-400 mb-1 group-focus-within:text-primary transition-colors">Property Name</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Grand Austin Hotel"
                                            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                            value={formData.hotelName}
                                            onChange={e => setFormData({ ...formData, hotelName: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">Connect Your Menu</h2>
                                    <p className="text-gray-400">We can sync items directly from your website or POS.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setMenuSource('web')}
                                        className={cn(
                                            "flex flex-col items-center justify-center p-6 rounded-xl border transition-all group relative overflow-hidden",
                                            menuSource === 'web'
                                                ? "border-primary bg-primary/10 ring-1 ring-primary/50"
                                                : "border-neutral-700 bg-neutral-800/30 hover:bg-neutral-800 hover:border-primary/50"
                                        )}
                                    >
                                        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 mb-3 group-hover:scale-110 transition-transform">
                                            <Globe size={24} />
                                        </div>
                                        <h3 className="font-semibold text-white">Import from Website</h3>
                                        <p className="text-xs text-gray-400 mt-1 text-center">Enter URL to scrape menu</p>
                                        {menuSource === 'web' && <div className="absolute top-2 right-2 text-primary"><Check size={16} /></div>}
                                    </button>

                                    <button
                                        onClick={() => setMenuSource('clover')}
                                        className={cn(
                                            "flex flex-col items-center justify-center p-6 rounded-xl border transition-all group relative overflow-hidden",
                                            menuSource === 'clover'
                                                ? "border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500/50"
                                                : "border-neutral-700 bg-neutral-800/30 hover:bg-neutral-800 hover:border-emerald-500/50"
                                        )}
                                    >
                                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
                                            <CreditCard size={24} />
                                        </div>
                                        <h3 className="font-semibold text-white">Connect Clover POS</h3>
                                        <p className="text-xs text-gray-400 mt-1 text-center">Sync via API Key</p>
                                        {menuSource === 'clover' && <div className="absolute top-2 right-2 text-emerald-500"><Check size={16} /></div>}
                                    </button>
                                </div>

                                {menuSource === 'web' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="pt-4 border-t border-neutral-800 space-y-4"
                                    >
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">Website URL</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="url"
                                                    placeholder="https://example-hotel.com/dining"
                                                    className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50"
                                                    value={formData.websiteUrl}
                                                    onChange={e => setFormData({ ...formData, websiteUrl: e.target.value })}
                                                />
                                                <button
                                                    onClick={handleScrape}
                                                    disabled={isScraping || !formData.websiteUrl}
                                                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 min-w-[100px] flex items-center justify-center"
                                                >
                                                    {isScraping ? <Loader2 className="animate-spin" size={18} /> : "Scrape"}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Scraped Items Display */}
                                        {scrapedItems.length > 0 && (
                                            <div className="mt-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                                        <List size={14} className="text-primary" />
                                                        Found {scrapedItems.length} Items
                                                    </h4>
                                                    <span className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">Ready to import</span>
                                                </div>
                                                <div className="max-h-40 overflow-y-auto border border-neutral-800 rounded-lg bg-neutral-950/50 p-2 space-y-1 custom-scrollbar">
                                                    {scrapedItems.map((item, idx) => (
                                                        <div key={idx} className="flex justify-between items-center p-2 hover:bg-neutral-900 rounded text-xs group">
                                                            <span className="text-gray-300 truncate max-w-[200px]">{item.name}</span>
                                                            <span className="font-mono text-gray-500 group-hover:text-white transition-colors">${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {menuSource === 'clover' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="pt-4 border-t border-neutral-800"
                                    >
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Clover Merchant ID</label>
                                        <input
                                            type="password"
                                            placeholder="sk_live_..."
                                            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50"
                                            value={formData.cloverKey}
                                            onChange={e => setFormData({ ...formData, cloverKey: e.target.value })}
                                        />
                                        <p className="text-xs text-emerald-400 mt-2 flex items-center">
                                            <Check size={12} className="mr-1" /> Auto-detected Clover US Region
                                        </p>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}

                        {currentStep === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">Voice Configuration</h2>
                                    <p className="text-gray-400">Choose the voice your guests will hear.</p>
                                </div>

                                <div className="space-y-3">
                                    {['Sarah (Standard)', 'James (Premium)', 'Emma (British)'].map((voice, i) => (
                                        <div
                                            key={i}
                                            onClick={() => setFormData({ ...formData, voiceId: voice })}
                                            className={cn(
                                                "flex items-center p-3 rounded-lg border cursor-pointer transition-all",
                                                formData.voiceId === voice
                                                    ? "border-primary bg-primary/10 ring-1 ring-primary/50"
                                                    : "border-neutral-800 hover:bg-neutral-900"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-8 h-8 rounded-full flex items-center justify-center mr-3",
                                                formData.voiceId === voice ? "bg-primary text-white" : "bg-neutral-800 text-gray-400"
                                            )}>
                                                <PhoneCall size={14} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-white">{voice}</p>
                                                <p className="text-xs text-gray-500">Natural, calm tone</p>
                                            </div>
                                            {formData.voiceId === voice && <Check size={16} className="text-primary" />}
                                        </div>
                                    ))}
                                </div>

                                <div className="p-4 bg-emerald-900/10 border border-emerald-500/20 rounded-lg flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 mt-0.5">
                                        <Check size={12} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-emerald-400">Phone Number Generated</h4>
                                        <p className="text-xs text-emerald-500/70 mt-1">+1 (512) 555-0198 (Waiting for activation)</p>
                                    </div>
                                </div>

                            </motion.div>
                        )}

                    </AnimatePresence>

                    <div className="mt-8 flex items-center justify-between pt-6 border-t border-neutral-800">
                        <button
                            onClick={() => setCurrentStep(c => Math.max(1, c - 1))}
                            disabled={currentStep === 1}
                            className="px-4 py-2 text-sm text-gray-500 hover:text-white disabled:opacity-50 transition-colors"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={(currentStep === 1 && !formData.hotelName) || (currentStep === 2 && menuSource === 'web' && scrapedItems.length === 0)}
                            className="px-6 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {currentStep === 3 ? "Complete Setup" : "Continue"}
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
