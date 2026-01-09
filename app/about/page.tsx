export default function AboutPage() {
    return (
        <main>
            {/* 1. Hero Section */}
            <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center text-center px-4 bg-zinc-900">
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center opacity-20"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1593982944213-9541a1601625?q=80&w=2070&auto=format&fit=crop")' }}
                />
                <div className="relative z-10 container mx-auto">
                    <h1 className="text-4xl md:text-6xl font-heading font-black uppercase tracking-tighter text-white mb-4">
                        The Way of Shinbukan
                    </h1>
                    <p className="text-lg md:text-xl text-zinc-200 max-w-3xl mx-auto">
                        Our Story & Philosophy
                    </p>
                </div>
            </section>

            {/* 2. Our Mission Section */}
            <section className="py-24">
                <div className="container mx-auto px-4 text-center max-w-4xl">
                    <h2 className="text-3xl md:text-4xl font-heading uppercase text-foreground mb-6">Our Mission</h2>
                    <p className="text-xl md:text-2xl text-foreground-muted leading-relaxed">
                        To cultivate a community of disciplined martial artists who embody the principles of respect, integrity, and perseverance. We are dedicated to preserving the rich traditions of Shito-Ryu Karate while empowering our students to achieve their full potential, both in the dojo and in life.
                    </p>
                </div>
            </section>

            {/* 3. The Lineage Section */}
            <section className="py-24 bg-zinc-100 dark:bg-zinc-900">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-heading uppercase text-foreground mb-6">The Dojo Lineage</h2>
                            <p className="text-lg text-foreground-muted mb-6">
                                Tracing our roots back to the traditional masters of Shito-Ryu, we preserve the authenticity and spirit of the art under the Karate Do Shito-Ryu Shinbukan Association.
                            </p>
                            <p className="text-lg text-foreground-muted">
                                Our dojo is a place of discipline, respect, and continuous improvement. We follow the Dojo Kun, the five guiding principles of Karate, to shape our character and guide our practice.
                            </p>
                        </div>
                        <div className="bg-background border border-border p-8 rounded-lg">
                            <h3 className="text-2xl font-heading uppercase text-action mb-6 tracking-widest">Dojo Kun</h3>
                            <ul className="space-y-4 text-lg text-foreground-muted">
                                <li className="flex gap-4"><span className="text-action font-bold">1.</span><span>Seek Perfection of Character</span></li>
                                <li className="flex gap-4"><span className="text-action font-bold">2.</span><span>Be Faithful</span></li>
                                <li className="flex gap-4"><span className="text-action font-bold">3.</span><span>Endeavor</span></li>
                                <li className="flex gap-4"><span className="text-action font-bold">4.</span><span>Respect Others</span></li>
                                <li className="flex gap-4"><span className="text-action font-bold">5.</span><span>Refrain From Violent Behavior</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Meet the Sensei Section */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="relative aspect-[3/4] w-full max-w-sm mx-auto rounded-lg overflow-hidden border-4 border-border">
                            <div className="bg-zinc-200 dark:bg-zinc-800 h-full w-full flex items-center justify-center">
                                <span className="text-foreground-muted">Sensei Portrait</span>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <h2 className="text-3xl md:text-4xl font-heading uppercase text-foreground">Meet the Sensei</h2>
                            <h3 className="text-2xl font-heading text-action">Sensei Miyagi</h3>
                            <div className="space-y-4 text-lg text-foreground-muted leading-relaxed">
                                <p>
                                    With over 40 years of experience, Sensei Miyagi has dedicated his life to the teaching of traditional Karate.
                                </p>
                                <p>
                                    His philosophy goes beyond the physical technique, focusing on the development of the mind and spirit. He believes that Karate is a lifelong journey of self-discovery.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Our Dojo Section */}
            <section className="py-24 bg-zinc-100 dark:bg-zinc-900">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-heading uppercase text-foreground mb-12">Our Dojo</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                            <span className="text-foreground-muted">Image 1</span>
                        </div>
                        <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                            <span className="text-foreground-muted">Image 2</span>
                        </div>
                        <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                            <span className="text-foreground-muted">Image 3</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. Call to Action */}
            <section className="py-24 text-center bg-zinc-50 dark:bg-zinc-950">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-heading uppercase text-foreground mb-6">Begin Your Journey</h2>
                    <p className="text-lg text-foreground-muted mb-8 max-w-2xl mx-auto">
                        Ready to take the first step? Explore our programs and find the right class for you or your child.
                    </p>
                    <a href="/programs" className="inline-block px-10 py-4 bg-action text-white font-bold uppercase tracking-widest hover:bg-red-700 transition-colors">
                        Explore Programs
                    </a>
                </div>
            </section>
        </main>
    );
}
