"use client";

import { MultiStepForm } from "@/components/MultiStepForm";
import { motion } from "framer-motion";
import Image from "next/image";

interface JoinContentProps {
    schedules: any[];
}

export default function JoinContent({ schedules }: JoinContentProps) {
    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Join Hero */}
            <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-black/70 z-10" />
                    <Image
                        src="https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=2000&auto=format&fit=crop"
                        alt="Dojo Entrance"
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
                            Start Your Journey
                        </span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-heading font-black uppercase text-white leading-none tracking-tighter"
                    >
                        Join the <span className="text-primary italic">Dojo</span>
                    </motion.h1>
                </div>
            </section>

            <div className="container mx-auto px-4 lg:px-8 -mt-16 relative z-30">
                <motion.main
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="max-w-3xl mx-auto"
                >
                    <div className="bg-background border border-border shadow-2xl p-2 md:p-8">
                        <div className="mb-10 text-center px-6">
                            <p className="text-muted-foreground text-sm leading-relaxed italic border-l-2 border-primary pl-4 inline-block text-left">
                                "The ultimate aim of the art of Karate lies not in victory or defeat, but in the perfection of the character of its participants."
                            </p>
                        </div>
                        <MultiStepForm initialSchedules={schedules} />
                    </div>
                </motion.main>
            </div>
        </div>
    );
}
