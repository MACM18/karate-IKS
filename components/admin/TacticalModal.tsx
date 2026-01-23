"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle } from "lucide-react";

interface TacticalModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    severity?: "info" | "warning" | "danger";
}

export function TacticalModal({ isOpen, onClose, title, children, severity = "info" }: TacticalModalProps) {
    const borderColor = {
        info: "border-zinc-800",
        warning: "border-yellow-500/50",
        danger: "border-primary/50",
    }[severity];

    const titleColor = {
        info: "text-white",
        warning: "text-yellow-500",
        danger: "text-primary",
    }[severity];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className={`relative w-full max-w-lg bg-zinc-950 border ${borderColor} shadow-2xl p-8 overflow-hidden`}
                    >
                        {/* Tactical Background Elements */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 -mr-12 -mt-12 rotate-45 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 -ml-12 -mb-12 rotate-45 pointer-events-none" />

                        <div className="relative z-10">
                            <header className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 bg-black border ${borderColor}`}>
                                        <AlertCircle size={18} className={titleColor} />
                                    </div>
                                    <h3 className={`text-xl font-heading font-black uppercase tracking-tighter ${titleColor}`}>
                                        {title}
                                    </h3>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 text-zinc-600 hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </header>

                            <div className="space-y-6">
                                {children}
                            </div>
                        </div>

                        {/* Corner Accents */}
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary" />
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary" />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
