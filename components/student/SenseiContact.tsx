"use client";

import { Phone, MessageCircle, Mail, MapPin } from "lucide-react";

interface SenseiContactProps {
  senseiName: string;
  phoneNumbers: string[];
  whatsappNumbers: string[];
  senseiEmail?: string | null;
  dojoAddress?: string | null;
}

export default function SenseiContact({
  senseiName,
  phoneNumbers,
  whatsappNumbers,
  senseiEmail,
  dojoAddress,
}: SenseiContactProps) {
  return (
    <div className='bg-zinc-900 border border-zinc-800 p-8'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-2xl font-heading font-black uppercase tracking-tighter text-white'>
          Contact {senseiName}
        </h2>
        <div className='text-[10px] font-black uppercase tracking-widest text-zinc-600'>
          Support Line
        </div>
      </div>

      <div className='space-y-6'>
        {/* Phone Numbers */}
        {phoneNumbers.length > 0 && (
          <div className='space-y-3'>
            <div className='flex items-center gap-2 mb-3'>
              <Phone className='h-4 w-4 text-primary' />
              <span className='text-[10px] font-black uppercase tracking-widest text-zinc-500'>
                Phone Numbers
              </span>
            </div>
            <div className='space-y-2'>
              {phoneNumbers.map((number, index) => (
                <a
                  key={index}
                  href={`tel:${number}`}
                  className='block bg-black border border-zinc-800 p-4 hover:border-primary transition-colors'
                >
                  <span className='text-lg font-heading font-black text-primary'>
                    {number}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* WhatsApp Numbers */}
        {whatsappNumbers.length > 0 && (
          <div className='space-y-3'>
            <div className='flex items-center gap-2 mb-3'>
              <MessageCircle className='h-4 w-4 text-green-500' />
              <span className='text-[10px] font-black uppercase tracking-widest text-zinc-500'>
                WhatsApp
              </span>
            </div>
            <div className='space-y-2'>
              {whatsappNumbers.map((number, index) => (
                <a
                  key={index}
                  href={`https://wa.me/${number.replace(/[^0-9]/g, "")}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='block bg-black border border-zinc-800 p-4 hover:border-green-500 transition-colors'
                >
                  <span className='text-lg font-heading font-black text-green-500'>
                    {number}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Email */}
        {senseiEmail && (
          <div className='space-y-3'>
            <div className='flex items-center gap-2 mb-3'>
              <Mail className='h-4 w-4 text-blue-500' />
              <span className='text-[10px] font-black uppercase tracking-widest text-zinc-500'>
                Email
              </span>
            </div>
            <a
              href={`mailto:${senseiEmail}`}
              className='block bg-black border border-zinc-800 p-4 hover:border-blue-500 transition-colors'
            >
              <span className='text-sm font-heading font-black text-blue-500'>
                {senseiEmail}
              </span>
            </a>
          </div>
        )}

        {/* Dojo Address */}
        {dojoAddress && (
          <div className='space-y-3'>
            <div className='flex items-center gap-2 mb-3'>
              <MapPin className='h-4 w-4 text-purple-500' />
              <span className='text-[10px] font-black uppercase tracking-widest text-zinc-500'>
                Dojo Location
              </span>
            </div>
            <div className='bg-black border border-zinc-800 p-4'>
              <p className='text-sm font-medium text-zinc-300 leading-relaxed'>
                {dojoAddress}
              </p>
            </div>
          </div>
        )}

        {/* Support Note */}
        <div className='mt-6 bg-black border border-zinc-800 p-4'>
          <p className='text-[10px] font-black uppercase tracking-widest text-zinc-600 text-center'>
            Contact for guidance, questions, or scheduling assistance
          </p>
        </div>
      </div>
    </div>
  );
}
