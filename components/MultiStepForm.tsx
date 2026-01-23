"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Target,
  Flame,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function MultiStepForm({
  initialSchedules = [],
}: {
  initialSchedules?: any[];
}) {
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");

  const [schedules] = useState<any[]>(initialSchedules);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    emergencyContact: "",
    dateOfBirth: "",
    experience: "beginner",
    goals: [],
    program: "adults",
    classId: "",
  });

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (currentStep === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = "Given Name is required";
      if (!formData.lastName.trim()) newErrors.lastName = "Surname is required";
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Invalid email format";
      }
      if (!formData.phone.trim()) newErrors.phone = "Communication Line is required";
      if (!formData.dateOfBirth) newErrors.dateOfBirth = "Birth Origin is required";
      if (!formData.emergencyContact.trim()) newErrors.emergencyContact = "Emergency Support is required";
    }

    if (currentStep === 2) {
      if (!formData.program) newErrors.program = "Primary Objective must be selected";
    }

    if (currentStep === 3) {
      if (!formData.classId) newErrors.classId = "Training slot selection is mandatory";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      isValid = false;
    } else {
      setErrors({});
    }
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < totalSteps) setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
    setErrors({});
    setGeneralError("");
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!validateStep(step)) return;

    setIsSubmitting(true);
    setGeneralError("");

    try {
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        emergencyContact: formData.emergencyContact,
        dateOfBirth: formData.dateOfBirth
          ? new Date(formData.dateOfBirth).toISOString()
          : undefined,
        classId: formData.classId,
        // rank and other details are set by admin later
      };

      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        window.location.href = "/login?registered=true";
      } else {
        const error = await response.json();
        setGeneralError(error.error || "Submission failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setGeneralError("Network error. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear specific error when user types
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: "" }));
    }
  };

  // Enter key support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        // Prevent default form submission if inside a form
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) {
          e.preventDefault();
          if (step < totalSteps) {
            handleNext();
          } else {
            handleSubmit();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [step, formData]); // Depend on step and formData for validation closure

  return (
    <div className='w-full'>
      {/* Elegant Progress Indicator */}
      <div className='mb-12'>
        <div className='flex justify-between items-end mb-4'>
          <div>
            <p className='text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-1'>
              Onboarding Process
            </p>
            <h2 className='text-xl font-heading font-black uppercase text-foreground'>
              {step === 1 ? "Identity" : step === 2 ? "Legacy" : "Deployment"}
            </h2>
          </div>
          <span className='text-[10px] font-bold uppercase tracking-widest text-muted-foreground italic'>
            Phase 0{step} / 0{totalSteps}
          </span>
        </div>
        <div className='h-1 w-full bg-muted/30 rounded-full overflow-hidden'>
          <motion.div
            className='h-full bg-primary'
            initial={{ width: 0 }}
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            transition={{ duration: 0.5, ease: "circOut" }}
          />
        </div>
      </div>

      {/* General Error Banner */}
      {generalError && (
        <div className="mb-6 bg-red-500/10 border border-red-500/50 p-4 rounded flex items-center gap-3 text-red-500 animate-in fade-in slide-in-from-top-2">
          <AlertCircle size={20} />
          <span className="text-xs font-bold uppercase tracking-wide">{generalError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <AnimatePresence mode='wait'>
          {/* Step 1: Personal Details */}
          {step === 1 && (
            <motion.div
              key='step1'
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className='space-y-8'
            >
              <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                <div className='space-y-2'>
                  <label className='text-[10px] uppercase font-black tracking-widest text-muted-foreground'>
                    Given Name {errors.firstName && <span className="text-red-500 ml-2">* {errors.firstName}</span>}
                  </label>
                  <div className='relative group'>
                    <User
                      className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.firstName ? 'text-red-500' : 'text-muted-foreground group-focus-within:text-primary'}`}
                      size={16}
                    />
                    <input
                      type='text'
                      name='firstName'
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full bg-muted/10 border py-4 pl-12 pr-4 text-foreground text-sm focus:outline-none transition-all font-bold placeholder:text-muted-foreground/30 ${errors.firstName ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-primary'}`}
                      placeholder='DANIEL'
                    />
                  </div>
                </div>
                <div className='space-y-2'>
                  <label className='text-[10px] uppercase font-black tracking-widest text-muted-foreground'>
                    Surname {errors.lastName && <span className="text-red-500 ml-2">* {errors.lastName}</span>}
                  </label>
                  <div className='relative group'>
                    <User
                      className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.lastName ? 'text-red-500' : 'text-muted-foreground group-focus-within:text-primary'}`}
                      size={16}
                    />
                    <input
                      type='text'
                      name='lastName'
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full bg-muted/10 border py-4 pl-12 pr-4 text-foreground text-sm focus:outline-none transition-all font-bold placeholder:text-muted-foreground/30 ${errors.lastName ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-primary'}`}
                      placeholder='LARUSSO'
                    />
                  </div>
                </div>
                <div className='space-y-2'>
                  <label className='text-[10px] uppercase font-black tracking-widest text-muted-foreground'>
                    Email Frequency {errors.email && <span className="text-red-500 ml-2">* {errors.email}</span>}
                  </label>
                  <div className='relative group'>
                    <Mail
                      className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.email ? 'text-red-500' : 'text-muted-foreground group-focus-within:text-primary'}`}
                      size={16}
                    />
                    <input
                      type='email'
                      name='email'
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full bg-muted/10 border py-4 pl-12 pr-4 text-foreground text-sm focus:outline-none transition-all font-bold placeholder:text-muted-foreground/30 ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-primary'}`}
                      placeholder='DANIEL@MIYAGIDO.COM'
                    />
                  </div>
                </div>
                <div className='space-y-2'>
                  <label className='text-[10px] uppercase font-black tracking-widest text-muted-foreground'>
                    Communication Line {errors.phone && <span className="text-red-500 ml-2">* {errors.phone}</span>}
                  </label>
                  <div className='relative group'>
                    <Phone
                      className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.phone ? 'text-red-500' : 'text-muted-foreground group-focus-within:text-primary'}`}
                      size={16}
                    />
                    <input
                      type='tel'
                      name='phone'
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full bg-muted/10 border py-4 pl-12 pr-4 text-foreground text-sm focus:outline-none transition-all font-bold placeholder:text-muted-foreground/30 ${errors.phone ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-primary'}`}
                      placeholder='+1 (555) 0199-342'
                    />
                  </div>
                </div>
                <div className='space-y-2'>
                  <label className='text-[10px] uppercase font-black tracking-widest text-muted-foreground'>
                    Birth Origin {errors.dateOfBirth && <span className="text-red-500 ml-2">* {errors.dateOfBirth}</span>}
                  </label>
                  <div className='relative group'>
                    <Calendar
                      className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.dateOfBirth ? 'text-red-500' : 'text-muted-foreground group-focus-within:text-primary'}`}
                      size={16}
                    />
                    <input
                      type='date'
                      name='dateOfBirth'
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className={`w-full bg-muted/10 border py-4 pl-12 pr-4 text-foreground text-sm focus:outline-none transition-all font-bold ${errors.dateOfBirth ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-primary'}`}
                    />
                  </div>
                </div>
                <div className='space-y-2'>
                  <label className='text-[10px] uppercase font-black tracking-widest text-muted-foreground'>
                    Emergency Support {errors.emergencyContact && <span className="text-red-500 ml-2">* {errors.emergencyContact}</span>}
                  </label>
                  <div className='relative group'>
                    <Shield
                      className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.emergencyContact ? 'text-red-500' : 'text-muted-foreground group-focus-within:text-primary'}`}
                      size={16}
                    />
                    <input
                      type='text'
                      name='emergencyContact'
                      value={formData.emergencyContact}
                      onChange={handleChange}
                      className={`w-full bg-muted/10 border py-4 pl-12 pr-4 text-foreground text-sm focus:outline-none transition-all font-bold placeholder:text-muted-foreground/30 ${errors.emergencyContact ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-primary'}`}
                      placeholder='MR. MIYAGI'
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Experience */}
          {step === 2 && (
            <motion.div
              key='step2'
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className='space-y-8'
            >
              <div className='space-y-4'>
                <label className='text-[10px] uppercase font-black tracking-widest text-muted-foreground'>
                  Current Proficiency
                </label>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  {[
                    { level: "Beginner", icon: Shield },
                    { level: "Intermediate", icon: Target },
                    { level: "Advanced", icon: Flame },
                  ].map((item) => (
                    <button
                      key={item.level}
                      type='button'
                      onClick={() =>
                        setFormData({
                          ...formData,
                          experience: item.level.toLowerCase(),
                        })
                      }
                      className={`p-6 border rounded-sm flex flex-col items-center gap-4 transition-all duration-300 ${formData.experience === item.level.toLowerCase()
                          ? "border-primary bg-primary/10 text-foreground scale-[1.02] shadow-lg"
                          : "border-border bg-muted/5 text-muted-foreground hover:border-foreground/30 hover:bg-muted/10"
                        }`}
                    >
                      <item.icon
                        className={
                          formData.experience === item.level.toLowerCase()
                            ? "text-primary"
                            : "text-muted-foreground"
                        }
                        size={24}
                      />
                      <span className='text-[10px] font-black uppercase tracking-widest'>
                        {item.level}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className='space-y-2'>
                <label className='text-[10px] uppercase font-black tracking-widest text-muted-foreground'>
                  Primary Objective {errors.program && <span className="text-red-500 ml-2">* {errors.program}</span>}
                </label>
                <select
                  name='program'
                  className={`w-full bg-muted/10 border py-4 px-4 text-foreground text-sm focus:outline-none transition-all font-bold appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207L10%2012L15%207%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:20px_20px] bg-[right_1rem_center] bg-no-repeat ${errors.program ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-primary'}`}
                  onChange={handleChange}
                  value={formData.program}
                >
                  <option value='' className='bg-background text-foreground'>
                    SELECT A GOAL
                  </option>
                  <option
                    value='fitness'
                    className='bg-background text-foreground'
                  >
                    PHYSICAL FITNESS
                  </option>
                  <option
                    value='self-defense'
                    className='bg-background text-foreground'
                  >
                    PRACTICAL SELF DEFENSE
                  </option>
                  <option
                    value='competition'
                    className='bg-background text-foreground'
                  >
                    ELITE COMPETITION
                  </option>
                  <option
                    value='discipline'
                    className='bg-background text-foreground'
                  >
                    MENTAL DISCIPLINE
                  </option>
                </select>
              </div>
            </motion.div>
          )}

          {/* Step 3: Class Selection */}
          {step === 3 && (
            <motion.div
              key='step3'
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className='space-y-6'
            >
              <label className='text-[10px] uppercase font-black tracking-widest text-muted-foreground block mb-4'>
                Select Your Training Slot {errors.classId && <span className="text-red-500 ml-2">* {errors.classId}</span>}
              </label>
              <div className='grid grid-cols-1 gap-4'>
                {schedules.map((prog) => (
                  <button
                    key={prog.id}
                    type='button'
                    onClick={() => {
                      setFormData({ ...formData, classId: prog.id });
                      setErrors(prev => ({ ...prev, classId: "" }));
                    }}
                    className={`p-6 border rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4 text-left transition-all duration-300 ${formData.classId === prog.id
                        ? "border-primary bg-primary/10 shadow-lg"
                        : "border-border bg-muted/5 hover:border-foreground/30 hover:bg-muted/10"
                      } ${errors.classId ? "border-red-500" : ""}`}
                  >
                    <div>
                      <h3
                        className={`font-heading uppercase text-xl font-bold ${formData.classId === prog.id
                            ? "text-primary"
                            : "text-foreground"
                          }`}
                      >
                        {prog.name}
                      </h3>
                      <p className='text-[10px] font-black uppercase text-muted-foreground tracking-widest mt-1 mb-2'>
                        {prog.day} @ {prog.time}
                      </p>
                      <p className='text-xs text-muted-foreground leading-relaxed max-w-sm'>
                        Secure your place in the upcoming{" "}
                        {prog.name.split(" ")[0]} rotation.
                      </p>
                    </div>
                    {formData.classId === prog.id && (
                      <Check
                        className='text-primary hidden md:block'
                        size={24}
                      />
                    )}
                  </button>
                ))}

                {schedules.length === 0 && (
                  <p className='text-xs text-muted-foreground italic text-center py-8'>
                    Loading available training slots...
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className='flex justify-between mt-16 pt-8 border-t border-border'>
          <button
            type='button'
            onClick={handlePrev}
            disabled={step === 1}
            className={`flex items-center gap-2 px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${step === 1
                ? "text-muted-foreground/30 cursor-not-allowed"
                : "text-muted-foreground hover:text-foreground"
              }`}
          >
            <ChevronLeft size={16} /> Retreat
          </button>

          {step < totalSteps ? (
            <button
              type='button'
              onClick={handleNext}
              className='flex items-center gap-2 px-10 py-4 bg-foreground text-background font-black uppercase tracking-[0.2em] text-[10px] hover:bg-primary hover:text-white transition-all shadow-xl'
            >
              Advance Phase <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type='submit'
              disabled={isSubmitting}
              className='flex items-center gap-2 px-10 py-4 bg-primary text-white font-black uppercase tracking-[0.2em] text-[10px] hover:bg-red-700 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isSubmitting ? "Processing..." : "Submit Enrollment"}{" "}
              <Check size={16} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
