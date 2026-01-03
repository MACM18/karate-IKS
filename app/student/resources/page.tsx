"use client";

import { ResourceCard } from "@/components/student/ResourceCard";
import { Search } from "lucide-react";
import { useState } from "react";

export default function ResourcesPage() {
    const [activeTab, setActiveTab] = useState<"all" | "kata" | "tech">("all");

    const resources = [
        { title: "Heian Shodan - Slow Motion", type: "video" as const, description: "Step-by-step breakdown of the first kata.", isLocked: false },
        { title: "Kihon (Basics) Manual", type: "pdf" as const, description: "Official syllabus for 9th Kyu to 8th Kyu.", isLocked: false },
        { title: "Heian Nidan - Bunkai", type: "video" as const, description: "Application of techniques for Orange Belt.", isLocked: true, requiredRank: "Yellow Belt" },
        { title: "Kumite Drills - Set 1", type: "video" as const, description: "Basic sparring combinations for beginners.", isLocked: false },
        { title: "Tournament Rules 2026", type: "pdf" as const, description: "Updated competition scoring guidelines.", isLocked: false },
        { title: "Black Belt Essay Guide", type: "pdf" as const, description: "Requirements for the Shodan written exam.", isLocked: true, requiredRank: "Brown Belt" },
    ];

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <header className="mb-12">
                <h1 className="text-4xl font-heading uppercase tracking-widest text-white mb-4 animate-in slide-in-from-left-4">
                    Digital Dojo Bag
                </h1>
                <p className="text-zinc-500 max-w-2xl">
                    Your personal library of training resources. Master your techniques at home.
                </p>
            </header>

            {/* Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="flex gap-2">
                    {["all", "kata", "tech"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-all
                    ${activeTab === tab
                                    ? 'bg-white text-black'
                                    : 'bg-zinc-900 text-zinc-500 hover:text-white border border-zinc-800'}`}
                        >
                            {tab === 'tech' ? 'Technique' : tab}
                        </button>
                    ))}
                </div>

                <div className="relative max-w-md w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                    <input
                        type="text"
                        placeholder="Search resources..."
                        className="w-full md:w-64 bg-zinc-900 border border-zinc-800 py-2 pl-10 pr-4 rounded-full text-sm text-white focus:outline-none focus:border-zinc-700 placeholder:text-zinc-600"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                {resources.map((res, i) => (
                    <ResourceCard
                        key={i}
                        {...res}
                    />
                ))}
            </div>
        </div>
    );
}
