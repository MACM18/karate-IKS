"use client";

import { motion } from "framer-motion";
import { Instagram, Linkedin, Twitter } from "lucide-react";

interface Instructor {
  name: string;
  role: string;
  bio: string;
  image: string;
}

export function InstructorSpotlight({
  instructors,
}: {
  instructors: Instructor[];
}) {
  if (!instructors || instructors.length === 0) return null;

  return (
    <section className='overflow-hidden'>
      <div className='container mx-auto px-4 lg:px-8'>
        <div className='text-center mb-20'>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='text-primary font-heading font-bold uppercase tracking-[0.3em] text-sm mb-4 block'
          >
            The Masters
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className='text-5xl md:text-7xl font-heading font-black uppercase tracking-tighter text-foreground'
          >
            Meet Your <span className='text-primary italic'>Sensei</span>
          </motion.h2>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-12'>
          {instructors.map((instructor, index) => (
            <motion.div
              key={instructor.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className='group'
            >
              <div className='relative aspect-[3/4] overflow-hidden rounded-2xl mb-6 shadow-xl grayscale hover:grayscale-0 transition-all duration-700'>
                <img
                  src={instructor.image}
                  alt={instructor.name}
                  className='object-cover w-full h-full scale-100 group-hover:scale-110 transition-transform duration-1000'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>

                {/* Social Icons on Hover */}
                <div className='absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 translate-y-10 group-hover:translate-y-0 transition-transform duration-500 delay-100'>
                  <button className='p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-primary transition-colors'>
                    <Instagram size={18} />
                  </button>
                  <button className='p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-primary transition-colors'>
                    <Twitter size={18} />
                  </button>
                  <button className='p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-primary transition-colors'>
                    <Linkedin size={18} />
                  </button>
                </div>
              </div>

              <h3 className='text-2xl font-heading font-bold uppercase text-foreground mb-1 group-hover:text-primary transition-colors'>
                {instructor.name}
              </h3>
              <p className='text-primary font-heading font-bold uppercase tracking-widest text-[10px] mb-4'>
                {instructor.role}
              </p>
              <p className='text-muted-foreground text-sm leading-relaxed line-clamp-2'>
                {instructor.bio}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
