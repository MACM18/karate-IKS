import { CertificateCard } from "@/components/student/CertificateCard";

export default function CertificatesPage() {
    const certificates = [
        { rank: "Yellow Belt", date: "October 12, 2024", instructor: "Sensei Miyagi" },
        { rank: "White Belt", date: "August 1, 2024", instructor: "Sensei Miyagi" },
    ];

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <header className="mb-12">
                <h1 className="text-4xl font-heading uppercase tracking-widest text-white mb-4">
                    My Certificates
                </h1>
                <p className="text-zinc-500 max-w-2xl">
                    Official records of your achievements. Download high-quality copies for printing.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 max-w-6xl mx-auto pb-20">
                {/* Latest Achievement Highlight */}
                <div className="md:col-span-2 lg:col-span-1 lg:row-span-2 flex flex-col justify-center">
                    <div className="mb-4">
                        <span className="bg-action text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                            Latest Award
                        </span>
                    </div>
                    <p className="text-2xl text-white font-light mb-6">
                        Congratulations on your recent promotion to <span className="text-yellow-400 font-bold">Yellow Belt</span>.
                    </p>
                    <p className="text-zinc-500 leading-relaxed max-w-md">
                        This certificate represents mastery of Heian Shodan and basic kumite skills. Display it with pride in your home dojo.
                    </p>
                </div>

                {certificates.map((cert, i) => (
                    <CertificateCard
                        key={i}
                        {...cert}
                    />
                ))}

                {/* Placeholder for next belt */}
                <div className="border border-zinc-900 rounded-lg p-8 flex flex-col items-center justify-center text-center opacity-50 bg-zinc-950/50">
                    <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4 text-zinc-700">
                        <span className="text-2xl">?</span>
                    </div>
                    <h3 className="font-heading text-xl uppercase text-zinc-600 mb-2">Next Milestone</h3>
                    <p className="text-zinc-700 text-sm">Orange Belt</p>
                    <p className="text-xs text-zinc-800 mt-4 uppercase tracking-widest">Coming Soon</p>
                </div>
            </div>
        </div>
    );
}
