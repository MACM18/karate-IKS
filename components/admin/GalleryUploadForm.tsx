"use client";

import React, { useState } from 'react';
import { createGalleryItem } from '@/app/lib/actions';
import { Save, Plus, ImageIcon, Star } from 'lucide-react';

export function GalleryUploadForm({ onSuccess }: { onSuccess?: () => void }) {
    const [caption, setCaption] = useState('');
    const [category, setCategory] = useState('Dojo');
    const [url, setUrl] = useState('');
    const [featured, setFeatured] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.target as HTMLFormElement);
        formData.set('featured', featured.toString());

        try {
            await createGalleryItem(formData);
            setCaption('');
            setUrl('');
            setFeatured(false);
            alert('Visual intel archived successfully!');
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error(error);
            alert('Failed to archive visual intel.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 p-6 space-y-6">
            <div className="space-y-4">
                <label className="block text-xs font-black uppercase tracking-widest text-zinc-500">Caption (Description)</label>
                <textarea
                    name="caption"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="w-full bg-black border border-zinc-800 p-3 text-white focus:border-primary outline-none transition-colors min-h-[80px] text-sm"
                    placeholder="e.g., Focus and precision during the morning session..."
                />
            </div>

            <div className="space-y-4">
                <label className="block text-xs font-black uppercase tracking-widest text-zinc-500">Category</label>
                <input
                    name="category"
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-black border border-zinc-800 p-3 text-white focus:border-primary outline-none transition-colors"
                    placeholder="e.g., Seminar, Grading, Tournament"
                />
            </div>

            <div className="space-y-4">
                <label className="block text-xs font-black uppercase tracking-widest text-zinc-500">Strategic Source</label>
                <div className="space-y-4">
                    <input
                        name="url"
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full bg-black border border-zinc-800 p-3 text-xs text-zinc-400 focus:border-primary outline-none transition-colors"
                        placeholder="Direct Image URL..."
                    />
                    <div className="relative">
                        <input
                            name="file"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="gallery-file-upload"
                        />
                        <label
                            htmlFor="gallery-file-upload"
                            className="flex items-center justify-center gap-2 w-full bg-black border border-dashed border-zinc-800 p-4 text-xs font-black uppercase tracking-widest text-zinc-600 hover:text-primary hover:border-primary cursor-pointer transition-all"
                        >
                            <Plus size={16} /> Upload New Physical Intel
                        </label>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                <button
                    type="button"
                    onClick={() => setFeatured(!featured)}
                    className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-colors ${featured ? 'text-yellow-500' : 'text-zinc-600'
                        }`}
                >
                    <Star size={14} fill={featured ? 'currentColor' : 'none'} />
                    {featured ? 'Featured on Front' : 'Standard Archive'}
                </button>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-2 text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all disabled:opacity-50"
                >
                    {isSubmitting ? 'Archiving...' : (
                        <>
                            <Save size={16} /> Commit to Archive
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
