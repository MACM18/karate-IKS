"use client";

import { FileText, Lock, PlayCircle } from "lucide-react";

interface ResourceCardProps {
    title: string;
    type: "video" | "pdf";
    description: string;
    isLocked: boolean;
    requiredRank?: string;
}

export function ResourceCard({ title, type, description, isLocked, requiredRank }: ResourceCardProps) {
    return (
        <div className={`p-6 border rounded-lg transition-all duration-300 flex flex-col h-full relative overflow-hidden group
        ${isLocked
                ? 'bg-zinc-950 border-zinc-900 opacity-70'
                : 'bg-zinc-900 border-zinc-800 hover:border-zinc-600 cursor-pointer'
            }`}
        >
            {isLocked && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center z-10">
                    <div className="flex flex-col items-center gap-2 text-zinc-500">
                        <Lock size={24} />
                        <span className="text-xs uppercase tracking-widest font-bold">Requires {requiredRank}</span>
                    </div>
                </div>
            )}

            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-full ${isLocked ? 'bg-zinc-900 text-zinc-700' : 'bg-zinc-800 text-white group-hover:text-action'}`}>
                    {type === 'video' ? <PlayCircle size={24} /> : <FileText size={24} />}
                </div>
                {!isLocked && type === 'video' && (
                    <span className="text-xs font-bold uppercase tracking-widest text-action bg-action/10 px-2 py-1 rounded">
                        Watch Now
                    </span>
                )}
            </div>

            <h3 className={`text-lg font-heading uppercase mb-2 ${isLocked ? 'text-zinc-500' : 'text-white'}`}>
                {title}
            </h3>

            <p className="text-sm text-zinc-500 leading-relaxed flex-1">
                {description}
            </p>
        </div>
    );
}
