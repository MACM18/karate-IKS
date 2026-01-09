"use client";

import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FormOverlayProps {
    title: string;
    triggerLabel?: string;
    children: React.ReactNode;
}

export function FormOverlay({ title, triggerLabel, children }: FormOverlayProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Floating Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-10 right-10 z-40 bg-primary text-white p-5 rounded-full shadow-[0_20px_50px_rgba(220,38,38,0.3)] hover:scale-110 hover:bg-red-700 transition-all group flex items-center gap-3"
            >
                <Plus size={24} className="group-hover:rotate-90 transition-transform duration-500" />
                {triggerLabel && (
                    <span className="font-black uppercase tracking-[0.2em] text-[10px] pr-2">{triggerLabel}</span>
                )}
            </button>

            {/* Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 md:p-20"
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-10 right-10 text-zinc-500 hover:text-white transition-colors p-4 group"
                        >
                            <X size={40} className="group-hover:rotate-180 transition-transform duration-500" />
                        </button>

                        <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar">
                            <div className="mb-12">
                                <div className="flex items-center gap-4 text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-4">
                                    <div className="w-12 h-px bg-primary" />
                                    Deployment Interface
                                </div>
                                <h2 className="text-6xl font-heading font-black uppercase tracking-tighter text-white">
                                    {title.split(' ')[0]} <span className="text-primary italic">{title.split(' ').slice(1).join(' ')}</span>
                                </h2>
                            </div>

                            <div className="bg-zinc-900/50 border border-zinc-800 p-8 md:p-12">
                                {React.Children.map(children, child => {
                                    if (React.isValidElement(child)) {
                                        // Pass closeModal to the child if it's a form that might want to close after success
                                        return React.cloneElement(child as any, { onSuccess: () => setIsOpen(false) });
                                    }
                                    return child;
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
