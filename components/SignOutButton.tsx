"use client";

import { useState } from "react";
import { LogOut, Home, X } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface SignOutButtonProps {
  className?: string;
  children?: React.ReactNode;
  submitButtonClass?: string;
}

export default function SignOutButton({
  className,
  children,
  submitButtonClass,
}: SignOutButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className={className}
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(true);
        }}
      >
        {children}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 md:p-20'
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className='absolute top-10 right-10 text-zinc-500 hover:text-white transition-colors p-4 group'
            >
              <X
                size={40}
                className='group-hover:rotate-180 transition-transform duration-500'
              />
            </button>

            <div className='w-full max-w-xl'>
              <div className='mb-12 text-center md:text-left'>
                <div className='flex items-center justify-center md:justify-start gap-4 text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-4'>
                  <div className='w-12 h-px bg-primary' />
                  System Access
                </div>
                <h2 className='text-4xl md:text-6xl font-heading font-black uppercase tracking-tighter text-white'>
                  Sign <span className='text-primary italic'>Out</span>
                </h2>
              </div>

              <div className='bg-zinc-900/50 border border-zinc-800 p-8 md:p-12'>
                <p className='text-zinc-400 mb-8 text-lg font-light'>
                  Are you sure you want to leave the dojo? Your session will be
                  terminated.
                </p>

                <div className='flex gap-4'>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className={`w-full flex items-center justify-center gap-3 p-6 transition-all group skew-x-[-8deg] hover:scale-[1.02] ${
                      submitButtonClass ||
                      "bg-red-600 hover:bg-red-700 text-white"
                    }`}
                  >
                    <div className='skew-x-[8deg] flex items-center gap-2 font-bold uppercase tracking-widest text-xs'>
                      <LogOut size={18} />
                      <span>Confirm Sign Out</span>
                    </div>
                  </button>

                  <Link
                    href='/'
                    onClick={() => setIsOpen(false)}
                    className='w-full flex items-center justify-center gap-3 bg-zinc-800 hover:bg-zinc-700 text-white p-6 transition-all group skew-x-[-8deg] hover:scale-[1.02]'
                  >
                    <div className='skew-x-[8deg] flex items-center gap-2 font-bold uppercase tracking-widest text-xs'>
                      <Home size={18} />
                      <span>Return to Home</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
