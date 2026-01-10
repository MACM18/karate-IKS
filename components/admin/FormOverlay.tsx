"use client";

import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FormOverlayProps {
    title: string;
    triggerLabel?: string;
    children: React.ReactNode;
    open?: boolean;
    onClose?: () => void;
}

export function FormOverlay({ title, triggerLabel, children, open, onClose }: FormOverlayProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const isControlled = open !== undefined;
    const isOpen = isControlled ? open : internalOpen;

    const handleOpen = () => {
        if (isControlled) {
            // In controlled mode, opening usually happens via parent state change, 
            // but if we click the trigger button, we might want to signal parent?
            // For now, if controlled, we assume parent handles "open" via other means OR we add onOpen prop?
            // Actually, if triggerLabel is present, we expect the button to work.
            // If controlled, we can't easily force open without a callback.
            // But usually controlled modal doesn't use the built-in trigger button if it's purely controlled.
            // However, to keep hybrid support:
            if (onClose && !isOpen) {
                // This is weird. onOpen isn't standard.
                // Let's just set internal open? No.
                // Let's assume if 'open' is passed, the parent controls it fully.
                // So the internal button might be useless in controlled mode UNLESS we provide onOpenRequest.
                // For my use case (ProgramForm), I have an external button. 
                // So I will likely NOT use the internal trigger button in ProgramForm.
            }
        } else {
            setInternalOpen(true);
        }
    };

    const handleClose = () => {
        if (isControlled && onClose) {
            onClose();
        } else {
            setInternalOpen(false);
        }
    };

    return (
        <>
            {/* Floating Trigger Button - Only show if not controlled or checks pass? 
                Actually, ProgramForm passes triggerLabel='' to functionality hide it or I can act differently.
                If triggerLabel is hidden/empty, maybe don't render button?
            */}
            {triggerLabel !== undefined && (
                <button
                    onClick={() => isControlled ? (onClose ? onClose() : null) : setInternalOpen(true)}
                    // Wait, clicking trigger usually OPENS it. 
                    // In ProgramForm, I put triggerLabel='' but I essentially don't want this button.
                    // Let's change condition: if triggerLabel is provided (non-empty) OR purely uncontrolled?
                    className={`fixed bottom-10 right-10 z-40 bg-primary text-white px-8 py-5 shadow-[0_20px_50px_rgba(220,38,38,0.3)] hover:scale-110 hover:bg-red-700 transition-all group flex items-center justify-center gap-3 skew-x-[-8deg] ${!triggerLabel ? 'hidden' : ''}`}
                >
                    <div className="skew-x-[8deg] flex items-center gap-3">
                        <Plus size={24} className="group-hover:rotate-90 transition-transform duration-500" />
                        {triggerLabel && (
                            <span className="font-black uppercase tracking-[0.2em] text-[10px] pr-2">{triggerLabel}</span>
                        )}
                    </div>
                </button>
            )}

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
                            onClick={handleClose}
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
                                        return React.cloneElement(child as any, { onSuccess: () => handleClose() });
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
