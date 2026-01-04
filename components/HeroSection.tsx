import Link from "next/link";

export function HeroSection() {
    return (
        <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: 'url("/hero-bg.png")' }}
            >
                <div className="absolute inset-0 bg-black/70 bg-blend-overlay" />
                {/* Added a gradient fade at the bottom for smooth transition */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
            </div>

            <div className="relative z-10 container mx-auto px-4 text-center">
                <h2 className="text-action font-bold tracking-[0.2em] uppercase mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    International Karate School
                </h2>

                <h1 className="text-6xl md:text-8xl font-heading font-black uppercase tracking-tighter text-white mb-6 leading-none">
                    Forged in <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500">
                        Discipline
                    </span>
                </h1>

                <p className="text-xl md:text-2xl text-zinc-300 max-w-2xl mx-auto mb-10 font-light text-balance">
                    Master the art of Shito-Ryu Karate. Build strength, character, and confidence in a traditional dojo environment.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                        href="/join"
                        className="px-10 py-4 bg-action text-white font-bold text-lg uppercase tracking-widest hover:bg-red-700 transition-all hover:scale-105"
                    >
                        Start Your Journey
                    </Link>
                    <Link
                        href="/student/dashboard"
                        className="px-10 py-4 border border-zinc-600 text-zinc-300 font-bold text-lg uppercase tracking-widest hover:border-white hover:text-white transition-all"
                    >
                        Student Portal
                    </Link>
                </div>
            </div>
        </section>
    );
}
