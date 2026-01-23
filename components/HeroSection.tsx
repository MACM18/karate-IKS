"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, ChevronRight } from "lucide-react";
import Image from "next/image";

export function HeroSection() {
    return (
        <section className="relative h-screen min-h-[700px] flex items-center overflow-hidden bg-background">
            {/* Background Texture/Pattern */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none z-0">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            </div>

            {/* Dramatic Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] z-0 animate-pulse"></div>

            <div className="container mx-auto px-4 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Content Side */}
                    <div className="text-left">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="flex items-center gap-3 mb-6"
                        >
                            <span className="h-px w-12 bg-primary"></span>
                            <span className="text-primary font-heading font-bold uppercase tracking-[0.3em] text-sm md:text-base">
                                Shito-Ryu Karate-Do
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-6xl md:text-8xl lg:text-9xl font-heading font-black uppercase leading-[0.9] tracking-tighter text-foreground mb-8"
                        >
                            <span className="block">POWER &</span>
                            <span className="block text-primary italic drop-shadow-[4px_4px_0px_var(--foreground)] dark:drop-shadow-[4px_4px_0px_#fff]">
                                TRADITION
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-lg md:text-xl text-muted-foreground max-w-xl mb-12 leading-relaxed"
                        >
                            Master the art of the Samurai. We don't just teach karate; we forge character, discipline, and unbreakable spirit in the heart of our Dojo.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="flex flex-wrap gap-6"
                        >
                            <Link
                                href="/join"
                                className="group relative px-8 py-4 bg-primary text-white font-black uppercase tracking-widest text-sm overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Start Your Path <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                                <motion.div
                                    className="absolute inset-0 bg-black/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                                />
                            </Link>

                            <Link
                                href="/about"
                                className="group px-8 py-4 border-2 border-foreground text-foreground font-black uppercase tracking-widest text-sm hover:bg-foreground hover:text-background transition-colors duration-300 flex items-center gap-2"
                            >
                                Our Heritage <Shield size={18} />
                            </Link>
                        </motion.div>
                    </div>

                    {/* Image Side */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="relative hidden lg:block"
                    >
                        <div className="relative z-10 w-full aspect-square max-w-[600px] ml-auto">
                            <Image
                                src="/images/hero_silhouette.png"
                                alt="Karate Master Silhouette"
                                fill
                                className="object-cover rounded-2xl shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
                                priority
                            />
                            {/* Decorative Elements */}
                            <div className="absolute -top-6 -right-6 w-32 h-32 border-t-4 border-r-4 border-primary opacity-50"></div>
                            <div className="absolute -bottom-6 -left-6 w-32 h-32 border-b-4 border-l-4 border-primary opacity-50"></div>
                        </div>

                        {/* Floating Badge */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -bottom-10 -right-4 bg-background border border-border p-6 shadow-2xl rounded-sm z-20 max-w-[200px]"
                        >
                            <p className="text-primary font-heading font-black text-3xl leading-none mb-1">25+</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Years of Excellence in Shito-Ryu tradition</p>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground">Descend</span>
                <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent"></div>
            </motion.div>
        </section>
    );
}

