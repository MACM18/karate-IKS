import React from "react";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
    return (
        <div className="flex flex-col items-center text-center p-8 border border-zinc-900 bg-zinc-950/50 rounded-lg hover:border-action/50 hover:bg-zinc-900 transition-all duration-300 group">
            <div className="mb-6 p-4 rounded-full bg-zinc-900 text-zinc-400 group-hover:text-action group-hover:bg-zinc-800 transition-colors">
                <Icon size={32} />
            </div>
            <h3 className="text-xl font-heading uppercase tracking-wide mb-3 text-white">
                {title}
            </h3>
            <p className="text-zinc-500 leading-relaxed max-w-sm">
                {description}
            </p>
        </div>
    );
}
