import { NewsCard } from "@/components/NewsCard";
import { Trophy } from "lucide-react";

export default function NewsPage() {
    const newsItems = [
        {
            title: "Winter Seminar with Kyoshi Smith",
            excerpt: "Join us for a special weekend seminar focusing on advanced bunkai and sparring drills.",
            date: "Dec 12, 2025",
            category: "Events"
        },
        {
            title: "Holiday Schedule Update",
            excerpt: "The dojo will be closed for the holidays from Dec 24th to Jan 2nd. Training resumes Jan 3rd.",
            date: "Dec 01, 2025",
            category: "Announcements"
        },
        {
            title: "Congratulations to our new Black Belts",
            excerpt: "Six students demonstrated exceptional spirit during their Shodan grading last Saturday.",
            date: "Nov 28, 2025",
            category: "Promotions",
            imageUrl: "placeholder"
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white p-8 md:p-16 font-sans">
            <header className="text-center mb-16">
                <h1 className="text-5xl font-heading uppercase tracking-widest text-white mb-4">Dojo Feed</h1>
                <p className="text-zinc-500">Latest news, updates, and student achievements.</p>
            </header>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* Main Feed */}
                <div className="lg:col-span-2 space-y-8">
                    <h2 className="text-2xl font-heading uppercase text-white tracking-widest mb-6 border-l-4 border-action pl-4">
                        Latest Updates
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {newsItems.map((item, i) => (
                            <NewsCard key={i} {...item} />
                        ))}
                    </div>
                </div>

                {/* Wall of Fame (Sidebar) */}
                <aside>
                    <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-8 sticky top-8">
                        <div className="flex items-center gap-3 mb-6">
                            <Trophy className="text-amber-500" size={24} />
                            <h2 className="text-xl font-heading uppercase text-white tracking-widest">
                                Wall of Fame
                            </h2>
                        </div>

                        <div className="space-y-6">
                            <div className="group cursor-pointer">
                                <div className="aspect-square bg-zinc-900 rounded border border-zinc-800 mb-2 overflow-hidden relative">
                                    {/* Placeholder for "Action Portrait" */}
                                    <div className="absolute inset-0 flex items-center justify-center text-zinc-700 text-xs uppercase tracking-widest">
                                        Tournament Gold
                                    </div>
                                </div>
                                <h3 className="font-bold text-white group-hover:text-amber-500 transition-colors">Samantha L.</h3>
                                <p className="text-xs text-zinc-500 uppercase">State Champion 2025</p>
                            </div>

                            <div className="group cursor-pointer">
                                <div className="aspect-square bg-zinc-900 rounded border border-zinc-800 mb-2 overflow-hidden relative">
                                    <div className="absolute inset-0 flex items-center justify-center text-zinc-700 text-xs uppercase tracking-widest">
                                        Student of the Year
                                    </div>
                                </div>
                                <h3 className="font-bold text-white group-hover:text-amber-500 transition-colors">Miguel D.</h3>
                                <p className="text-xs text-zinc-500 uppercase">Outstanding Spirit</p>
                            </div>

                            <button className="w-full py-3 mt-4 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 uppercase text-xs font-bold tracking-widest transition-colors rounded">
                                View Gallery
                            </button>
                        </div>
                    </div>
                </aside>

            </div>
        </div>
    );
}
