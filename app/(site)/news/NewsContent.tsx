"use client";

import { motion } from "framer-motion";
import { NewsCard } from "@/components/NewsCard";
import { Trophy, Medal, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface NewsContentProps {
    initialNews: any[];
    initialAchievements: any[];
}

export default function NewsContent({ initialNews, initialAchievements }: NewsContentProps) {
    const iconMap: Record<string, any> = {
        "Tournament": Medal,
        "Milestone": Star,
        "Default": Trophy
    };

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Feed Hero */}
            <section className="relative h-[40vh] min-h-[300px] flex items-center overflow-hidden border-b border-border">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-background/80 z-10" />
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                </div>

                <div className="container mx-auto px-4 lg:px-8 relative z-20">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 mb-4"
                    >
                        <span className="h-px w-8 bg-primary"></span>
                        <span className="text-primary font-heading font-bold uppercase tracking-[0.3em] text-xs">
                            Dojo Feed
                        </span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-heading font-black uppercase text-foreground leading-none tracking-tighter"
                    >
                        News & <span className="text-primary italic">Updates</span>
                    </motion.h1>
                </div>
            </section>

            <div className="container mx-auto px-4 lg:px-8 mt-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Main Feed */}
                    <div className="lg:col-span-2 space-y-12">
                        {initialNews.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {initialNews.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        <NewsCard {...item} />
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 border border-dashed border-border text-center">
                                <p className="text-muted-foreground font-medium italic">No recent transmissions from the front lines.</p>
                            </div>
                        )}
                    </div>

                    {/* Wall of Fame (Sidebar) */}
                    <aside className="space-y-8">
                        <div className="bg-muted/20 border border-border p-8 sticky top-24">
                            <div className="flex items-center gap-3 mb-8">
                                <Trophy className="text-primary" size={24} />
                                <h2 className="text-xl font-heading font-black uppercase text-foreground tracking-widest">
                                    Wall of Fame
                                </h2>
                            </div>

                            <div className="space-y-8">
                                {initialAchievements.length > 0 ? (
                                    initialAchievements.map((student, i) => {
                                        const Icon = iconMap[student.achievement] || iconMap["Default"];
                                        return (
                                            <div key={i} className="group cursor-pointer">
                                                <div className="flex items-center gap-4 mb-3">
                                                    <div className="w-12 h-12 bg-primary/10 rounded-sm flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                                        <Icon size={20} />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                                                            {student.name}
                                                        </h3>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary mt-1">
                                                            {student.achievement}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="text-[10px] text-muted-foreground uppercase font-bold pl-16">
                                                    {student.sub}
                                                </p>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-xs text-muted-foreground italic">Waiting for the next legend to rise...</p>
                                )}

                                <Link href="/gallery" className="block w-full text-center py-4 mt-4 border border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-foreground hover:text-background transition-all duration-300">
                                    View Full Gallery
                                </Link>
                            </div>
                        </div>

                        {/* Dojo Newsletter Sidebar Box */}
                        <div className="bg-primary p-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-20 font-heading text-6xl rotate-12 pointer-events-none">
                                傳
                            </div>
                            <h3 className="text-xl font-heading font-black uppercase mb-2">The Shinbukan Way</h3>
                            <p className="text-xs font-bold uppercase tracking-wide opacity-80 mb-6 italic">Weekly Insights into Budo</p>
                            <div className="flex flex-col gap-2">
                                <input
                                    type="email"
                                    placeholder="Sensei@Dojo.com"
                                    className="bg-white/10 border border-white/20 p-3 text-xs focus:outline-none focus:bg-white/20 placeholder:text-white/40"
                                />
                                <button className="bg-white text-primary py-3 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}


