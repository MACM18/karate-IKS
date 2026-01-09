import Link from "next/link";
import { HeroSection } from "@/components/HeroSection";
import { ProgramBento } from "@/components/ProgramBento";
import { LineageSection } from "@/components/LineageSection";
import { InstructorSpotlight } from "@/components/InstructorSpotlight";
import { Shield, Zap, Target, ArrowRight } from "lucide-react";

export default function Home() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <main>
                <HeroSection />

                {/* Lineage & Tradition Section */}
                <LineageSection />

                {/* Programs Bento Grid */}
                <ProgramBento />

                {/* Instructor Spotlight */}
                <InstructorSpotlight />

                {/* Impact/Stats Strip */}
                <section className="py-16 bg-primary text-white">
                    <div className="container mx-auto px-4 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div>
                                <h3 className="text-4xl md:text-5xl font-heading font-black mb-2">350+</h3>
                                <p className="text-sm font-bold uppercase tracking-widest opacity-80">Students</p>
                            </div>
                            <div>
                                <h3 className="text-4xl md:text-5xl font-heading font-black mb-2">12</h3>
                                <p className="text-sm font-bold uppercase tracking-widest opacity-80">Black Belts</p>
                            </div>
                            <div>
                                <h3 className="text-4xl md:text-5xl font-heading font-black mb-2">15</h3>
                                <p className="text-sm font-bold uppercase tracking-widest opacity-80">National Titles</p>
                            </div>
                            <div>
                                <h3 className="text-4xl md:text-5xl font-heading font-black mb-2">10k+</h3>
                                <p className="text-sm font-bold uppercase tracking-widest opacity-80">Training Hours</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Call to Action Section */}
                <section className="py-24 relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2"></div>

                    <div className="container mx-auto px-4 lg:px-8 text-center">
                        <div className="max-w-3xl mx-auto">
                            <Shield className="w-16 h-16 text-primary mx-auto mb-8 animate-bounce" />
                            <h2 className="text-4xl md:text-6xl font-heading font-black uppercase text-foreground mb-6 leading-tight">
                                Your First Step Towards <br />
                                <span className="text-primary italic">Unstoppable Strength</span>
                            </h2>
                            <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
                                Join our community of dedicated practitioners. Whether you're a beginner or an advanced martial artist, there's a place for you in our Dojo.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                <Link
                                    href="/join"
                                    className="px-12 py-5 bg-primary text-white font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-[6px_6px_0px_0px_rgba(220,38,38,0.3)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 flex items-center justify-center gap-2"
                                >
                                    Register Now <ArrowRight size={20} />
                                </Link>
                                <Link
                                    href="/programs"
                                    className="px-12 py-5 border-2 border-border text-foreground font-black uppercase tracking-widest hover:bg-foreground hover:text-background transition-all flex items-center justify-center gap-2"
                                >
                                    Browse Classes <Target size={20} />
                                </Link>
                            </div>

                            <p className="mt-12 text-sm text-muted-foreground font-bold uppercase tracking-widest">
                                <Zap className="inline-block w-4 h-4 text-yellow-500 mr-2" />
                                Free introductory class for all new students
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

