export default function AboutPage() {
    return (
        <div className="min-h-screen bg-black text-white p-8 md:p-16 font-sans">
            <div className="max-w-4xl mx-auto space-y-16">

                {/* Header */}
                <section className="text-center space-y-4">
                    <h1 className="text-5xl font-heading uppercase tracking-widest text-white">The Dojo Lineage</h1>
                    <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
                        Tracing our roots back to the traditional masters of Shotokan, we preserve the authenticity and spirit of the art.
                    </p>
                </section>

                {/* Philosophy / Dojo Kun */}
                <section className="bg-zinc-950 border border-zinc-900 p-10 rounded-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 font-heading text-9xl text-white pointer-events-none select-none">
                        空手
                    </div>

                    <h2 className="text-2xl font-heading uppercase text-action mb-8 tracking-widest">Dojo Kun</h2>
                    <ul className="space-y-6 text-xl md:text-2xl font-light text-zinc-300">
                        <li className="flex gap-4">
                            <span className="text-action font-bold">1.</span>
                            <span>Seek Perfection of Character</span>
                        </li>
                        <li className="flex gap-4">
                            <span className="text-action font-bold">1.</span>
                            <span>Be Faithful</span>
                        </li>
                        <li className="flex gap-4">
                            <span className="text-action font-bold">1.</span>
                            <span>Endeavor</span>
                        </li>
                        <li className="flex gap-4">
                            <span className="text-action font-bold">1.</span>
                            <span>Respect Others</span>
                        </li>
                        <li className="flex gap-4">
                            <span className="text-action font-bold">1.</span>
                            <span>Refrain From Violent Behavior</span>
                        </li>
                    </ul>
                </section>

                {/* Sensei Bio */}
                <section className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="aspect-[3/4] bg-zinc-900 w-full rounded-lg border border-zinc-800 flex items-center justify-center text-zinc-700">
                        [Sensei Portrait Placeholder]
                    </div>
                    <div className="space-y-6">
                        <h2 className="text-3xl font-heading uppercase text-white tracking-widest">Sensei Miyagi</h2>
                        <div className="space-y-4 text-zinc-400 leading-relaxed">
                            <p>
                                With over 40 years of experience, Sensei Miyagi has dedicated his life to the teaching of traditional Karate.
                            </p>
                            <p>
                                His philosophy goes beyond the physical technique, focusing on the development of the mind and spirit. He believes that Karate is a lifelong journey of self-discovery.
                            </p>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}
