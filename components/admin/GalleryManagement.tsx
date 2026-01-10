"use client";

import React, { useState } from "react";
import { Folder, Image as ImageIcon, Trash2, Star, Plus, ArrowLeft, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { deleteGalleryItem, toggleGalleryFeatured } from "@/app/lib/actions";
import { GalleryUploadForm } from "./GalleryUploadForm";
import { FormOverlay } from "./FormOverlay";

interface GalleryItem {
    id: string;
    url: string;
    title: string;
    caption: string | null;
    category: string | null;
    featured: boolean;
    createdAt: Date;
}

interface GalleryManagementProps {
    items: GalleryItem[];
}

export function GalleryManagement({ items }: GalleryManagementProps) {
    const [activeFolder, setActiveFolder] = useState<{ title: string; category: string } | null>(null);
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    // Group items by category -> title (Folder)
    const folders = items.reduce((acc, item) => {
        const key = `${item.category || "Uncategorized"}|${item.title || "Untitled"}`;
        if (!acc[key]) {
            acc[key] = {
                title: item.title || "Untitled",
                category: item.category || "Uncategorized",
                cover: item.url,
                items: []
            };
        }
        acc[key].items.push(item);
        return acc;
    }, {} as Record<string, { title: string; category: string; cover: string; items: GalleryItem[] }>);

    const folderList = Object.values(folders).sort((a, b) => b.items[0].createdAt.getTime() - a.items[0].createdAt.getTime());

    // Filter items for active folder
    const activeItems = activeFolder
        ? items.filter(i => (i.title || "Untitled") === activeFolder.title && (i.category || "Uncategorized") === activeFolder.category)
        : [];

    return (
        <div className="space-y-8">

            {/* Folder Grid View */}
            <AnimatePresence mode="wait">
                {!activeFolder ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {/* New Folder Action */}
                        <button
                            onClick={() => setIsUploadOpen(true)}
                            className="group relative aspect-[4/3] bg-zinc-900/50 border-2 border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center gap-4 hover:border-primary/50 hover:bg-zinc-900 transition-all cursor-pointer"
                        >
                            <div className="w-16 h-16 rounded-full bg-zinc-800 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                                <Plus size={32} className="text-zinc-500 group-hover:text-primary transition-colors" />
                            </div>
                            <span className="font-heading font-black uppercase tracking-widest text-zinc-500 group-hover:text-white pb-1 border-b border-transparent group-hover:border-primary transition-all">New Album</span>
                        </button>

                        {/* Existing Folders */}
                        {folderList.map((folder, idx) => (
                            <div
                                key={idx}
                                onClick={() => setActiveFolder({ title: folder.title, category: folder.category })}
                                className="group relative aspect-[4/3] cursor-pointer"
                            >
                                {/* Visual Stack Effect */}
                                <div className="absolute top-0 left-0 right-0 bottom-0 bg-zinc-800 rounded-xl rotate-6 scale-90 opacity-20 group-hover:rotate-12 transition-transform duration-500" />
                                <div className="absolute top-0 left-0 right-0 bottom-0 bg-zinc-800 rounded-xl rotate-3 scale-95 opacity-40 group-hover:rotate-6 transition-transform duration-500" />

                                {/* Main Card */}
                                <div className="absolute inset-0 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl group-hover:translate-y-[-4px] transition-transform duration-300">
                                    <img src={folder.cover} alt={folder.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

                                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-1 block">{folder.category}</span>
                                        <h3 className="text-xl font-heading font-bold uppercase text-white leading-none mb-2">{folder.title}</h3>
                                        <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
                                            <ImageIcon size={12} />
                                            {folder.items.length} Items
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                ) : (
                    /* Detailed Folder View */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-8"
                    >
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
                            <div className="flex items-center gap-6">
                                <button
                                    onClick={() => setActiveFolder(null)}
                                    className="p-3 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white transition-colors"
                                >
                                    <ArrowLeft size={24} />
                                </button>
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block mb-1">
                                        Editing Album
                                    </span>
                                    <h2 className="text-4xl font-heading font-black uppercase text-white">
                                        {activeFolder.title} <span className="text-primary text-xl align-top px-2 border border-zinc-800 rounded bg-black/50">{activeFolder.category}</span>
                                    </h2>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsUploadOpen(true)}
                                className="flex items-center gap-2 px-6 py-3 bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-colors skew-x-[-12deg]"
                            >
                                <span className="skew-x-[12deg] flex items-center gap-2">
                                    <Plus size={16} /> Add visuals
                                </span>
                            </button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {activeItems.map((item) => (
                                <div key={item.id} className="group relative aspect-square bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 hover:border-zinc-600 transition-colors">
                                    <img src={item.url} alt={item.caption || "Image"} className="w-full h-full object-cover" />

                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                                        <button
                                            onClick={() => toggleGalleryFeatured(item.id, !item.featured)}
                                            className={`p-2 rounded-full ${item.featured ? 'bg-yellow-500 text-black' : 'bg-black text-white border border-white/20'} hover:scale-110 transition-transform`}
                                            title="Toggle Featured"
                                        >
                                            <Star size={16} fill={item.featured ? "currentColor" : "none"} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (confirm("Confirm deletion of this asset?")) deleteGalleryItem(item.id);
                                            }}
                                            className="p-2 rounded-full bg-red-900/80 text-white border border-red-500/50 hover:bg-red-600 hover:scale-110 transition-transform"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    {item.caption && (
                                        <div className="absolute bottom-0 inset-x-0 p-2 bg-black/80 text-[10px] text-zinc-300 truncate">
                                            {item.caption}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Global Upload Modal */}
            <FormOverlay
                title={activeFolder ? "Add to Album" : "New Visual Intel"}
                open={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
            >
                <GalleryUploadForm
                    onSuccess={() => {
                        // Keep modal open or close? Typically close.
                        // But we need to refresh.
                        // The revalidatePath updates server data, router.refresh updates client.
                        // We might want to keep the folder open if we were in one.
                        // Since this component uses `items` prop which comes from server, 
                        // router.refresh() will update `items` prop and re-render this.
                        // State `activeFolder` should persist if title/category matches.
                    }}
                    initialTitle={activeFolder?.title}
                    initialCategory={activeFolder?.category}
                />
            </FormOverlay>

        </div>
    );
}
