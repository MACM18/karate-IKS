"use client";

import { useState } from "react";
import { NewsCard } from "@/components/NewsCard";
import { PenTool, Save, Send } from "lucide-react";

export default function ContentPage() {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("News");
    const [content, setContent] = useState("");
    const [isPublished, setIsPublished] = useState(false);

    const handlePublish = () => {
        if (!title || !content) return;
        setIsPublished(true);
        setTimeout(() => {
            alert("Post published to Dojo Feed!");
            setTitle("");
            setContent("");
            setIsPublished(false);
        }, 500);
    };

    // Date for preview
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

    return (
        <div className="p-8 h-screen flex flex-col">
            <header className="mb-8">
                <h1 className="text-3xl font-heading uppercase text-white tracking-widest">
                    Content Manager
                </h1>
                <p className="text-zinc-500 mt-1">Create and publish updates to the digital dojo.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-full pb-20">

                {/* Editor Column */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Post Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Summer Grading Results"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded p-4 text-white focus:outline-none focus:border-zinc-700"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Category</label>
                        <div className="flex gap-4">
                            {['News', 'Events', 'Promotions', 'Alerts'].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setCategory(cat)}
                                    className={`px-4 py-2 rounded text-sm font-bold uppercase tracking-widest border transition-all
                            ${category === cat
                                            ? 'bg-white text-black border-white'
                                            : 'bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-600'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2 flex-1">
                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Content</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your announcement here..."
                            className="w-full h-64 bg-zinc-900 border border-zinc-800 rounded p-4 text-white focus:outline-none focus:border-zinc-700 resize-none leading-relaxed"
                        />
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-zinc-900">
                        <button className="flex items-center gap-2 px-6 py-3 border border-zinc-800 text-zinc-400 hover:text-white rounded uppercase text-xs font-bold tracking-widest transition-colors">
                            <Save size={16} /> Save Draft
                        </button>
                        <button
                            onClick={handlePublish}
                            disabled={!title || !content}
                            className={`flex items-center gap-2 px-6 py-3 rounded uppercase text-xs font-bold tracking-widest transition-all ml-auto
                    ${title && content
                                    ? 'bg-action text-white hover:bg-red-700 shadow-lg'
                                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}`}
                        >
                            <Send size={16} /> Publish Post
                        </button>
                    </div>
                </div>

                {/* Preview Column */}
                <div className="bg-zinc-950/50 border border-zinc-900 rounded-xl p-8 flex flex-col items-center justify-center relative">
                    <div className="absolute top-4 left-4 text-xs font-bold uppercase tracking-widest text-zinc-600">
                        Live Preview
                    </div>

                    <div className="w-full max-w-md pointer-events-none select-none transform scale-100 origin-top">
                        <NewsCard
                            title={title || "Post Title Preview"}
                            excerpt={content || "Your content will appear here..."}
                            date={today}
                            category={category}
                            imageUrl={category === 'Promotions' ? 'placeholder' : undefined}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}
