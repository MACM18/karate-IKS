"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { Maximize2, X, ChevronLeft, ChevronRight, Layers } from "lucide-react";

interface GalleryItem {
    id: string; // Add id for keying
    url: string;
    caption: string;
    category: string;
    title: string;
    featured: boolean;
}

interface GalleryContentProps {
    initialItems: GalleryItem[];
}

export default function GalleryContent({ initialItems }: GalleryContentProps) {
    const [selectedStack, setSelectedStack] = useState<{ title: string; category: string; items: GalleryItem[] } | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [filter, setFilter] = useState("All");

    // Group items by Title (Stacks)
    const stacks = initialItems.reduce((acc, item) => {
        const key = item.title || "Untitled";
        if (!acc[key]) {
            acc[key] = {
                title: key,
                category: item.category,
                items: []
            };
        }
        acc[key].items.push(item);
        return acc;
    }, {} as Record<string, { title: string; category: string; items: GalleryItem[] }>);

    const stackList = Object.values(stacks).sort((a, b) => b.items.length - a.items.length); // Sort by size or date? Assuming initialItems is sorted by date, order is preserved.

    const categories = ["All", ...Array.from(new Set(initialItems.map(item => item.category)))];

    const filteredStacks = filter === "All"
        ? stackList
        : stackList.filter(stack => stack.category === filter);

    const handleStackClick = (stack: { title: string; category: string; items: GalleryItem[] }) => {
        setSelectedStack(stack);
        setCurrentImageIndex(0);
    };

    const nextImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (selectedStack) {
            setCurrentImageIndex((prev) => (prev + 1) % selectedStack.items.length);
        }
    };

    const prevImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (selectedStack) {
            setCurrentImageIndex((prev) => (prev - 1 + selectedStack.items.length) % selectedStack.items.length);
        }
    };

    return (
        <div className="min-h-screen bg-background pt-32 pb-24">
            <div className="container mx-auto px-4 lg:px-8">
                <header className="mb-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 mb-4"
                    >
                        <span className="h-px w-8 bg-primary"></span>
                        <span className="text-primary font-heading font-bold uppercase tracking-[0.3em] text-xs">
                            Visual Archive
                        </span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-heading font-black uppercase text-foreground leading-none tracking-tighter"
                    >
                        Dojo <span className="text-primary italic">Gallery</span>
                    </motion.h1>

                    <div className="flex flex-wrap gap-4 mt-12">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all skew-x-[-12deg] ${filter === cat
                                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                                    : "bg-zinc-900 text-zinc-400 hover:text-white"
                                    }`}
                            >
                                <span className="skew-x-[12deg] block">{cat}</span>
                            </button>
                        ))}
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 gap-y-16">
                    {filteredStacks.map((stack, i) => (
                        <motion.div
                            key={stack.title}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="group cursor-pointer perspective-1000"
                            onClick={() => handleStackClick(stack)}
                        >
                            <div className="relative aspect-[4/3] mb-6">
                                {/* Stack Layers */}
                                {stack.items.length > 2 && (
                                    <div className="absolute inset-0 bg-zinc-800 rounded-lg transform rotate-6 scale-90 opacity-40 group-hover:rotate-12 group-hover:scale-95 transition-all duration-500 origin-bottom-right" />
                                )}
                                {stack.items.length > 1 && (
                                    <div className="absolute inset-0 bg-zinc-800 rounded-lg transform rotate-3 scale-95 opacity-60 group-hover:rotate-6 group-hover:scale-100 transition-all duration-500 origin-bottom-right" />
                                )}

                                {/* Top Image */}
                                <div className="absolute inset-0 rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl group-hover:translate-y-[-8px] transition-transform duration-500">
                                    <Image
                                        src={stack.items[0].url}
                                        alt={stack.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

                                    {/* Count Badge */}
                                    {stack.items.length > 1 && (
                                        <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded text-xs font-black flex items-center gap-1 shadow-lg">
                                            <Layers size={12} />
                                            {stack.items.length}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2 px-2">
                                <h3 className="text-2xl font-heading font-black uppercase text-white group-hover:text-primary transition-colors line-clamp-1">
                                    {stack.title}
                                </h3>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                        {stack.category}
                                    </span>
                                    <span className="text-[10px] font-bold text-zinc-600 group-hover:text-zinc-400 transition-colors">
                                        View Collection &rarr;
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filteredStacks.length === 0 && (
                    <div className="py-32 text-center">
                        <p className="text-zinc-600 font-medium italic text-xl">No archives found for this classification.</p>
                    </div>
                )}
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedStack && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/98 flex flex-col"
                        onClick={() => setSelectedStack(null)}
                    >
                        {/* Lightbox Controls */}
                        <div className="w-full p-6 flex items-start justify-between z-20 pointer-events-none">
                            <div className="text-left pointer-events-auto">
                                <h3 className="text-2xl font-heading font-black uppercase text-white tracking-wide">
                                    {selectedStack.title}
                                </h3>
                                <p className="text-primary text-xs font-black uppercase tracking-widest">
                                    {selectedStack.category} • {currentImageIndex + 1} / {selectedStack.items.length}
                                </p>
                            </div>
                            <button
                                className="p-4 text-zinc-500 hover:text-white transition-colors pointer-events-auto"
                                onClick={() => setSelectedStack(null)}
                            >
                                <X size={32} />
                            </button>
                        </div>

                        {/* Main Image Area */}
                        <div className="flex-1 relative flex items-center justify-center p-4 md:p-12 overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedStack.items[currentImageIndex].id}
                                    initial={{ opacity: 0, scale: 1.1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="relative w-full h-full max-w-7xl max-h-[80vh]"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Image
                                        src={selectedStack.items[currentImageIndex].url}
                                        alt={selectedStack.items[currentImageIndex].caption || selectedStack.title}
                                        fill
                                        className="object-contain drop-shadow-2xl"
                                        priority
                                    />
                                    {selectedStack.items[currentImageIndex].caption && (
                                        <div className="absolute bottom-[-40px] left-0 right-0 text-center text-zinc-400 text-sm font-medium">
                                            {selectedStack.items[currentImageIndex].caption}
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            {/* Navigation Buttons */}
                            {selectedStack.items.length > 1 && (
                                <>
                                    <button
                                        className="absolute left-4 md:left-12 p-4 text-white/50 hover:text-primary hover:scale-110 transition-all z-20 bg-black/50 rounded-full backdrop-blur-sm"
                                        onClick={prevImage}
                                    >
                                        <ChevronLeft size={40} />
                                    </button>
                                    <button
                                        className="absolute right-4 md:right-12 p-4 text-white/50 hover:text-primary hover:scale-110 transition-all z-20 bg-black/50 rounded-full backdrop-blur-sm"
                                        onClick={nextImage}
                                    >
                                        <ChevronRight size={40} />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Filmstrip Thumbnails */}
                        {selectedStack.items.length > 1 && (
                            <div className="h-24 bg-zinc-950 border-t border-zinc-900 flex items-center gap-2 px-6 overflow-x-auto custom-scrollbar z-20" onClick={e => e.stopPropagation()}>
                                {selectedStack.items.map((item, idx) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`relative w-16 h-16 flex-shrink-0 border-2 rounded transition-all overflow-hidden ${currentImageIndex === idx ? "border-primary scale-110 opacity-100" : "border-transparent opacity-40 hover:opacity-80"
                                            }`}
                                    >
                                        <Image src={item.url} alt="thumbnail" fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
