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
} from "lucide-react";
import { createProgram, updateProgram, deleteProgram } from "@/app/lib/actions";
import { FormOverlay } from "./FormOverlay";

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

export function ProgramForm({
  initialPrograms,
}: {
  initialPrograms: Program[];
}) {
  const [editingId, setEditingId] = useState<string | null>(null);

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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      alert(`Program ${editingId ? "updated" : "created"}!`);
    } catch (error) {
      console.error(error);
      alert("Op failed.");
    }
  };

  return (
    <div className='space-y-8'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {initialPrograms.map((program) => (
          <div
            key={program.id}
            className='bg-zinc-900 border border-zinc-800 p-6 rounded-lg group relative'
          >
            <div className='flex justify-between items-start mb-4'>
              <div className='flex items-center gap-3'>
                <span
                  className={`p-2 bg-${program.color}-500/10 text-${program.color}-500 rounded`}
                >
                  {program.icon === "shield" && <Shield size={20} />}
                  {program.icon === "target" && <Target size={20} />}
                  {program.icon === "zap" && <Zap size={20} />}
                  {program.icon === "flame" && <Flame size={20} />}
                  {program.icon === "users" && <Users size={20} />}
                  {program.icon === "award" && <Award size={20} />}
                </span>
                <div>
                  <h3 className='font-bold text-white uppercase'>
                    {program.title}
                  </h3>
                  <p className='text-[10px] text-zinc-500 font-bold uppercase tracking-widest'>
                    {program.ageGroup}
                  </p>
                </div>
              </div>
              <div className='flex gap-2'>
                <button
                  onClick={() => handleEdit(program)}
                  className='p-2 hover:bg-black rounded text-zinc-500 hover:text-white'
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => deleteProgram(program.id)}
                  className='p-2 hover:bg-black rounded text-zinc-500 hover:text-red-500'
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p className='text-sm text-zinc-400 mb-4 line-clamp-2'>
              {program.description}
            </p>
            <div className='flex flex-wrap gap-2'>
              {program.benefits.slice(0, 3).map((b, i) => (
                <span
                  key={i}
                  className='text-[10px] px-2 py-1 bg-black border border-zinc-800 rounded text-zinc-400'
                >
                  {b}
                </span>
              ))}
            </div>
            {program.featured && (
              <div className='absolute top-2 right-12 px-2 py-1 bg-primary text-white text-[8px] font-black uppercase rounded'>
                Featured
              </div>
            )}
          </div>
        ))}
      </div>

      <FormOverlay
        title={editingId ? "Edit Protocol" : "New Training Protocol"}
        triggerLabel={editingId ? "Editing..." : "Initialize New Program"}
        defaultOpen={!!editingId}
        onClose={resetForm}
      >
        <form
          onSubmit={handleSubmit}
          className='bg-zinc-900 border border-zinc-800 p-6 space-y-6'
        >
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-4'>
              <label className='text-xs font-black uppercase text-zinc-500'>
                Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='w-full bg-black border border-zinc-800 p-3 text-white focus:border-primary outline-none'
                placeholder='e.g. Kata Mastery'
                required
              />
            </div>
            <div className='space-y-4'>
              <label className='text-xs font-black uppercase text-zinc-500'>
                Age Group
              </label>
              <input
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value)}
                className='w-full bg-black border border-zinc-800 p-3 text-white focus:border-primary outline-none'
                placeholder='e.g. Ages 12-16'
                required
              />
            </div>
          </div>

          <div className='space-y-4'>
            <label className='text-xs font-black uppercase text-zinc-500'>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='w-full bg-black border border-zinc-800 p-3 text-white focus:border-primary outline-none h-24'
              placeholder='Brief overview...'
              required
            />
          </div>

          <div className='space-y-4'>
            <label className='text-xs font-black uppercase text-zinc-500'>
              Benefits (Comma Separated)
            </label>
            <input
              value={benefits}
              onChange={(e) => setBenefits(e.target.value)}
              className='w-full bg-black border border-zinc-800 p-3 text-white focus:border-primary outline-none'
              placeholder='Focus, Strength, Discipline'
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-4'>
              <label className='text-xs font-black uppercase text-zinc-500'>
                Color Theme
              </label>
              <select
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className='w-full bg-black border border-zinc-800 p-3 text-white focus:border-primary outline-none uppercase text-xs'
              >
                {COLORS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className='space-y-4'>
              <label className='text-xs font-black uppercase text-zinc-500'>
                Icon
              </label>
              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className='w-full bg-black border border-zinc-800 p-3 text-white focus:border-primary outline-none uppercase text-xs'
              >
                {ICONS.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <input
              type='checkbox'
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className='w-4 h-4 accent-primary'
            />
            <label className='text-sm text-white font-bold uppercase'>
              Mark as Featured (Highlights in Roster)
            </label>
          </div>

          <button
            type='submit'
            className='w-full py-4 bg-primary text-white font-black uppercase tracking-widest hover:bg-red-700 transition-colors'
          >
            {editingId ? "Update Protocol" : "Initialize Protocol"}
          </button>
        </form>
      </FormOverlay>
    </div>
  );
}
