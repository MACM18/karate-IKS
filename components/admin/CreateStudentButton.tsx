"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { TacticalModal } from "./TacticalModal";
import { createStudentManually } from "@/app/lib/actions";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} className="w-full bg-primary text-white py-3 font-black uppercase tracking-widest hover:bg-red-700 transition-colors skew-x-[-12deg]">
       <span className="skew-x-[12deg] flex items-center justify-center gap-2">
           {pending ? <Loader2 className="animate-spin" /> : "Confirm Recruitment"}
       </span>
    </button>
  );
}

export function CreateStudentButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState("");

    async function action(formData: FormData) {
        setError("");
        const res = await createStudentManually(null, formData);
        if (res?.success) {
            setIsOpen(false);
        }
        if(res?.error) {
            setError(res.error);
        }
    }

    return (
        <>
        <button 
            onClick={() => setIsOpen(true)}
            className='px-6 py-3 bg-action text-white text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all skew-x-[-12deg] shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]'
        >
          <span className="skew-x-[12deg] flex items-center gap-2">
            <Plus size={18} /> New Student
          </span>
        </button>

        <TacticalModal isOpen={isOpen} onClose={() => setIsOpen(false)} title="NEW RECRUIT REGISTRATION" severity="info">
            <form action={action} className="space-y-4">
                {error && <div className="text-red-500 text-xs font-bold">{error}</div>}
                <div>
                    <label className="block text-[10px] uppercase font-black text-zinc-500 tracking-widest mb-1">Full Name</label>
                    <input name="name" required className="w-full bg-black border border-zinc-800 p-2 text-white font-bold focus:border-primary outline-none" placeholder="CADET NAME" />
                </div>
                <div>
                     <label className="block text-[10px] uppercase font-black text-zinc-500 tracking-widest mb-1">Email Coordinates</label>
                    <input name="email" type="email" required className="w-full bg-black border border-zinc-800 p-2 text-white font-bold focus:border-primary outline-none" placeholder="EMAIL@DOMAIN.COM" />
                </div>
                 <div>
                     <label className="block text-[10px] uppercase font-black text-zinc-500 tracking-widest mb-1">Access Code</label>
                    <input name="password" type="password" required minLength={6} className="w-full bg-black border border-zinc-800 p-2 text-white font-bold focus:border-primary outline-none" placeholder="******" />
                </div>
                <SubmitButton />
            </form>
        </TacticalModal>
        </>
    )
}
