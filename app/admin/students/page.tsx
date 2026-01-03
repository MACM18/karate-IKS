import { StudentTable } from "@/components/admin/StudentTable";
import { Search, Filter, Plus } from "lucide-react";

export default function AdminStudentsPage() {
    return (
        <div className="p-8">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-heading uppercase text-white tracking-widest">
                        Student Roster
                    </h1>
                    <p className="text-zinc-500 mt-1">Manage dojo members and attendance.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-action text-white font-bold uppercase tracking-widest hover:bg-red-700 transition-colors rounded-sm">
                    <Plus size={18} /> New Student
                </button>
            </header>

            {/* Toolbar */}
            <div className="flex gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full bg-zinc-900 border border-zinc-800 py-3 pl-10 pr-4 rounded text-white focus:outline-none focus:border-zinc-700 placeholder:text-zinc-600"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-3 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors rounded">
                    <Filter size={18} />
                    <span className="uppercase text-xs font-bold tracking-wider">Filter</span>
                </button>
            </div>

            {/* Table */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-lg overflow-hidden">
                <StudentTable />
            </div>
        </div>
    );
}
