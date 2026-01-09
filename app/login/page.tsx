"use client";

import { useActionState, useState } from "react";
import { authenticate } from "@/app/lib/actions";
import { User, Shield, ArrowRight, Lock } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
    const [errorMessage, dispatch] = useActionState(authenticate, undefined);
    const [role, setRole] = useState<"student" | "admin">("student");

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/60 z-10" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 z-10" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-md frosted-glass border border-border p-10 shadow-2xl"
            >
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="inline-flex p-4 bg-primary/10 rounded-sm mb-6"
                    >
                        <Shield className="text-primary w-8 h-8" />
                    </motion.div>
                    <h1 className="text-4xl font-heading font-black uppercase tracking-tight text-foreground mb-2 leading-none">
                        Enter the <span className="text-primary italic">Dojo</span>
                    </h1>
                    <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.4em]">Auth Required</p>
                </div>

                {/* Role Toggle */}
                <div className="flex bg-muted/30 p-1 rounded-sm mb-8 border border-border">
                    <button
                        type="button"
                        onClick={() => setRole("student")}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all
                        ${role === "student" ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-foreground"}`}
                    >
                        <User size={14} /> Student
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole("admin")}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all
                        ${role === "admin" ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-foreground"}`}
                    >
                        <Shield size={14} /> Sensei
                    </button>
                </div>

                <form action={dispatch} className="space-y-6">
                    <div>
                        <label className="block text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-3">Gateway Address</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                name="email"
                                type="email"
                                placeholder={role === "student" ? "STUDENT@IKS.COM" : "SENSEI@IKS.COM"}
                                defaultValue={role === "student" ? "student@example.com" : "sensei@karate-iks.com"}
                                className="w-full bg-background border border-border rounded-sm py-4 pl-12 pr-4 text-foreground text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/30 font-bold"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-3">Security Key</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                defaultValue="123456"
                                className="w-full bg-background border border-border rounded-sm py-4 pl-12 pr-4 text-foreground text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/30 font-bold"
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    <div className="py-2 h-6">
                        {errorMessage && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-primary text-[10px] font-bold uppercase tracking-widest text-center"
                            >
                                {errorMessage}
                            </motion.p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-5 bg-primary hover:bg-red-700 text-white font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-[0_10px_20px_rgba(220,38,38,0.2)]"
                    >
                        Validate Access <ArrowRight size={18} />
                    </button>
                </form>

                <div className="mt-10 text-center border-t border-border pt-8">
                    <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                        Not authorized yet? <Link href="/join" className="text-primary hover:text-red-700 transition-colors">Apply for Membership</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

