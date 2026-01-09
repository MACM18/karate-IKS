"use client";

import { motion } from "framer-motion";
import { Shield, BookOpen, Users, Award, ChevronRight } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
    const dojoKun = [
        "Seek Perfection of Character",
        "Be Faithful",
        "Endeavor",
        "Respect Others",
        "Refrain From Violent Behavior"
    ];

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Heritage Hero */}
            <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-black/60 z-10" />
                    <Image
                        src="https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=2000&auto=format&fit=crop"
                        alt="Traditional Dojo"
                        fill
                        className="object-cover grayscale"
                    />
                </div>

                <div className="container mx-auto px-4 relative z-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block py-1 px-3 border border-primary/50 bg-primary/10 rounded-sm mb-6"
                    >
                        <span className="text-primary font-heading font-bold uppercase tracking-[0.3em] text-xs">
                            Est. 1988
                        </span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-heading font-black uppercase text-white leading-none tracking-tighter"
                    >
                        The Path of <br />
                        <span className="text-primary italic">Tradition</span>
                    </motion.h1>
                </div>
            </section>

            <div className="container mx-auto px-4 lg:px-8 -mt-20 relative z-30">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Stats/Quick Glance */}
                    {[
                        { icon: Shield, label: "Lineage", val: "Shinbukan" },
                        { icon: BookOpen, label: "Curriculum", val: "Traditional" },
                        { icon: Award, label: "Affiliation", val: "Global" },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            className="bg-background border border-border p-8 shadow-2xl flex items-center gap-6"
                        >
                            <div className="bg-primary/10 p-4 rounded-sm rotate-3">
                                <item.icon className="text-primary w-8 h-8 -rotate-3" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{item.label}</p>
                                <h3 className="text-xl font-heading font-bold uppercase text-foreground">{item.val}</h3>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Content Sections */}
                <div className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Story Side */}
                    <div className="space-y-12">
                        <section>
                            <h2 className="text-3xl font-heading font-black uppercase tracking-tight text-foreground mb-6 flex items-center gap-4">
                                <span className="h-px w-8 bg-primary"></span>
                                Our Legacy
                            </h2>
                            <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
                                <p>
                                    Tracing our roots back to the traditional masters of Shito-Ryu, we preserve the authenticity and spirit of the art under the <span className="text-foreground font-bold italic text-primary">Karate Do Shito-Ryu Shinbukan Association</span>.
                                </p>
                                <p>
                                    Founded on the principles of discipline, respect, and technical excellence, our dojo serves as a bridge between ancient Okinawan traditions and modern martial science.
                                </p>
                            </div>
                        </section>

                        <section className="bg-primary/5 border-l-4 border-primary p-12 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10 font-heading text-9xl text-primary pointer-events-none select-none">
                                空手
                            </div>
                            <h2 className="text-2xl font-heading font-black uppercase tracking-widest text-foreground mb-10">Dojo Kun</h2>
                            <ul className="space-y-6">
                                {dojoKun.map((line, i) => (
                                    <motion.li
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-start gap-4"
                                    >
                                        <span className="text-primary font-heading font-black text-xl leading-none">0{i + 1}.</span>
                                        <span className="text-foreground font-bold uppercase tracking-wide text-sm md:text-base leading-tight">
                                            {line}
                                        </span>
                                    </motion.li>
                                ))}
                            </ul>
                        </section>
                    </div>

                    {/* Master Side */}
                    <div className="space-y-12">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="relative aspect-[3/4] bg-muted/30 border border-border group overflow-hidden"
                        >
                            <Image
                                src="/images/hero_silhouette.png" // Reusing silhouette or specific master image
                                alt="Chief Instructor"
                                fill
                                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                            />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background to-transparent p-12">
                                <h3 className="text-4xl font-heading font-black uppercase text-foreground leading-none">Kyoshi Miyagi</h3>
                                <p className="text-primary font-heading font-bold uppercase tracking-widest text-xs mt-2">Chief Instructor • 8th Dan</p>
                            </div>
                        </motion.div>

                        <section className="space-y-6">
                            <h2 className="text-3xl font-heading font-black uppercase tracking-tight text-foreground mb-6 flex items-center gap-4">
                                <span className="h-px w-8 bg-primary"></span>
                                The Master's Path
                            </h2>
                            <p className="text-muted-foreground leading-relaxed italic border-l-2 border-border pl-6">
                                "Karate is not about defeating others. It is about defeating the weaknesses within yourself. The journey never ends; it only deepens."
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                Kyoshi Miyagi has dedicated over 40 years to the study and teaching of Shito-Ryu. His approach balances the lethal efficiency of traditional bunkai with the character-building essence of Budo.
                            </p>
                        </section>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 bg-zinc-900/5 dark:bg-zinc-900/50 border border-border">
                                <h4 className="font-heading font-bold uppercase text-primary text-xs mb-2">Certification</h4>
                                <p className="text-[10px] font-bold uppercase text-muted-foreground">Certified by Grandmaster Shinbukan International</p>
                            </div>
                            <div className="p-6 bg-zinc-900/5 dark:bg-zinc-900/50 border border-border">
                                <h4 className="font-heading font-bold uppercase text-primary text-xs mb-2">Experience</h4>
                                <p className="text-[10px] font-bold uppercase text-muted-foreground">40+ Years of Traditional Instruction</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

