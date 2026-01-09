import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone, Shield } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-background border-t border-border pt-20 pb-10 text-muted-foreground font-sans relative overflow-hidden">
            {/* Decorative element */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

            <div className="container mx-auto px-4 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                    {/* Brand & About */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="bg-primary p-1 rounded-sm skew-x-[-10deg]">
                                <Shield size={20} className="text-white skew-x-[10deg]" />
                            </div>
                            <span className="text-2xl font-heading font-black uppercase tracking-tighter text-foreground">
                                Karate <span className="text-primary italic">IKS</span>
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed max-w-xs">
                            Dedicated to the preservation and promotion of Shito-Ryu Shinbukan Karate-Do. Forging character, discipline, and excellence since 1988.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
                                <Instagram size={18} />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
                                <Facebook size={18} />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
                                <Twitter size={18} />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-foreground font-heading font-bold uppercase tracking-widest mb-8 text-sm relative inline-block">
                            Explore
                            <span className="absolute -bottom-2 left-0 w-8 h-1 bg-primary"></span>
                        </h4>
                        <ul className="space-y-4 text-sm font-medium">
                            <li><Link href="/about" className="hover:text-primary transition-colors flex items-center gap-2">About Our Heritage</Link></li>
                            <li><Link href="/programs" className="hover:text-primary transition-colors flex items-center gap-2">Training Programs</Link></li>
                            <li><Link href="/news" className="hover:text-primary transition-colors flex items-center gap-2">News & Events</Link></li>
                            <li><Link href="/join" className="text-primary font-bold hover:underline">Join the Dojo</Link></li>
                        </ul>
                    </div>

                    {/* Member Area */}
                    <div>
                        <h4 className="text-foreground font-heading font-bold uppercase tracking-widest mb-8 text-sm relative inline-block">
                            Member Portal
                            <span className="absolute -bottom-2 left-0 w-8 h-1 bg-primary"></span>
                        </h4>
                        <ul className="space-y-4 text-sm font-medium">
                            <li><Link href="/login" className="hover:text-primary transition-colors">Student Login</Link></li>
                            <li><Link href="/student/dashboard" className="hover:text-primary transition-colors">Digital Dashboard</Link></li>
                            <li><Link href="/student/resources" className="hover:text-primary transition-colors">Curriculum Resources</Link></li>
                            <li><Link href="/admin/dashboard" className="hover:text-primary transition-colors italic opacity-70">Instructor Portal</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-foreground font-heading font-bold uppercase tracking-widest mb-8 text-sm relative inline-block">
                            Get in Touch
                            <span className="absolute -bottom-2 left-0 w-8 h-1 bg-primary"></span>
                        </h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
                                <span>123 Dojo Way, <br />Colombo 07, Sri Lanka</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-primary shrink-0" />
                                <span>+94 11 234 5678</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-primary shrink-0" />
                                <span>contact@karate-iks.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-20 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em]">
                        © {new Date().getFullYear()} Karate Do Shito-Ryu Shinbukan Association.
                    </p>
                    <div className="flex gap-8 text-[10px] font-bold uppercase tracking-[0.2em]">
                        <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

