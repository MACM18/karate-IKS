"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { ThemeSwitcher } from "./ThemeSwitcher";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Programs", href: "/programs" },
        { name: "Contact", href: "/contact" },
    ];

    const isActive = (path: string) => pathname === path;

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${scrolled ? "bg-white/90 dark:bg-black/90 backdrop-blur-md border-zinc-200 dark:border-zinc-800 py-4" : "bg-transparent border-transparent py-6"
            }`}>
            <div className="container mx-auto px-4 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="text-2xl font-heading font-black uppercase tracking-tighter">
                    Karate IKS
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`text-sm font-bold uppercase tracking-widest transition-colors ${isActive(link.href) ? "text-zinc-900 dark:text-white" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        href="/login"
                        className="text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                    >
                        Login
                    </Link>
                    <Link
                        href="/join"
                        className="px-6 py-2 bg-zinc-900 text-white dark:bg-white dark:text-black text-sm font-bold uppercase tracking-widest hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors"
                    >
                        Apply Now
                    </Link>
                    <ThemeSwitcher />
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Nav Overlay */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-800 md:hidden flex flex-col p-4">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="py-4 text-center text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border-b border-zinc-200 dark:border-zinc-800 last:border-none"
                        >
                            {link.name}
                        </Link>
                    ))}
                     <Link
                        href="/login"
                        onClick={() => setIsOpen(false)}
                        className="py-4 text-center text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border-b border-zinc-200 dark:border-zinc-800"
                    >
                        Login
                    </Link>
                    <Link
                        href="/join"
                        onClick={() => setIsOpen(false)}
                        className="mt-4 py-4 bg-zinc-900 text-white dark:bg-white dark:text-black text-center text-sm font-bold uppercase tracking-widest"
                    >
                        Apply Now
                    </Link>
                </div>
            )}
        </nav>
    );
}
