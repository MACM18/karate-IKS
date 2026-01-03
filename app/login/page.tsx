"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Shield, ArrowRight, Lock } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [role, setRole] = useState<"student" | "admin">("student");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate network delay
        setTimeout(() => {
            if (role === "admin") {
                router.push("/admin/dashboard");
            } else {
                router.push("/student/dashboard");
            }
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[url('/hero-bg.png')] bg-cover bg-center opacity-20 filter blur-sm"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>

            <div className="relative z-10 w-full max-w-md bg-zinc-950 border border-zinc-900 rounded-lg p-8 shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-heading uppercase tracking-widest text-white mb-2">Welcome Back</h1>
                    <p className="text-zinc-500 text-sm">Enter the dojo.</p>
                </div>

                {/* Role Toggle */}
                <div className="flex bg-zinc-900 p-1 rounded-lg mb-8">
                    <button
                        onClick={() => setRole("student")}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded text-sm font-bold uppercase tracking-widest transition-all
                ${role === "student" ? "bg-zinc-800 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"}`}
                    >
                        <User size={16} /> Student
                    </button>
                    <button
                        onClick={() => setRole("admin")}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded text-sm font-bold uppercase tracking-widest transition-all
                ${role === "admin" ? "bg-action text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"}`}
                    >
                        <Shield size={16} /> Sensei
                    </button>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs uppercase font-bold tracking-widest text-zinc-500 mb-2">Email</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                            <input
                                type="email"
                                placeholder={role === "student" ? "student@example.com" : "sensei@karate-iks.com"}
                                className="w-full bg-black border border-zinc-800 rounded py-3 pl-10 pr-4 text-white focus:outline-none focus:border-zinc-600 transition-colors"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs uppercase font-bold tracking-widest text-zinc-500 mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full bg-black border border-zinc-800 rounded py-3 pl-10 pr-4 text-white focus:outline-none focus:border-zinc-600 transition-colors"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-4 rounded font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all mt-6
                ${role === "admin"
                                ? "bg-action hover:bg-red-700 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)]"
                                : "bg-white hover:bg-zinc-200 text-black shadow-[0_0_20px_rgba(255,255,255,0.1)]"}
                ${isLoading ? "opacity-70 cursor-not-allowed" : ""}
                `}
                    >
                        {isLoading ? (
                            "Bowing in..."
                        ) : (
                            <>
                                Enter Dojo <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-zinc-600 text-sm">
                        Not a member yet? <Link href="/join" className="text-white hover:underline">Apply to Join</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
