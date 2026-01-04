import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-black border-t border-zinc-900 py-16 text-zinc-500 font-sans">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">

                {/* Brand */}
                <div className="space-y-4">
                    <h3 className="text-2xl font-heading font-black uppercase text-white tracking-widest">Karate IKS</h3>
                    <p className="text-sm">
                        Forging character and strength since 1985. Join us on the path of self-discovery.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="text-white font-bold uppercase tracking-widest mb-6 text-sm">Explore</h4>
                    <ul className="space-y-3 text-sm">
                        <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                        <li><Link href="/programs" className="hover:text-white transition-colors">Programs</Link></li>
                        <li><Link href="/news" className="hover:text-white transition-colors">News & Events</Link></li>
                        <li><Link href="/join" className="hover:text-white transition-colors text-action">Join the Dojo</Link></li>
                    </ul>
                </div>

                {/* Member Area */}
                <div>
                    <h4 className="text-white font-bold uppercase tracking-widest mb-6 text-sm">Members</h4>
                    <ul className="space-y-3 text-sm">
                        <li><Link href="/login" className="hover:text-white transition-colors">Student Login</Link></li>
                        <li><Link href="/student/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                        <li><Link href="/student/resources" className="hover:text-white transition-colors">Resources</Link></li>
                        <li><Link href="/admin/dashboard" className="hover:text-white transition-colors">Sensei Login</Link></li>
                    </ul>
                </div>

                {/* Connect */}
                <div>
                    <h4 className="text-white font-bold uppercase tracking-widest mb-6 text-sm">Connect</h4>
                    <div className="flex gap-4">
                        <Link href="#" className="w-10 h-10 rounded bg-zinc-900 flex items-center justify-center hover:bg-action hover:text-white transition-colors">
                            <Instagram size={18} />
                        </Link>
                        <Link href="#" className="w-10 h-10 rounded bg-zinc-900 flex items-center justify-center hover:bg-action hover:text-white transition-colors">
                            <Facebook size={18} />
                        </Link>
                        <Link href="#" className="w-10 h-10 rounded bg-zinc-900 flex items-center justify-center hover:bg-action hover:text-white transition-colors">
                            <Twitter size={18} />
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-16 pt-8 border-t border-zinc-900 text-center text-xs uppercase tracking-widest">
                © {new Date().getFullYear()} International Karate School. All Rights Reserved.
            </div>
        </footer>
    );
}
