import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-zinc-100 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 py-16 text-zinc-600 dark:text-zinc-400 font-sans">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left space-y-8 md:space-y-0">
                    {/* Brand */}
                    <div className="flex-1">
                        <h3 className="text-2xl font-heading font-black uppercase tracking-tighter text-zinc-900 dark:text-white">Karate IKS</h3>
                        <p className="text-sm mt-2 max-w-sm mx-auto md:mx-0">
                            Building confidence and discipline through traditional Shito-Ryu Karate in Horana.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="flex-1 flex justify-center space-x-8 text-sm font-bold uppercase tracking-widest">
                        <Link href="/about" className="hover:text-zinc-900 dark:hover:text-white transition-colors">About</Link>
                        <Link href="/programs" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Programs</Link>
                        <Link href="/contact" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Contact</Link>
                    </div>

                    {/* Connect */}
                    <div className="flex-1 flex justify-center md:justify-end">
                         <div className="flex gap-4">
                            <Link href="#" className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors">
                                <Instagram size={18} />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors">
                                <Facebook size={18} />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors">
                                <Twitter size={18} />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800 text-center text-xs uppercase tracking-widest text-zinc-500">
                    © {new Date().getFullYear()} International Karate School. All Rights Reserved.
                </div>
            </div>
        </footer>
    );
}
