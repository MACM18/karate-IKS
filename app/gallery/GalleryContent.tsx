"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { Maximize2, X } from "lucide-react";

interface GalleryItem {
    url: string;
    caption: string;
    category: string;
    featured: boolean;
}

interface GalleryContentProps {
    initialItems: GalleryItem[];
}

export default function GalleryContent({ initialItems }: GalleryContentProps) {
    const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
    const [filter, setFilter] = useState("All");

    const categories = ["All", ...Array.from(new Set(initialItems.map(item => item.category)))];

    const filteredItems = filter === "All"
        ? initialItems
        : initialItems.filter(item => item.category === filter);

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
                                className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all border ${filter === cat
                                        ? "bg-primary border-primary text-white shadow-lg"
                                        : "border-border text-muted-foreground hover:border-foreground"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </header>

                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {filteredItems.map((item, i) => (
                        <motion.div
                            key={i}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="relative group cursor-pointer break-inside-avoid overflow-hidden border border-border bg-muted/5"
                            onClick={() => setSelectedImage(item)}
                        >
                            <Image
                                src={item.url}
                                alt={item.caption}
                                width={800}
                                height={600}
                                className="w-full h-auto grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-105"
                                // Loader/Unsplash optimization
                                loading="lazy"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">
                                    {item.category}
                                </span>
                                <p className="text-white font-bold leading-tight">
                                    {item.caption}
                                </p>
                                <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/50">
                                    <Maximize2 size={12} /> Expand
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filteredItems.length === 0 && (
                    <div className="py-24 text-center border border-dashed border-border">
                        <p className="text-muted-foreground font-medium italic">The archive is currently empty. Transmission pending.</p>
                    </div>
                )}
            </div>

            {/* Lightbox */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
                    onClick={() => setSelectedImage(null)}
                >
                    <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
                        <X size={32} />
                    </button>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative max-w-5xl w-full h-full flex flex-col gap-6"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="relative flex-1 bg-zinc-900 overflow-hidden">
                            <Image
                                src={selectedImage.url}
                                alt={selectedImage.caption}
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <span className="text-xs font-black uppercase tracking-widest text-primary mb-2 block">
                                    {selectedImage.category}
                                </span>
                                <h3 className="text-2xl font-heading font-black uppercase text-white tracking-widest">
                                    {selectedImage.caption}
                                </h3>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
