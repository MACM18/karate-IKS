"use client";

import React, { useState } from 'react';
import { createPost } from '@/app/lib/actions';
import { Save, Plus, ImageIcon, Globe, Lock } from 'lucide-react';

export function NewsForm() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('NEWS');
    const [published, setPublished] = useState(true);
    const [imageUrl, setImageUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.target as HTMLFormElement);
        formData.set('published', published.toString());

        try {
            await createPost(formData);
            setTitle('');
            setContent('');
            setImageUrl('');
            alert('Post forged successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to forge post.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 p-6 space-y-6">
            <div className="space-y-4">
                <label className="block text-xs font-black uppercase tracking-widest text-zinc-500">Notice Title</label>
                <input
                    name="title"
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-black border border-zinc-800 p-3 text-white focus:border-primary outline-none transition-colors"
                    placeholder="e.g., Annual Gasshuku 2026"
                />
            </div>

            <div className="space-y-4">
                <label className="block text-xs font-black uppercase tracking-widest text-zinc-500">Category</label>
                <select
                    name="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-black border border-zinc-800 p-3 text-white focus:border-primary outline-none transition-colors capitalize"
                >
                    <option value="NEWS">General News</option>
                    <option value="EVENT">Upcoming Event</option>
                    <option value="PROMOTION">Rank Promotion</option>
                    <option value="ALERT">Emergency Alert</option>
                </select>
            </div>

            <div className="space-y-4">
                <label className="block text-xs font-black uppercase tracking-widest text-zinc-500">Content (Intel)</label>
                <textarea
                    name="content"
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-black border border-zinc-800 p-3 text-white focus:border-primary outline-none transition-colors min-h-[150px]"
                    placeholder="Provide full details of the notice..."
                />
            </div>

            <div className="space-y-4">
                <label className="block text-xs font-black uppercase tracking-widest text-zinc-500">Visuals (Image URL or Upload)</label>
                <div className="space-y-4">
                    <input
                        name="imageUrl"
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full bg-black border border-zinc-800 p-3 text-xs text-zinc-400 focus:border-primary outline-none transition-colors"
                        placeholder="External image URL..."
                    />
                    <div className="relative">
                        <input
                            name="file"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="file-upload"
                        />
                        <label
                            htmlFor="file-upload"
                            className="flex items-center justify-center gap-2 w-full bg-black border border-dashed border-zinc-800 p-4 text-xs font-black uppercase tracking-widest text-zinc-600 hover:text-primary hover:border-primary cursor-pointer transition-all"
                        >
                            <Plus size={16} /> Upload New Strategic Visual
                        </label>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                <button
                    type="button"
                    onClick={() => setPublished(!published)}
                    className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-colors ${published ? 'text-emerald-500' : 'text-zinc-600'
                        }`}
                >
                    {published ? <Globe size={14} /> : <Lock size={14} />}
                    {published ? 'Publicly Broadcast' : 'Save as Draft'}
                </button>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-2 text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all disabled:opacity-50"
                >
                    {isSubmitting ? 'Forging...' : (
                        <>
                            <Save size={16} /> Broadcast
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
