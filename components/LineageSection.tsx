"use client";

import { motion } from "framer-motion";
import { History, Globe, Shield } from "lucide-react";

export function LineageSection() {
    return (
        <section className="py-24 bg-zinc-50 dark:bg-zinc-900 border-y border-border overflow-hidden relative">
            {/* Decorative background text */}
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center opacity-[0.02] pointer-events-none select-none overflow-hidden">
                <span className="text-[20rem] font-heading font-black uppercase whitespace-nowrap">SHINBUKAN</span>
            </div>

            <div className="container mx-auto px-4 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-primary font-heading font-bold uppercase tracking-[0.3em] text-sm mb-4 block">Our Heritage</span>
                        <h2 className="text-4xl md:text-5xl font-heading font-black uppercase text-foreground mb-8 leading-tight">
                            The Legacy of <br />
                            <span className="text-primary italic">Shito-Ryu Shinbukan</span>
                        </h2>

                        <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
                            <p>
                                Founded on the principles of discipline, respect, and technical precision, our association traces its lineage back to the grandmasters of Okinawa.
                            </p>
                            <p>
                                We represent the Shito-Ryu Shinbukan Karate-Do Association, dedicated to preserving the traditional forms (Kata) and practical applications (Bunkai) that have been passed down through generations.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12">
                            <div className="flex flex-col gap-2">
                                <History className="text-primary w-8 h-8" />
                                <p className="font-heading font-bold uppercase text-xs tracking-widest text-foreground">Established</p>
                                <p className="text-2xl font-black text-foreground">1988</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Globe className="text-primary w-8 h-8" />
                                <p className="font-heading font-bold uppercase text-xs tracking-widest text-foreground">Global Dojos</p>
                                <p className="text-2xl font-black text-foreground">150+</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Shield className="text-primary w-8 h-8" />
                                <p className="font-heading font-bold uppercase text-xs tracking-widest text-foreground">Certifications</p>
                                <p className="text-2xl font-black text-foreground">IKSA</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="aspect-[4/5] relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 dark:border-black/10">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                            <img
                                src="https://images.unsplash.com/photo-1552072805-2a9039d00e57?q=80&w=800&auto=format&fit=crop"
                                alt="Karate Tradition"
                                className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-1000"
                            />
                            <div className="absolute bottom-8 left-8 z-20">
                                <p className="text-white font-heading font-bold uppercase tracking-widest text-sm mb-1 opacity-80 italic">The Path of the Master</p>
                                <h3 className="text-white text-3xl font-heading font-black uppercase">Traditional Training</h3>
                            </div>
                        </div>

                        {/* Decorative floating element */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-[80px] -z-10"></div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
