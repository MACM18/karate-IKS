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
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${scrolled ? "bg-background/90 backdrop-blur-md border-border py-4" : "bg-transparent border-transparent py-6"
            }`}>
            <div className="container mx-auto px-4 flex justify-between items-center">
                <Link href="/" className="text-2xl font-heading font-black uppercase tracking-tighter text-foreground">
                    Karate IKS
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`text-sm font-bold uppercase tracking-widest transition-colors ${isActive(link.href) ? "text-foreground" : "text-foreground-muted hover:text-foreground"
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        href="/login"
                        className="text-sm font-bold uppercase tracking-widest text-foreground-muted hover:text-foreground"
                    >
                        Login
                    </Link>
                    <Link
                        href="/join"
                        className="px-6 py-2 bg-button-inverted-bg text-button-inverted-text text-sm font-bold uppercase tracking-widest hover:bg-button-inverted-bg-hover transition-colors"
                    >
                        Apply Now
                    </Link>
                    <ThemeSwitcher />
                </div>

                <button
                    className="md:hidden text-foreground"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 bg-background border-b border-border md:hidden flex flex-col p-4">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="py-4 text-center text-sm font-bold uppercase tracking-widest text-foreground-muted hover:text-foreground border-b border-border last:border-none"
                        >
                            {link.name}
                        </Link>
                    ))}
                     <Link
                        href="/login"
                        onClick={() => setIsOpen(false)}
                        className="py-4 text-center text-sm font-bold uppercase tracking-widest text-foreground-muted hover:text-foreground border-b border-border"
                    >
                        Login
                    </Link>
                    <Link
                        href="/join"
                        onClick={() => setIsOpen(false)}
                        className="mt-4 py-4 bg-button-inverted-bg text-button-inverted-text text-center text-sm font-bold uppercase tracking-widest"
                    >
                        Apply Now
                    </Link>
                </div>
            )}
        </nav>
    );
}
