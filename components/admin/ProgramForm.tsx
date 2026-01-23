"use client";

import { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Shield,
  Target,
  Zap,
  Flame,
  Users,
  Award,
  Loader2,
} from "lucide-react";
import { createProgram, updateProgram, deleteProgram } from "@/app/lib/actions";
import { FormOverlay } from "./FormOverlay";
import { cn } from "@/lib/utils";

interface Program {
  id: string;
  title: string;
  ageGroup: string;
  description: string;
  benefits: string[];
  color: string | null;
  icon: string | null;
  featured: boolean;
}

const ICONS = ["shield", "target", "zap", "flame", "users", "award"];
const COLORS = ["blue", "red", "amber", "emerald", "purple", "orange"];

const iconMap = {
  shield: Shield,
  target: Target,
  zap: Zap,
  flame: Flame,
  users: Users,
  award: Award,
};

export function ProgramForm({ initialPrograms }: { initialPrograms: Program[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [description, setDescription] = useState("");
  const [benefits, setBenefits] = useState("");
  const [color, setColor] = useState("blue");
  const [icon, setIcon] = useState("shield");
  const [featured, setFeatured] = useState(false);

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setAgeGroup("");
    setDescription("");
    setBenefits("");
    setColor("blue");
    setIcon("shield");
    setFeatured(false);
    setIsModalOpen(false);
  };

  const openNewProgram = () => {
    resetForm(); // Clear any previous state
    setIsModalOpen(true);
  };

  const handleEdit = (program: Program) => {
    setEditingId(program.id);
    setTitle(program.title);
    setAgeGroup(program.ageGroup);
    setDescription(program.description);
    setBenefits(program.benefits.join(", "));
    setColor(program.color || "blue");
    setIcon(program.icon || "shield");
    setFeatured(program.featured);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("ageGroup", ageGroup);
    formData.append("description", description);
    formData.append("benefits", benefits);
    formData.append("color", color);
    formData.append("icon", icon);
    formData.append("featured", featured.toString());

    try {
      if (editingId) {
        await updateProgram(editingId, formData);
      } else {
        await createProgram(formData);
      }
      resetForm();
    } catch (error) {
      console.error(error);
      alert("Operation failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this program?")) return;
    try {
      await deleteProgram(id);
    } catch (error) {
      alert("Failed to delete program");
    }
  };

  return (
    <div className='space-y-8 animate-in fade-in duration-500'>
      <div className='flex justify-end'>
        <button
          onClick={openNewProgram}
          className='px-6 py-4 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-700 transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] skew-x-[-12deg]'
        >
          <span className='skew-x-[12deg] flex items-center gap-2'>
            <Plus size={14} /> Initialize New Program
          </span>
        </button>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {initialPrograms.map((program) => {
          const IconComponent =
            iconMap[(program.icon as keyof typeof iconMap) || "shield"];
          return (
            <div
              key={program.id}
              className='bg-zinc-950 border border-zinc-800 p-8 relative group overflow-hidden transition-all hover:border-zinc-700'
            >
              <div
                className={`absolute top-0 left-0 w-1 h-full bg-${program.color || "blue"
                  }-500 transition-colors group-hover:w-2`}
              />

              <div className='flex justify-between items-start mb-6'>
                <div className='flex items-center gap-4'>
                  <div
                    className={`w-12 h-12 rounded-none bg-${program.color || "blue"
                      }-500/10 border border-${program.color || "blue"
                      }-500/20 flex items-center justify-center text-${program.color || "blue"
                      }-500`}
                  >
                    <IconComponent size={24} />
                  </div>
                  <div>
                    <h3 className='text-xl font-heading font-black uppercase text-white tracking-tight'>
                      {program.title}
                    </h3>
                    <p className='text-[10px] text-zinc-500 font-bold uppercase tracking-widest'>
                      {program.ageGroup}
                    </p>
                  </div>
                </div>

                <div className='flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0'>
                  <button
                    onClick={() => handleEdit(program)}
                    className='p-2 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors'
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(program.id)}
                    className='p-2 bg-zinc-900 text-zinc-400 hover:text-red-500 hover:bg-zinc-800 transition-colors'
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <p className='text-sm text-zinc-400 mb-6 font-medium leading-relaxed border-l-2 border-zinc-900 pl-4'>
                {program.description}
              </p>

              <div className='flex flex-wrap gap-2'>
                {program.benefits.slice(0, 3).map((b, i) => (
                  <span
                    key={i}
                    className='text-[9px] px-2 py-1 bg-zinc-900 border border-zinc-800 text-zinc-500 uppercase font-black tracking-wider'
                  >
                    {b}
                  </span>
                ))}
              </div>

              {program.featured && (
                <div className='absolute top-4 right-4'>
                  <span className='px-2 py-1 bg-primary/20 text-primary text-[8px] font-black uppercase tracking-widest border border-primary/20'>
                    Featured Protocol
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <FormOverlay
        title={editingId ? "Edit Protocol" : "New Training Protocol"}
        open={isModalOpen}
        onClose={resetForm}
      >
        <form onSubmit={handleSubmit} className='p-8 space-y-6 bg-zinc-950'>
          <div className='grid grid-cols-2 gap-6'>
            <div className='space-y-2'>
              <label className='text-[10px] font-black uppercase tracking-widest text-zinc-500'>
                Program Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='w-full bg-black border border-zinc-800 p-3 text-sm font-bold text-white focus:border-primary focus:outline-none uppercase'
                placeholder='e.g. KATA MASTERY'
                required
              />
            </div>
            <div className='space-y-2'>
              <label className='text-[10px] font-black uppercase tracking-widest text-zinc-500'>
                Target Demographic
              </label>
              <input
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value)}
                className='w-full bg-black border border-zinc-800 p-3 text-sm font-bold text-white focus:border-primary focus:outline-none uppercase'
                placeholder='e.g. AGES 12-16'
                required
              />
            </div>
          </div>

          <div className='space-y-2'>
            <label className='text-[10px] font-black uppercase tracking-widest text-zinc-500'>
              Operational Briefing
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='w-full bg-black border border-zinc-800 p-3 text-sm font-medium text-white focus:border-primary focus:outline-none h-24 resize-none'
              placeholder='Brief overview of the training protocol...'
              required
            />
          </div>

          <div className='space-y-2'>
            <label className='text-[10px] font-black uppercase tracking-widest text-zinc-500'>
              Key Objectives (Comma Separated)
            </label>
            <input
              value={benefits}
              onChange={(e) => setBenefits(e.target.value)}
              className='w-full bg-black border border-zinc-800 p-3 text-sm font-bold text-white focus:border-primary focus:outline-none'
              placeholder='Focus, Strength, Discipline'
            />
          </div>

          <div className='grid grid-cols-2 gap-6'>
            <div className='space-y-2'>
              <label className='text-[10px] font-black uppercase tracking-widest text-zinc-500'>
                Color Identity
              </label>
              <select
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className='w-full bg-black border border-zinc-800 p-3 text-white focus:border-primary focus:outline-none uppercase text-xs font-bold'
              >
                {COLORS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className='space-y-2'>
              <label className='text-[10px] font-black uppercase tracking-widest text-zinc-500'>
                Visual Marker
              </label>
              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className='w-full bg-black border border-zinc-800 p-3 text-white focus:border-primary focus:outline-none uppercase text-xs font-bold'
              >
                {ICONS.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className='flex items-center gap-3 pt-2'>
            <div className='relative flex items-center'>
              <input
                type='checkbox'
                id='featured'
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className='peer h-5 w-5 cursor-pointer appearance-none border border-zinc-700 bg-black checked:border-primary checked:bg-primary transition-all'
              />
              <Check
                className='pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100'
                size={14}
              />
            </div>
            <label
              htmlFor='featured'
              className='text-xs font-bold text-white uppercase tracking-wider select-none cursor-pointer'
            >
              Mark as Featured Protocol
            </label>
          </div>

          <div className='pt-6 border-t border-zinc-800 flex justify-end gap-4'>
            <button
              type='button'
              onClick={resetForm}
              className='px-6 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={isSubmitting}
              className='px-8 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-colors flex items-center gap-2'
            >
              {isSubmitting && <Loader2 className='h-3 w-3 animate-spin' />}
              {editingId ? "Update Protocol" : "Initialize"}
            </button>
          </div>
        </form>
      </FormOverlay>
    </div>
  );
}
