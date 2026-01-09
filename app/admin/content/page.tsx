"use client";

import { useState } from "react";
import { NewsCard } from "@/components/NewsCard";
import { PenTool, Save, FilePlus, Image as ImageIcon, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { createPost, createGalleryItem } from "@/app/lib/actions";
import { motion, AnimatePresence } from "framer-motion";

type Tab = "feed" | "gallery" | "achievements";

export default function ContentPage() {
    const [activeTab, setActiveTab] = useState<Tab>("feed");

    // News Post State
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("News");
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Gallery State
    const [galleryUrl, setGalleryUrl] = useState("");
    const [galleryCaption, setGalleryCaption] = useState("");
    const [galleryCategory, setGalleryCategory] = useState("Class");

    const handlePublishPost = async () => {
        if (!title || !content) return;
        setIsSubmitting(true);
        try {
            await createPost({
                title,
                content,
                category: category.toUpperCase(),
                imageUrl: imageUrl || undefined,
                published: true
            });
            alert("Post published successfully!");
            setTitle("");
            setContent("");
            setImageUrl("");
        } catch (error) {
            alert("Failed to publish post.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddGallery = async () => {
        if (!galleryUrl) return;
        setIsSubmitting(true);
        try {
            await createGalleryItem({
                url: galleryUrl,
                caption: galleryCaption,
                category: galleryCategory,
                featured: false
            });
            alert("Image added to gallery!");
            setGalleryUrl("");
            setGalleryCaption("");
        } catch (error) {
            alert("Failed to add image.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-8 min-h-screen flex flex-col bg-background">
            <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-heading font-black uppercase text-foreground leading-none tracking-tighter">
                        Content <span className="text-primary italic">Forge</span>
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">Engineer the digital presence of the Shinbukan legacy.</p>
                </div>

                <div className="flex bg-muted/20 p-1 border border-border rounded-sm">
                    {(["feed", "gallery", "achievements"] as Tab[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-sm ${activeTab === tab
                                ? "bg-primary text-white shadow-lg"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </header>

            <AnimatePresence mode="wait">
                {activeTab === "feed" && (
                    <motion.div
                        key="feed"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-16"
                    >
                        {/* News Editor */}
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Intelligence Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g., BLACK BELT SEMINAR 2024"
                                    className="w-full bg-muted/10 border border-border py-4 px-4 text-foreground text-sm focus:outline-none focus:border-primary transition-all font-bold"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Classification</label>
                                <div className="flex flex-wrap gap-3">
                                    {['News', 'Events', 'Promotions', 'Alerts'].map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setCategory(cat)}
                                            className={`px-4 py-2 border text-[10px] font-black uppercase tracking-widest transition-all ${category === cat
                                                ? 'border-primary bg-primary/10 text-primary'
                                                : 'border-border text-muted-foreground hover:border-muted'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Visual Asset URL</label>
                                <input
                                    type="text"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    placeholder="https://images.unsplash.com/..."
                                    className="w-full bg-muted/10 border border-border py-4 px-4 text-foreground text-sm focus:outline-none focus:border-primary transition-all font-bold placeholder:opacity-30"
                                />
                            </div>

                            <div className="space-y-3 flex-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Dojo Intelligence Content</label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Details of the transmission..."
                                    className="w-full h-64 bg-muted/10 border border-border py-4 px-4 text-foreground text-sm focus:outline-none focus:border-primary transition-all font-bold resize-none leading-relaxed"
                                />
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-border">
                                <button
                                    onClick={handlePublishPost}
                                    disabled={isSubmitting || !title || !content}
                                    className="flex items-center gap-2 px-10 py-4 bg-primary text-white font-black uppercase tracking-widest text-xs hover:bg-red-700 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
                                >
                                    {isSubmitting ? "TRANSMITTING..." : "PUBLISH INTELLIGENCE"} <CheckCircle2 size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="sticky top-8">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Transmission Preview</p>
                            <div className="border border-border p-8 bg-muted/5 opacity-80 scale-95 origin-top">
                                <NewsCard
                                    title={title || "INTELLIGENCE TITLE"}
                                    excerpt={content || "The transmission content will appear here..."}
                                    date={new Date().toLocaleDateString()}
                                    category={category}
                                    imageUrl={imageUrl || undefined}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === "gallery" && (
                    <motion.div
                        key="gallery"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="max-w-4xl mx-auto w-full"
                    >
                        <div className="bg-muted/10 border border-border p-12 space-y-8">
                            <h2 className="text-2xl font-heading font-black uppercase text-foreground">Deploy Visual Asset</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Asset URL</label>
                                    <input
                                        type="text"
                                        value={galleryUrl}
                                        onChange={(e) => setGalleryUrl(e.target.value)}
                                        placeholder="https://..."
                                        className="w-full bg-background border border-border py-4 px-4 text-foreground text-sm focus:outline-none focus:border-primary transition-all font-bold"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Classification</label>
                                    <select
                                        value={galleryCategory}
                                        onChange={(e) => setGalleryCategory(e.target.value)}
                                        className="w-full bg-background border border-border py-4 px-4 text-foreground text-sm focus:outline-none focus:border-primary transition-all font-bold appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207L10%2012L15%207%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:20px_20px] bg-[right_1rem_center] bg-no-repeat"
                                    >
                                        <option>Class</option>
                                        <option>Tournament</option>
                                        <option>Seminar</option>
                                        <option>History</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2 space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Mission Legend (Caption)</label>
                                    <input
                                        type="text"
                                        value={galleryCaption}
                                        onChange={(e) => setGalleryCaption(e.target.value)}
                                        placeholder="Brief description of the capture..."
                                        className="w-full bg-background border border-border py-4 px-4 text-foreground text-sm focus:outline-none focus:border-primary transition-all font-bold"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleAddGallery}
                                disabled={isSubmitting || !galleryUrl}
                                className="w-full py-5 bg-foreground text-background font-black uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-all shadow-xl disabled:opacity-50"
                            >
                                {isSubmitting ? "UPLOADING..." : "UPLOAD TO ARCHIVE"}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

