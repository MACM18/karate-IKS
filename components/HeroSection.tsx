import Link from "next/link";

export function HeroSection() {
    return (
        <section className="relative h-[80vh] min-h-[500px] flex items-center justify-center text-center px-4">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1584892305315-7221462e7e8a?q=80&w=2070&auto=format&fit=crop")' }}
            >
                <div className="absolute inset-0 bg-black/50" />
            </div>

            <div className="relative z-10 container mx-auto">
                <h1 className="text-4xl md:text-6xl font-heading font-black uppercase tracking-tighter text-white mb-4">
                    Building Confidence and Discipline Through Shito-Ryu Karate
                </h1>
                <p className="text-lg md:text-xl text-zinc-200 max-w-3xl mx-auto mb-8">
                    Classes for Children, Youth, and Adults in Horana.
                </p>
                <Link
                    href="/schedule"
                    className="inline-block px-10 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors"
                >
                    View Class Schedule
                </Link>
            </div>
        </section>
    );
}
