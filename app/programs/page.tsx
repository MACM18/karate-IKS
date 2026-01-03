import { User, Users, Zap } from "lucide-react";
import Link from "next/link";

export default function ProgramsPage() {
    return (
        <div className="min-h-screen bg-black text-white p-8 md:p-16 font-sans">
            <header className="text-center mb-16">
                <h1 className="text-5xl font-heading uppercase tracking-widest text-white mb-4">Our Programs</h1>
                <p className="text-zinc-500">Classes designed for every age and skill level.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {/* Little Ninjas */}
                <div className="group bg-zinc-950 border border-zinc-900 rounded-lg overflow-hidden hover:border-zinc-700 transition-colors">
                    <div className="h-48 bg-zinc-900 flex items-center justify-center text-zinc-700">
                        [Kids Image]
                    </div>
                    <div className="p-8">
                        <div className="mb-4 text-action">
                            <User size={32} />
                        </div>
                        <h2 className="text-2xl font-heading uppercase text-white mb-2">Little Ninjas</h2>
                        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6">Ages 4 - 7</p>
                        <p className="text-zinc-400 mb-8 leading-relaxed">
                            A fun, high-energy introduction to martial arts. We focus on listening skills, balance, coordination, and stranger danger awareness.
                        </p>
                        <Link href="/join" className="block text-center py-3 border border-zinc-700 text-white uppercase text-sm font-bold tracking-widest hover:bg-white hover:text-black transition-colors">
                            Join Class
                        </Link>
                    </div>
                </div>

                {/* Juniors */}
                <div className="group bg-zinc-950 border border-zinc-900 rounded-lg overflow-hidden hover:border-zinc-700 transition-colors transform md:-translate-y-4">
                    <div className="h-48 bg-zinc-900 flex items-center justify-center text-zinc-700">
                        [Juniors Image]
                    </div>
                    <div className="p-8">
                        <div className="mb-4 text-white">
                            <Users size={32} />
                        </div>
                        <h2 className="text-2xl font-heading uppercase text-white mb-2">Juniors Program</h2>
                        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6">Ages 8 - 15</p>
                        <p className="text-zinc-400 mb-8 leading-relaxed">
                            Building confidence and discipline. Students learn the full Shotokan curriculum, including Kata, Kumite, and self-defense applications.
                        </p>
                        <Link href="/join" className="block text-center py-3 bg-action text-white border border-action uppercase text-sm font-bold tracking-widest hover:bg-red-700 transition-colors">
                            Start Training
                        </Link>
                    </div>
                </div>

                {/* Adults */}
                <div className="group bg-zinc-950 border border-zinc-900 rounded-lg overflow-hidden hover:border-zinc-700 transition-colors">
                    <div className="h-48 bg-zinc-900 flex items-center justify-center text-zinc-700">
                        [Adults Image]
                    </div>
                    <div className="p-8">
                        <div className="mb-4 text-zinc-400">
                            <Zap size={32} />
                        </div>
                        <h2 className="text-2xl font-heading uppercase text-white mb-2">Adults & Teen</h2>
                        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6">Ages 16+</p>
                        <p className="text-zinc-400 mb-8 leading-relaxed">
                            Whether your goal is fitness, self-defense, or black belt excellence, our adult program offers a challenging and supportive environment.
                        </p>
                        <Link href="/join" className="block text-center py-3 border border-zinc-700 text-white uppercase text-sm font-bold tracking-widest hover:bg-white hover:text-black transition-colors">
                            View Schedule
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
