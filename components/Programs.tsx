import Image from "next/image";
import Link from "next/link";

export function Programs() {
    return (
        <section className="py-24 bg-background dark:bg-zinc-950">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="relative h-96 rounded-lg overflow-hidden">
                            <Image
                                src="https://images.unsplash.com/photo-1517134191118-9d595e4c8c2b?q=80&w=2070&auto=format&fit=crop"
                                alt="Karate classes for all ages"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-foreground-muted">Our Programs</h2>
                        <h3 className="text-4xl md:text-5xl font-heading uppercase text-foreground mt-2">Classes for Everyone</h3>
                        <p className="mt-4 text-lg text-foreground-muted">
                            We offer specialized karate programs tailored to different age groups, ensuring a safe, effective, and engaging learning environment for every student.
                        </p>
                        <div className="mt-6 space-y-4">
                            <div className="p-4 border border-border rounded-lg">
                                <h4 className="font-bold text-lg text-foreground">Little Dragons (Ages 4-7)</h4>
                                <p className="text-foreground-muted">Building a strong foundation in a fun and playful setting.</p>
                            </div>
                            <div className="p-4 border border-border rounded-lg">
                                <h4 className="font-bold text-lg text-foreground">Youth Karate (Ages 8-16)</h4>
                                <p className="text-foreground-muted">Developing skills, discipline, and confidence.</p>
                            </div>
                            <div className="p-4 border border-border rounded-lg">
                                <h4 className="font-bold text-lg text-foreground">Adult Training (Ages 17+)</h4>
                                <p className="text-foreground-muted">Enhancing physical fitness and martial arts proficiency.</p>
                            </div>
                        </div>
                        <Link
                            href="/programs"
                            className="inline-block mt-8 px-8 py-3 bg-button-inverted-bg text-button-inverted-text font-bold uppercase tracking-widest hover:bg-button-inverted-bg-hover transition-colors"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
