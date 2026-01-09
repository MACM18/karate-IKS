"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Clock, Users, Shield } from "lucide-react";

interface ProgramModalProps {
    isOpen: boolean;
    onClose: () => void;
    program: {
        title: string;
        description: string;
        details?: string[];
        schedule?: string;
        ageGroup?: string;
        color: string;
    } | null;
}

export function ProgramModal({ isOpen, onClose, program }: ProgramModalProps) {
    if (!program) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-background/95 backdrop-blur-xl"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-4xl bg-muted/10 border border-border p-8 md:p-16 overflow-hidden max-h-[90vh] overflow-y-auto"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-8 right-8 text-muted-foreground hover:text-primary transition-colors"
                        >
                            <X size={32} />
                        </button>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div>
                                <div className={`inline-block py-1 px-3 border border-primary/50 ${program.color} rounded-sm mb-6`}>
                                    <span className="text-primary font-heading font-bold uppercase tracking-[0.3em] text-[10px]">Program Detail</span>
                                </div>
                                <h2 className="text-5xl md:text-6xl font-heading font-black uppercase text-foreground mb-6 leading-none tracking-tighter">
                                    {program.title.split(' ').map((word, i) => (
                                        <span key={i} className={i % 2 !== 0 ? "text-primary italic" : ""}>{word}{" "}</span>
                                    ))}
                                </h2>
                                <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                                    {program.description}
                                </p>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 text-foreground">
                                        <Clock className="text-primary" size={20} />
                                        <span className="font-bold uppercase tracking-widest text-xs">{program.schedule || "Mon/Wed/Fri — 6:00 PM"}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-foreground">
                                        <Users className="text-primary" size={20} />
                                        <span className="font-bold uppercase tracking-widest text-xs">{program.ageGroup || "All Ages Welcome"}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8 bg-muted/5 p-8 border border-border/50">
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                                    <Shield size={16} /> Key Objectives
                                </h3>
                                <ul className="space-y-4">
                                    {(program.details || [
                                        "Technical precision in traditional Shito-Ryu Kata.",
                                        "Practical application through Bunkai analysis.",
                                        "Development of mental focus and physical explosive power.",
                                        "Character building through the Dojo Kun tenets."
                                    ]).map((detail, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <CheckCircle2 className="text-primary mt-1 shrink-0" size={16} />
                                            <span className="text-sm text-foreground/80 font-medium leading-relaxed">{detail}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    className="w-full py-5 bg-primary text-white font-black uppercase tracking-widest text-xs hover:bg-red-700 transition-all shadow-xl shadow-primary/20"
                                >
                                    Book Introductory Class
                                </button>
                            </div>
                        </div>

                        {/* Traditional Accent */}
                        <div className="absolute bottom-0 right-0 p-12 opacity-5 font-heading text-[200px] text-primary leading-none pointer-events-none select-none">
                            空手
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
