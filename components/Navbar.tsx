"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

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
        { name: "About", href: "/about" },
        { name: "Programs", href: "/programs" },
        { name: "News", href: "/news" },
        { name: "Login", href: "/login" },
    ];

    const isActive = (path: string) => pathname === path;

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${scrolled ? "bg-black/90 backdrop-blur-md border-zinc-800 py-4" : "bg-transparent border-transparent py-6"
            }`}>
            <div className="container mx-auto px-4 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="text-2xl font-heading font-black uppercase tracking-tighter text-white">
                    Karate IKS
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`text-sm font-bold uppercase tracking-widest transition-colors ${isActive(link.href) ? "text-white" : "text-zinc-400 hover:text-white"
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        href="/join"
                        className="px-6 py-2 bg-action text-white text-sm font-bold uppercase tracking-widest hover:bg-red-700 transition-colors skew-x-[-10deg]"
                    >
                        <span className="skew-x-[10deg] inline-block">Join Now</span>
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Nav Overlay */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 bg-black border-b border-zinc-900 md:hidden flex flex-col p-4 animate-in slide-in-from-top-4">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="py-4 text-center text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-white border-b border-zinc-900 last:border-none"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        href="/join"
                        onClick={() => setIsOpen(false)}
                        className="mt-4 py-4 bg-action text-white text-center text-sm font-bold uppercase tracking-widest hover:bg-red-700"
                    >
                        Join Now
                    </Link>
                </div>
            )}
        </nav>
    );
}
