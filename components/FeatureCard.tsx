import React from "react";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
    return (
        <div className="flex flex-col items-center text-center p-8 border border-border bg-background rounded-lg hover:shadow-lg dark:hover:border-zinc-700 transition-all duration-300 group">
            <div className="mb-6">
                <Icon size={40} className="text-foreground-muted" />
            </div>
            <h3 className="text-xl font-heading uppercase tracking-wide mb-3 text-foreground">
                {title}
            </h3>
            <p className="text-foreground-muted leading-relaxed max-w-sm">
                {description}
            </p>
        </div>
    );
}
