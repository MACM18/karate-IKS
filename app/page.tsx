import Link from "next/link";

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8 font-sans">
            <main className="flex flex-col items-center text-center gap-6">
                <h1 className="text-6xl font-heading uppercase tracking-widest text-action">
                    Karate IKS
                </h1>
                <p className="text-xl max-w-2xl text-gray-400">
                    Build Strength, Discipline, and Character.
                </p>

                <div className="flex gap-4 mt-8">
                    <Link
                        href="/student/dashboard"
                        className="px-8 py-3 bg-action text-white font-bold tracking-wider hover:bg-red-700 transition-colors uppercase"
                    >
                        Student Portal
                    </Link>
                    <button className="px-8 py-3 border border-gray-600 hover:border-gray-400 transition-colors uppercase tracking-wider">
                        Join Now
                    </button>
                </div>
            </main>
        </div>
    );
}
