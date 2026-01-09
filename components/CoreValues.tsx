import { FeatureCard } from "./FeatureCard";
import { Shield, Users, Heart } from "lucide-react";

export function CoreValues() {
    return (
        <section className="py-24 bg-zinc-50 dark:bg-black">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Our Values</h2>
                    <h3 className="text-4xl md:text-5xl font-heading uppercase text-zinc-900 dark:text-white mt-2">Why Train With Us?</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={Heart}
                        title="Discipline"
                        description="Cultivating focus, respect, and perseverance, both in the dojo and in daily life."
                    />
                    <FeatureCard
                        icon={Users}
                        title="Community"
                        description="Join a supportive and encouraging family of martial artists dedicated to mutual growth."
                    />
                    <FeatureCard
                        icon={Shield}
                        title="Self-Defense"
                        description="Learn practical, effective techniques to protect yourself and build confidence."
                    />
                </div>
            </div>
        </section>
    );
}
