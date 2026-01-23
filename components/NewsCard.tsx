import { Calendar, Tag, ArrowRight } from "lucide-react";
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
        <div className="group bg-muted/20 border border-border rounded-sm overflow-hidden hover:border-primary/30 transition-all duration-500 flex flex-col h-full shadow-sm hover:shadow-xl">
            {imageUrl && imageUrl !== "placeholder" ? (
                <div className="h-48 relative overflow-hidden">
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    />
                </div>
            ) : (
                <div className="h-[4px] bg-primary w-0 group-hover:w-full transition-all duration-500" />
            )}

            <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center gap-4 mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded-sm">
                        {category}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                        <Calendar size={12} /> {date}
                    </span>
                </div>

                <h3 className="text-2xl font-heading font-bold uppercase text-foreground mb-4 leading-tight group-hover:text-primary transition-colors">
                    {title}
                </h3>

                <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-1 line-clamp-3">
                    {excerpt}
                </p>

                <button className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground group-hover:text-primary flex items-center gap-2 transition-all">
                    Read Report <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}

