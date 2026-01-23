"use client";

import { useState } from "react";
import { Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SettingsFormProps {
  initialData?: {
    id?: string;
    phoneNumbers: string[];
    whatsappNumbers: string[];
    senseiName: string;
    senseiEmail?: string | null;
    dojoAddress?: string | null;
  };
}

export default function SettingsForm({ initialData }: SettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>(
    initialData?.phoneNumbers || []
  );
  const [whatsappNumbers, setWhatsappNumbers] = useState<string[]>(
    initialData?.whatsappNumbers || []
  );
  const [senseiName, setSenseiName] = useState(
    initialData?.senseiName || "Sensei"
  );
  const [senseiEmail, setSenseiEmail] = useState(
    initialData?.senseiEmail || ""
  );
  const [dojoAddress, setDojoAddress] = useState(
    initialData?.dojoAddress || ""
  );
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const addPhoneNumber = () => {
    setPhoneNumbers([...phoneNumbers, ""]);
  };

  const removePhoneNumber = (index: number) => {
    setPhoneNumbers(phoneNumbers.filter((_, i) => i !== index));
  };

  const updatePhoneNumber = (index: number, value: string) => {
    const updated = [...phoneNumbers];
    updated[index] = value;
    setPhoneNumbers(updated);
  };

  const addWhatsappNumber = () => {
    setWhatsappNumbers([...whatsappNumbers, ""]);
  };

  const removeWhatsappNumber = (index: number) => {
    setWhatsappNumbers(whatsappNumbers.filter((_, i) => i !== index));
  };

  const updateWhatsappNumber = (index: number, value: string) => {
    const updated = [...whatsappNumbers];
    updated[index] = value;
    setWhatsappNumbers(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      // Filter out empty strings
      const filteredPhones = phoneNumbers.filter((p) => p.trim() !== "");
      const filteredWhatsapp = whatsappNumbers.filter((w) => w.trim() !== "");

      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumbers: filteredPhones,
          whatsappNumbers: filteredWhatsapp,
          senseiName: senseiName.trim() || "Sensei",
          senseiEmail: senseiEmail.trim() || null,
          dojoAddress: dojoAddress.trim() || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      setMessage({ type: "success", text: "Settings saved successfully!" });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to save settings. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-8'>
      {/* Sensei Name */}
      <div className='bg-zinc-900 border border-zinc-800 p-8'>
        <h3 className='text-lg font-heading font-black uppercase tracking-tighter text-white mb-6'>
          Sensei Information
        </h3>
        <div className='space-y-4'>
          <div>
            <label className='block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2'>
              Sensei Name *
            </label>
            <input
              type='text'
              value={senseiName}
              onChange={(e) => setSenseiName(e.target.value)}
              className='w-full bg-black border border-zinc-800 p-4 text-white focus:border-primary focus:outline-none transition-colors'
              required
            />
          </div>
          <div>
            <label className='block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2'>
              Email Address
            </label>
            <input
              type='email'
              value={senseiEmail}
              onChange={(e) => setSenseiEmail(e.target.value)}
              className='w-full bg-black border border-zinc-800 p-4 text-white focus:border-primary focus:outline-none transition-colors'
              placeholder='sensei@example.com'
            />
          </div>
        </div>
      </div>

      {/* Phone Numbers */}
      <div className='bg-zinc-900 border border-zinc-800 p-8'>
        <div className='flex items-center justify-between mb-6'>
          <h3 className='text-lg font-heading font-black uppercase tracking-tighter text-white'>
            Phone Numbers
          </h3>
          <button
            type='button'
            onClick={addPhoneNumber}
            className='flex items-center gap-2 bg-primary text-black px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-primary/80 transition-colors'
          >
            <Plus className='h-3 w-3' />
            Add
          </button>
        </div>
        <div className='space-y-3'>
          {phoneNumbers.map((number, index) => (
            <div key={index} className='flex gap-2'>
              <input
                type='tel'
                value={number}
                onChange={(e) => updatePhoneNumber(index, e.target.value)}
                className='flex-1 bg-black border border-zinc-800 p-4 text-white focus:border-primary focus:outline-none transition-colors'
                placeholder='+1 (555) 123-4567'
              />
              <button
                type='button'
                onClick={() => removePhoneNumber(index)}
                className='bg-red-900/20 border border-red-900 p-4 text-red-500 hover:bg-red-900/40 transition-colors'
              >
                <X className='h-4 w-4' />
              </button>
            </div>
          ))}
          {phoneNumbers.length === 0 && (
            <p className='text-sm text-zinc-600 italic'>
              No phone numbers added yet
            </p>
          )}
        </div>
      </div>

      {/* WhatsApp Numbers */}
      <div className='bg-zinc-900 border border-zinc-800 p-8'>
        <div className='flex items-center justify-between mb-6'>
          <h3 className='text-lg font-heading font-black uppercase tracking-tighter text-white'>
            WhatsApp Numbers
          </h3>
          <button
            type='button'
            onClick={addWhatsappNumber}
            className='flex items-center gap-2 bg-green-600 text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-green-700 transition-colors'
          >
            <Plus className='h-3 w-3' />
            Add
          </button>
        </div>
        <div className='space-y-3'>
          {whatsappNumbers.map((number, index) => (
            <div key={index} className='flex gap-2'>
              <input
                type='tel'
                value={number}
                onChange={(e) => updateWhatsappNumber(index, e.target.value)}
                className='flex-1 bg-black border border-zinc-800 p-4 text-white focus:border-primary focus:outline-none transition-colors'
                placeholder='+1 555 123 4567 (numbers only)'
              />
              <button
                type='button'
                onClick={() => removeWhatsappNumber(index)}
                className='bg-red-900/20 border border-red-900 p-4 text-red-500 hover:bg-red-900/40 transition-colors'
              >
                <X className='h-4 w-4' />
              </button>
            </div>
          ))}
          {whatsappNumbers.length === 0 && (
            <p className='text-sm text-zinc-600 italic'>
              No WhatsApp numbers added yet
            </p>
          )}
        </div>
      </div>

      {/* Dojo Address */}
      <div className='bg-zinc-900 border border-zinc-800 p-8'>
        <h3 className='text-lg font-heading font-black uppercase tracking-tighter text-white mb-6'>
          Dojo Location
        </h3>
        <div>
          <label className='block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2'>
            Physical Address
          </label>
          <textarea
            value={dojoAddress}
            onChange={(e) => setDojoAddress(e.target.value)}
            className='w-full bg-black border border-zinc-800 p-4 text-white focus:border-primary focus:outline-none transition-colors min-h-[100px]'
            placeholder='123 Main Street, City, State, ZIP'
          />
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`border p-4 ${
            message.type === "success"
              ? "bg-green-900/20 border-green-900 text-green-500"
              : "bg-red-900/20 border-red-900 text-red-500"
          }`}
        >
          <p className='text-sm font-medium'>{message.text}</p>
        </div>
      )}

      {/* Submit Button */}
      <div className='flex justify-end'>
        <Button
          type='submit'
          disabled={isLoading}
          className='bg-primary text-black hover:bg-primary/80 font-black uppercase tracking-widest px-8 py-6'
        >
          {isLoading ? (
            <>
              <Loader2 className='h-4 w-4 mr-2 animate-spin' />
              Saving...
            </>
          ) : (
            "Save Settings"
          )}
        </Button>
      </div>
    </form>
  );
}
