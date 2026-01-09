import React from "react";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
    return (
        <div className="flex flex-col items-center text-center p-8 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg hover:shadow-lg dark:hover:border-zinc-700 transition-all duration-300 group">
            <div className="mb-6">
                <Icon size={40} className="text-zinc-600 dark:text-zinc-400" />
            </div>
            <h3 className="text-xl font-heading uppercase tracking-wide mb-3 text-zinc-900 dark:text-white">
                {title}
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-sm">
                {description}
            </p>
        </div>
    );
}
