"use client";

import { motion } from "framer-motion";
import { Zap, Shield, Target, Users, Award, Flame } from "lucide-react";

const programs = [
    {
        title: "Traditional Shito-Ryu",
        description: "Master the foundational kata and bunkai of the Shinbukan lineage.",
        icon: Shield,
        size: "md:col-span-2 md:row-span-2",
        color: "bg-primary/10",
        image: "https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=800&auto=format&fit=crop"
    },
    {
        title: "Elite Kumite",
        description: "Advanced sparring techniques for competition and self-defense.",
        icon: Flame,
        size: "md:col-span-1 md:row-span-1",
        color: "bg-orange-500/10",
    },
    {
        title: "Junior Dragons",
        description: "Building confidence and discipline in the next generation.",
        icon: Users,
        size: "md:col-span-1 md:row-span-2",
        color: "bg-blue-500/10",
    },
    {
        title: "Kobudo Martial Arts",
        description: "Traditional Okinawan weapon training.",
        icon: Target,
        size: "md:col-span-1 md:row-span-1",
        color: "bg-emerald-500/10",
    },
    {
        title: "Black Belt Excellence",
        description: "The path to mastery and leadership.",
        icon: Award,
        size: "md:col-span-1 md:row-span-1",
        color: "bg-purple-500/10",
    }
];

export function ProgramBento() {
    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="max-w-2xl">
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-primary font-heading font-bold uppercase tracking-[0.3em] text-sm mb-4 block"
                        >
                            Our Programs
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-heading font-black uppercase tracking-tight text-foreground leading-[0.9]"
                        >
                            Forging Excellence <br />
                            Across All <span className="text-primary italic">Disciplines</span>
                        </motion.h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-full md:h-[600px]">
                    {programs.map((program, index) => (
                        <motion.div
                            key={program.title}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`group relative overflow-hidden rounded-xl border border-border flex flex-col p-8 transition-all duration-500 hover:shadow-2xl hover:border-primary/50 ${program.size} ${program.color}`}
                        >
                            <div className="relative z-10 h-full flex flex-col">
                                <program.icon className="w-10 h-10 text-primary mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12" />
                                <h3 className="text-2xl font-heading font-bold uppercase mb-3 text-foreground group-hover:text-primary transition-colors">
                                    {program.title}
                                </h3>
                                <p className="text-muted-foreground text-sm leading-relaxed max-w-[250px]">
                                    {program.description}
                                </p>

                                <div className="mt-auto pt-8">
                                    <button className="text-xs font-black uppercase tracking-widest text-foreground/40 group-hover:text-primary flex items-center gap-2 transition-colors">
                                        Explore Program <Zap size={12} />
                                    </button>
                                </div>
                            </div>

                            {/* Decorative background element or image */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-colors duration-500"></div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
