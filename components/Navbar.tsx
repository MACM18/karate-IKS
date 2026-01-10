"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Shield } from "lucide-react";
import { usePathname } from "next/navigation";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { UserAccountProfile } from "./UserAccountProfile";

export function Navbar() {
    const { data: session, status } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();
    const isDarkHeroPage = ["/about", "/programs"].includes(pathname);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "About", href: "/about" },
        { name: "Programs", href: "/programs" },
        { name: "Gallery", href: "/gallery" },
        { name: "News", href: "/news" },
    ];

    // Don't show login if already authenticated
    if (!session) {
        navLinks.push({ name: "Login", href: "/login" });
    }

    const isActive = (path: string) => pathname === path;

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                ? "frosted-glass py-3 shadow-lg"
                : "bg-transparent py-6"
                }`}
        >
            <div className="container mx-auto px-4 lg:px-8 flex justify-between items-center">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2 group"
                >
                    <div className="bg-primary p-1.5 rounded-sm skew-x-[-10deg] group-hover:rotate-12 transition-transform duration-300">
                        <Shield size={24} className="text-white skew-x-[10deg]" />
                    </div>
                    <span className={`text-2xl font-heading font-black uppercase tracking-tighter ${scrolled || !isDarkHeroPage ? "text-foreground" : "text-white"}`}>
                        Karate <span className="text-primary italic">IKS</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-10">
                    <div className="flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`text-sm font-bold uppercase tracking-widest transition-all duration-300 relative group ${isActive(link.href)
                                    ? "text-primary"
                                    : scrolled || !isDarkHeroPage
                                        ? "text-foreground/70 hover:text-foreground"
                                        : "text-white/90 hover:text-white"
                                    }`}
                            >
                                {link.name}
                                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full ${isActive(link.href) ? "w-full" : ""}`}></span>
                            </Link>
                        ))}
                    </div>

                    <div className="h-6 w-px bg-border mx-2"></div>

                    <div className="flex items-center gap-4">
                        <ThemeSwitcher />

                        {session ? (
                            <UserAccountProfile
                                user={session.user as any}
                                rank={null} // We'll need a better way to fetch rank client-side if needed, for now null
                            />
                        ) : (
                            <Link
                                href="/join"
                                className="px-6 py-2.5 bg-primary text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-red-700 transition-all duration-300 skew-x-[-12deg] shadow-[4px_4px_0px_0px_rgba(220,38,38,0.3)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                            >
                                <span className="skew-x-[12deg] inline-block">Join Dojo</span>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="flex items-center gap-4 md:hidden">
                    <ThemeSwitcher />
                    <button
                        className={`p-2 ${scrolled || !isDarkHeroPage ? "text-foreground" : "text-white"}`}
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="absolute top-full left-0 right-0 bg-background border-b border-border md:hidden overflow-hidden"
                    >
                        <div className="flex flex-col p-6 gap-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`py-4 text-center text-lg font-heading uppercase tracking-widest border-b border-border/50 last:border-none transition-colors ${isActive(link.href) ? "text-primary" : "text-foreground/70"
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            {!session && (
                                <Link
                                    href="/join"
                                    onClick={() => setIsOpen(false)}
                                    className="mt-4 py-5 bg-primary text-white text-center text-sm font-black uppercase tracking-widest hover:bg-red-700 rounded-sm"
                                >
                                    Enter the Dojo
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

