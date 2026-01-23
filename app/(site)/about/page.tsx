import { prisma } from "@/app/lib/prisma";
import { Timeline } from "@/components/Timeline";
import { motion } from "framer-motion";
import {
  Shield,
  BookOpen,
  Award,
  Users,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";
import type { User } from "@prisma/client";

export const dynamic = "force-dynamic";

// Re-enable client features where needed using a wrapper or keeping small client parts
// For now, I'll convert the main page to a Server Component to fetch data,
// and move interactive parts to small client components if necessary.
// Actually, I can use "use client" for the whole page if I fetch data in a parent or use a different pattern,
// but Next.js 13+ allows async server components for data fetching.

export default async function AboutPage() {
  let senseis: (User & {
    studentProfile?: {
      currentRank?: { name?: string } | null;
      bio?: string | null;
      image?: string | null;
    } | null;
  })[] = [];

  try {
    senseis = await prisma.user.findMany({
      where: { role: "SENSEI" },
      include: {
        studentProfile: {
          include: {
            currentRank: true,
          },
        },
      },
    });
  } catch (err: unknown) {
    // If Prisma complains about missing tables (P2021), render page with empty list
    if ((err as any)?.code === "P2021") {
      console.warn(
        "Prisma P2021 (table missing) while building /about — rendering without instructors",
      );
      senseis = [];
    } else {
      throw err;
    }
  }

  const dojoKun = [
    {
      title: "Character",
      text: "Seek Perfection of Character",
      desc: "The ultimate goal of karate is the perfection of the human spirit.",
    },
    {
      title: "Sincerity",
      text: "Be Faithful",
      desc: "Loyalty to the art, the sensei, and oneself is paramount.",
    },
    {
      title: "Effort",
      text: "Endeavor",
      desc: "True mastery comes from consistent, dedicated training.",
    },
    {
      title: "Etiquette",
      text: "Respect Others",
      desc: "Karate begins and ends with courtesy.",
    },
    {
      title: "Control",
      text: "Refrain From Violent Behavior",
      desc: "The strength found in the dojo is for protection, never aggression.",
    },
  ];

  return (
    <div className='min-h-screen bg-background pb-24'>
      {/* Heritage Hero */}
      <section className='relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden'>
        <div className='absolute inset-0 z-0'>
          <div className='absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-background z-10' />
          <Image
            src='https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=2000&auto=format&fit=crop'
            alt='Traditional Dojo'
            fill
            className='object-cover grayscale brightness-50'
          />
        </div>

        <div className='container mx-auto px-4 relative z-20 text-center'>
          <div className='inline-block py-1 px-3 border border-primary/50 bg-primary/10 rounded-sm mb-6'>
            <span className='text-primary font-heading font-bold uppercase tracking-[0.3em] text-xs'>
              Established 1988
            </span>
          </div>
          <h1 className='text-6xl md:text-8xl lg:text-9xl font-heading font-black uppercase text-white leading-none tracking-tighter'>
            The Path of <br />
            <span className='text-primary italic'>Tradition</span>
          </h1>
        </div>
      </section>

      <div className='container mx-auto px-4 lg:px-8 -mt-32 relative z-30'>
        {/* Chronicles Section */}
        <section className='bg-background border border-border p-12 md:p-20 shadow-2xl mb-24'>
          <div className='max-w-4xl mx-auto'>
            <div className='text-center mb-16'>
              <span className='text-primary font-heading font-bold uppercase tracking-[0.3em] text-sm mb-4 block'>
                Our History
              </span>
              <h2 className='text-4xl md:text-6xl font-heading font-black uppercase tracking-tight text-foreground'>
                Chronicles of{" "}
                <span className='text-primary italic'>Shinbukan</span>
              </h2>
            </div>
            <Timeline />
          </div>
        </section>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-24 items-start'>
          {/* Story Side */}
          <div className='space-y-20'>
            <section className='space-y-8'>
              <h2 className='text-4xl font-heading font-black uppercase tracking-tight text-foreground flex items-center gap-4'>
                <span className='h-px w-12 bg-primary'></span>
                The Legacy
              </h2>
              <div className='space-y-6 text-muted-foreground leading-relaxed text-xl font-medium'>
                <p>
                  Tracing our roots back to the traditional masters of
                  Shito-Ryu, we preserve the authenticity and spirit of the art
                  under the{" "}
                  <span className='text-foreground font-black italic text-primary'>
                    Karate Do Shito-Ryu Shinbukan Association
                  </span>
                  .
                </p>
                <p>
                  Our dojo is not just a training hall; it is a sanctuary for
                  personal growth and technical excellence. We bridge the gap
                  between ancient Okinawan wisdom and modern martial science.
                </p>
              </div>
            </section>

            <section className='bg-muted/10 border border-border p-12 relative overflow-hidden'>
              <h2 className='text-2xl font-heading font-black uppercase tracking-widest text-primary mb-12'>
                The Dojo Kun
              </h2>
              <div className='space-y-8'>
                {dojoKun.map((line, i) => (
                  <div key={i} className='group cursor-default'>
                    <div className='flex items-center gap-6 mb-2'>
                      <span className='text-primary font-heading font-black text-2xl'>
                        0{i + 1}
                      </span>
                      <h3 className='text-lg font-black uppercase tracking-wide text-foreground group-hover:text-primary transition-colors'>
                        {line.text}
                      </h3>
                    </div>
                    <p className='text-sm text-muted-foreground pl-12 max-w-md italic opacity-70 group-hover:opacity-100 transition-opacity'>
                      {line.desc}
                    </p>
                  </div>
                ))}
              </div>
              <div className='absolute bottom-0 right-0 p-8 opacity-5 font-heading text-9xl text-primary pointer-events-none select-none'>
                空手
              </div>
            </section>
          </div>

          {/* Roster Side */}
          <div className='space-y-20'>
            <section className='space-y-12'>
              <h2 className='text-4xl font-heading font-black uppercase tracking-tight text-foreground flex items-center gap-4'>
                <span className='h-px w-12 bg-primary'></span>
                The Masters
              </h2>

              <div className='grid grid-cols-1 gap-12'>
                {senseis.map((sensei) => (
                  <div key={sensei.id} className='group'>
                    <div className='relative aspect-[16/9] overflow-hidden border border-border bg-muted/20 mb-6'>
                      {sensei.image ? (
                        <Image
                          src={sensei.image}
                          alt={sensei.name || "Sensei"}
                          fill
                          className='object-cover grayscale group-hover:grayscale-0 transition-all duration-700'
                        />
                      ) : (
                        <div className='absolute inset-0 flex items-center justify-center p-12'>
                          <Users className='w-24 h-24 text-muted-foreground opacity-20' />
                        </div>
                      )}
                      <div className='absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60' />
                      <div className='absolute bottom-6 left-8'>
                        <h3 className='text-3xl font-heading font-black uppercase text-foreground leading-none'>
                          {sensei.name}
                        </h3>
                        <p className='text-primary font-heading font-bold uppercase tracking-widest text-[10px] mt-2'>
                          {sensei.studentProfile?.currentRank?.name ||
                            "Instructor"}{" "}
                          • Certified Shinbukan
                        </p>
                      </div>
                    </div>
                    <p className='text-muted-foreground leading-relaxed italic border-l-2 border-primary pl-6'>
                      {sensei.studentProfile?.bio ||
                        "Dedicated to the transmission of traditional Shito-Ryu karate and the development of student character."}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className='p-12 border-2 border-dashed border-border text-center'>
              <Award className='w-12 h-12 text-primary mx-auto mb-6 opacity-30' />
              <h3 className='text-xl font-heading font-black uppercase text-foreground mb-4'>
                Official Affiliation
              </h3>
              <p className='text-sm text-muted-foreground max-w-xs mx-auto'>
                Our instructors are certified by the Global Shinbukan Shito-Ryu
                Council, ensuring a direct lineage to the traditional masters.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
