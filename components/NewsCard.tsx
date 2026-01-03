import { Calendar, Tag } from "lucide-react";
import Image from "next/image";

interface NewsCardProps {
    title: string;
    excerpt: string;
    date: string;
    category: string;
    imageUrl?: string;
}

export function NewsCard({ title, excerpt, date, category, imageUrl }: NewsCardProps) {
    return (
        <div className="group bg-zinc-950 border border-zinc-900 rounded-lg overflow-hidden hover:border-zinc-700 transition-colors flex flex-col h-full">
            {imageUrl ? (
                <div className="h-48 bg-zinc-900 relative">
                    {/* Use Next.js Image in production, mocking for now */}
                    <div className="w-full h-full flex items-center justify-center text-zinc-700 bg-zinc-800">
                        [Image: {category}]
                    </div>
                </div>
            ) : (
                <div className="h-2 bg-action" />
            )}

            <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-3 text-xs uppercase tracking-widest text-zinc-500">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {date}</span>
                    <span className="w-1 h-1 bg-zinc-700 rounded-full" />
                    <span className="flex items-center gap-1 text-action"><Tag size={12} /> {category}</span>
                </div>

                <h3 className="text-xl font-heading uppercase text-white mb-3 group-hover:text-action transition-colors">
                    {title}
                </h3>

                <p className="text-zinc-400 text-sm leading-relaxed mb-6 flex-1">
                    {excerpt}
                </p>

                <button className="text-xs font-bold uppercase tracking-widest text-white hover:text-action transition-colors text-left">
                    Read More &rarr;
                </button>
            </div>
        </div>
    );
}
