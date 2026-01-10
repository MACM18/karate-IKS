"use client";

import React, { useState, useRef } from "react";
import { Save, Plus, ImageIcon, Star, X, Loader2, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";

interface GalleryUploadFormProps {
  onSuccess?: () => void;
  initialTitle?: string;
  initialCategory?: string;
}

export function GalleryUploadForm({ onSuccess, initialTitle = "", initialCategory = "General" }: GalleryUploadFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [featured, setFeatured] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const isFixedContext = !!initialTitle;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
      setFeedback(null);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      setFeedback({ type: "error", message: "Please select at least one image." });
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);
    setFeedback(null);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("caption", caption);
    formData.append("category", category);
    formData.append("featured", featured.toString());

    files.forEach(file => {
      formData.append("files", file);
    });

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/gallery/upload", true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        setUploadProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        if (!isFixedContext) {
          setTitle("");
          setCategory("General");
        }
        setCaption("");
        setFiles([]);
        setFeatured(false);
        setUploadProgress(100);
        if (fileInputRef.current) fileInputRef.current.value = "";

        setFeedback({ type: "success", message: "Visual intel archived successfully!" });

        // Wait a moment to show 100%
        setTimeout(() => {
          setIsSubmitting(false);
          setUploadProgress(0);
          if (onSuccess) onSuccess();
          router.refresh();
        }, 1500);
      } else {
        console.error("Upload failed");
        setFeedback({ type: "error", message: "Failed to upload images. Check connection." });
        setIsSubmitting(false);
      }
    };

    xhr.onerror = () => {
      console.error("Upload error");
      setFeedback({ type: "error", message: "Network error during upload." });
      setIsSubmitting(false);
    };

    xhr.send(formData);
  };

  return (
    <div className="relative">
      {/* Feedback Overlay */}
      {feedback && !isSubmitting && (
        <div className={`absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm rounded-lg animate-in fade-in duration-300`}>
          <div className="text-center p-6 space-y-4 max-w-xs">
            <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center border-2 ${feedback.type === 'success' ? 'border-primary text-primary' : 'border-red-500 text-red-500'}`}>
              {feedback.type === 'success' ? <Star size={32} /> : <X size={32} />}
            </div>
            <h4 className="text-white font-bold uppercase tracking-widest">{feedback.type === 'success' ? 'Success' : 'Error'}</h4>
            <p className="text-zinc-400 text-xs">{feedback.message}</p>
            <button
              onClick={() => setFeedback(null)}
              className="text-[10px] font-black uppercase text-white hover:text-primary underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className='bg-zinc-900 border border-zinc-800 p-6 space-y-6'
      >
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-4'>
            <div>
              <label className='block text-xs font-black uppercase tracking-widest text-zinc-500 mb-2'>
                Batch Title / Event Name
              </label>
              <input
                name='title'
                type='text'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full bg-black border border-zinc-800 p-3 text-white focus:border-primary outline-none transition-colors font-bold ${isFixedContext ? 'opacity-50 cursor-not-allowed' : ''}`}
                placeholder='e.g., Summer Training 2025'
                required
                readOnly={isFixedContext}
              />
            </div>

            <div>
              <label className='block text-xs font-black uppercase tracking-widest text-zinc-500 mb-2'>
                Category / Album
              </label>
              {isFixedContext ? (
                <input
                  type='text'
                  value={category}
                  readOnly
                  className='w-full bg-black border border-zinc-800 p-3 text-white opacity-50 cursor-not-allowed'
                />
              ) : (
                <div className="relative">
                  <input
                    list="categories"
                    name='category'
                    type='text'
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className='w-full bg-black border border-zinc-800 p-3 text-white focus:border-primary outline-none transition-colors'
                    placeholder='e.g., Seminar, Grading'
                    required
                  />
                  <datalist id="categories">
                    <option value="Dojo" />
                    <option value="Training" />
                    <option value="Seminars" />
                    <option value="Competitions" />
                    <option value="Events" />
                  </datalist>
                </div>
              )}

            </div>

            <div>
              <label className='block text-xs font-black uppercase tracking-widest text-zinc-500 mb-2'>
                Caption (Shared)
              </label>
              <textarea
                name='caption'
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className='w-full bg-black border border-zinc-800 p-3 text-white focus:border-primary outline-none transition-colors min-h-[80px] text-sm'
                placeholder='Description applied to all uploaded images...'
              />
            </div>
          </div>

          <div className="space-y-4">
            {/* ... file input ... */}
            {/* Reusing existing file selection UI logic here but ensuring it's wrapped properly for context */}
            <label className='block text-xs font-black uppercase tracking-widest text-zinc-500'>
              Selection ({files.length} Files)
            </label>

            <div className="bg-black border border-zinc-800 rounded-lg p-4 min-h-[200px] flex flex-col gap-4">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="bulk-upload-input"
              />

              {files.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 border-2 border-dashed border-zinc-800 rounded hover:border-zinc-600 hover:text-zinc-400 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <UploadCloud size={32} className="mb-2" />
                  <span className="text-xs font-bold uppercase tracking-wider">Click to Select Images</span>
                  <span className="text-[10px] opacity-50">Support multiple selection</span>
                </div>
              ) : (
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-zinc-900 p-2 rounded border border-zinc-800">
                      <span className="text-xs text-white truncate max-w-[180px]">{file.name}</span>
                      <span className="text-[10px] text-zinc-500">{(file.size / 1024).toFixed(0)}KB</span>
                      <button type="button" onClick={() => removeFile(index)} className="text-zinc-500 hover:text-red-500">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full py-2 text-xs font-bold uppercase text-primary hover:text-white transition-colors border border-dashed border-zinc-800 hover:border-primary">
                    + Add More
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {isSubmitting && (
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-400">
              <span>Uploading to Secure Archive...</span>
              <span>{uploadProgress.toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-200 ease-out"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        <div className='flex items-center justify-between pt-4 border-t border-zinc-800'>
          <button
            type='button'
            onClick={() => setFeatured(!featured)}
            className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-colors ${featured ? "text-yellow-500" : "text-zinc-600"
              }`}
          >
            <Star size={14} fill={featured ? "currentColor" : "none"} />
            {featured ? "Mark as Featured" : "Standard Archive"}
          </button>

          <button
            type='submit'
            disabled={isSubmitting || files.length === 0}
            className='flex items-center gap-2 bg-primary text-white px-6 py-2 text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Processing
              </>
            ) : (
              <>
                <Save size={16} /> Batch Upload
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
