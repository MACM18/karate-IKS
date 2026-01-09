"use client";

import { ResourceCard } from "@/components/student/ResourceCard";
import { Search, BookOpen, Layers } from "lucide-react";
import { useState } from "react";

interface Resource {
    id: string;
    title: string;
    description: string;
    type: "video" | "pdf";
    url: string;
    isLocked: boolean;
    requiredRank?: string;
}

export function ResourcesClient({ initialResources }: { initialResources: Resource[] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState<"all" | "video" | "pdf">("all");

    const filteredResources = initialResources.filter(res => {
        const matchesSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            res.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === "all" || res.type === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-10 max-w-7xl mx-auto w-full">
            <header className="mb-16">
                <div className="flex items-center gap-4 text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-4">
                    <div className="w-12 h-px bg-primary" />
                    Archive Access
                </div>
                <h1 className="text-6xl font-heading font-black uppercase tracking-tighter text-white">
                    Dojo <span className="text-primary italic">Archives</span>
                </h1>
                <p className="text-zinc-500 mt-4 font-medium max-w-2xl">
                    Master the sacred techniques. Access Heian katas, Kihon manuals, and restricted combat intelligence based on your rank.
                </p>
            </header>

            {/* Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                <div className="flex gap-4">
                    <button
                        onClick={() => setFilter("all")}
                        className={`px-8 py-3 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all
                        ${filter === 'all'
                                ? 'bg-primary text-white'
                                : 'bg-zinc-900 text-zinc-500 hover:text-white border border-zinc-800'}`}
                    >
                        Alpha View
                    </button>
                    <button
                        onClick={() => setFilter("video")}
                        className={`px-8 py-3 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all
                        ${filter === 'video'
                                ? 'bg-primary text-white'
                                : 'bg-zinc-900 text-zinc-500 hover:text-white border border-zinc-800'}`}
                    >
                        Visual Signal
                    </button>
                    <button
                        onClick={() => setFilter("pdf")}
                        className={`px-8 py-3 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all
                        ${filter === 'pdf'
                                ? 'bg-primary text-white'
                                : 'bg-zinc-900 text-zinc-500 hover:text-white border border-zinc-800'}`}
                    >
                        Manuscripts
                    </button>
                </div>

                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="SEARCH ARCHIVES..."
                        className="w-full bg-zinc-900 border border-zinc-800 py-3 pl-12 pr-4 rounded-sm text-[10px] font-black uppercase tracking-widest text-white focus:outline-none focus:border-primary placeholder:text-zinc-700 transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-32">
                {filteredResources.length === 0 ? (
                    <div className="col-span-full py-32 text-center border border-dashed border-zinc-800 rounded-lg">
                        <Layers size={48} className="mx-auto text-zinc-800 mb-6 opacity-20" />
                        <p className="text-zinc-700 font-bold uppercase tracking-widest italic">No matching intelligence found in archives.</p>
                    </div>
                ) : (
                    filteredResources.map((res) => (
                        <ResourceCard
                            key={res.id}
                            title={res.title}
                            description={res.description}
                            type={res.type}
                            isLocked={res.isLocked}
                            requiredRank={res.requiredRank}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
