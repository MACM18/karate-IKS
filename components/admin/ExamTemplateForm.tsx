"use client";

import React, { useState } from "react";
import { Plus, Trash2, Save, FileText, Calendar, Type, Paperclip } from "lucide-react";
import { createExamTemplate } from "@/app/lib/actions";

interface Field {
    name: string;
    label: string;
    type: "text" | "date" | "textarea" | "file";
    required: boolean;
}

export function ExamTemplateForm() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("GRADING");
    const [folderName, setFolderName] = useState("exams");
    const [fields, setFields] = useState<Field[]>([]);
    const [openDate, setOpenDate] = useState(new Date().toISOString().split('T')[0]);
    const [deadline, setDeadline] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const addField = (fieldType: Field["type"]) => {
        const newField: Field = {
            name: `field_${Date.now()}`,
            label: `New ${fieldType} Field`,
            type: fieldType,
            required: true,
        };
        setFields([...fields, newField]);
    };

    const removeField = (index: number) => {
        setFields(fields.filter((_, i) => i !== index));
    };

    const updateField = (index: number, updates: Partial<Field>) => {
        const newFields = [...fields];
        newFields[index] = { ...newFields[index], ...updates };
        setFields(newFields);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || fields.length === 0) {
            alert("Title and at least one field are required.");
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("type", type);
        formData.append("folderName", folderName);
        formData.append("openDate", openDate);
        if (deadline) formData.append("deadline", deadline);
        formData.append("fields", JSON.stringify(fields));

        try {
            await createExamTemplate(formData);
            alert("Exam Template created successfully!");
            setTitle("");
            setDescription("");
            setDeadline("");
            setFields([]);
        } catch (error) {
            console.error(error);
            alert("Failed to create template.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-zinc-900 border border-zinc-800 p-8 rounded-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <label className="block text-xs font-black uppercase tracking-widest text-zinc-500">Exam Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-black border border-zinc-800 p-3 text-white focus:border-primary outline-none transition-colors"
                        placeholder="e.g., 8th Kyu White Belt Grading"
                        required
                    />
                </div>
                <div className="space-y-4">
                    <label className="block text-xs font-black uppercase tracking-widest text-zinc-500">Exam Type</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full bg-black border border-zinc-800 p-3 text-white focus:border-primary outline-none transition-colors"
                    >
                        <option value="GRADING">Grading Exam</option>
                        <option value="DAN_GRADING">Dan Grading</option>
                        <option value="COMPETITION">Competition</option>
                        <option value="OTHER">Other Event</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <label className="block text-xs font-black uppercase tracking-widest text-zinc-500">Opening Date</label>
                    <input
                        type="date"
                        value={openDate}
                        onChange={(e) => setOpenDate(e.target.value)}
                        className="w-full bg-black border border-zinc-800 p-3 text-white focus:border-primary outline-none transition-colors"
                        required
                    />
                </div>
                <div className="space-y-4">
                    <label className="block text-xs font-black uppercase tracking-widest text-zinc-500">Deadline (Optional)</label>
                    <input
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="w-full bg-black border border-zinc-800 p-3 text-white focus:border-primary outline-none transition-colors"
                    />
                </div>
            </div>

            <div className="space-y-4">
                <label className="block text-xs font-black uppercase tracking-widest text-zinc-500">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-black border border-zinc-800 p-3 text-white focus:border-primary outline-none transition-colors h-24"
                    placeholder="Provide details about the exam requirements, location, and fees."
                />
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-primary">Form Fields</h3>
                    <div className="flex gap-2">
                        <button type="button" onClick={() => addField("text")} className="p-2 hover:bg-zinc-800 rounded-sm text-zinc-400 group" title="Add Text Field">
                            <Type size={18} className="group-hover:text-primary" />
                        </button>
                        <button type="button" onClick={() => addField("date")} className="p-2 hover:bg-zinc-800 rounded-sm text-zinc-400 group" title="Add Date Field">
                            <Calendar size={18} className="group-hover:text-primary" />
                        </button>
                        <button type="button" onClick={() => addField("textarea")} className="p-2 hover:bg-zinc-800 rounded-sm text-zinc-400 group" title="Add TextArea">
                            <FileText size={18} className="group-hover:text-primary" />
                        </button>
                        <button type="button" onClick={() => addField("file")} className="p-2 hover:bg-zinc-800 rounded-sm text-zinc-400 group" title="Add File Upload">
                            <Paperclip size={18} className="group-hover:text-primary" />
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    {fields.map((field, index) => (
                        <div key={field.name} className="flex flex-col md:flex-row gap-4 p-4 bg-black border border-zinc-800 animate-in fade-in slide-in-from-top-2">
                            <div className="flex-1 space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Label</label>
                                <input
                                    type="text"
                                    value={field.label}
                                    onChange={(e) => updateField(index, { label: e.target.value, name: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                                    className="w-full bg-zinc-900 border border-zinc-800 p-2 text-sm text-white focus:border-primary outline-none"
                                />
                            </div>
                            <div className="w-full md:w-32 space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Type</label>
                                <div className="p-2 bg-zinc-800/50 text-xs text-zinc-300 rounded-sm capitalize">{field.type}</div>
                            </div>
                            <div className="flex items-end gap-4 pb-1">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={field.required}
                                        onChange={(e) => updateField(index, { required: e.target.checked })}
                                        className="w-4 h-4 accent-primary"
                                    />
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Required</span>
                                </label>
                                <button type="button" onClick={() => removeField(index)} className="p-2 text-zinc-600 hover:text-red-500 transition-colors">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {fields.length === 0 && (
                        <div className="py-12 text-center border-2 border-dashed border-zinc-800 rounded-sm">
                            <p className="text-zinc-500 text-sm italic">No fields added yet. Use the icons above to start building the form.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="pt-6 border-t border-zinc-800 flex justify-between items-center">
                <div className="flex items-center gap-2 text-zinc-500">
                    <Paperclip size={14} />
                    <span className="text-[10px] uppercase font-bold tracking-widest">Files will upload to: S3 / {folderName} /</span>
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-3 px-8 py-3 bg-primary text-white font-black uppercase tracking-widest hover:bg-primary/90 transition-all disabled:opacity-50"
                >
                    {isSubmitting ? "Generating..." : (
                        <>
                            <Save size={18} />
                            Save Template
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
