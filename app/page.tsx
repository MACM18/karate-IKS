import Link from "next/link";
import { HeroSection } from "@/components/HeroSection";
import { FeatureCard } from "@/components/FeatureCard";
import { Shield, Zap, UserCheck } from "lucide-react";

export default function Home() {
    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-action selection:text-white">
            <main>
                <HeroSection />

                {/* Value Proposition Section */}
                <section className="py-24 px-4 container mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-action font-bold tracking-widest uppercase text-sm mb-2">
                            Our Philosophy
                        </h2>
                        <h3 className="text-4xl md:text-5xl font-heading uppercase text-white">
                            Why Train With Us?
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={Shield}
                            title="Self Defense"
                            description="Learn practical, effective techniques to protect yourself and your loved ones in any situation."
                        />
                        <FeatureCard
                            icon={UserCheck}
                            title="Character Building"
                            description="We cultivate respect, discipline, and perseverance. The Dojo Kun is our guide in and out of the dojo."
                        />
                        <FeatureCard
                            icon={Zap}
                            title="Physical Fitness"
                            description="Develop explosive power, flexibility, and endurance through traditional conditioning methods."
                        />
                    </div>
                </section>

                {/* Call to Action Strip */}
                <section className="py-20 bg-zinc-900 border-y border-zinc-800">
                    <div className="container mx-auto px-4 text-center">
                        <h3 className="text-3xl font-heading uppercase mb-6">Ready to enter the Dojo?</h3>
                        <p className="text-zinc-500 mb-8 max-w-xl mx-auto">
                            Your first class is complimentary. Come experience the tradition and energy of our school.
                        </p>
                        <div className="flex justify-center">
                            <Link
                                href="/join"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors"
                            >
                                Enter the Dojo <Shield size={16} />
                            </Link>
                        </div>
                    </div>
                </section>
            </main>


        </div>
    );
}
