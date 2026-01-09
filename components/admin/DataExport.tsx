"use client";

import React from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';

interface ExportButtonProps {
    data: any[];
    filename: string;
    sheetName?: string;
    title?: string;
    columns: string[];
}

export const DataExport: React.FC<ExportButtonProps> = ({
    data,
    filename,
    sheetName = "Data",
    title = "Exported Report",
    columns
}) => {
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        XLSX.writeFile(workbook, `${filename}.xlsx`);
    };

    const exportToPDF = () => {
        const doc = new jsPDF() as any;
        doc.setFontSize(18);
        doc.text(title, 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Generated on ${new Date().toLocaleString()}`, 14, 30);

        const tableRows = data.map(item => columns.map(col => item[col] || ""));

        doc.autoTable({
            head: [columns.map(c => c.charAt(0).toUpperCase() + c.slice(1))],
            body: tableRows,
            startY: 40,
            theme: 'grid',
            headStyles: { fillStyle: '#dc2626' }, // Primary red
        });

        doc.save(`${filename}.pdf`);
    };

    return (
        <div className="flex gap-2">
            <button
                onClick={exportToExcel}
                className="flex items-center gap-2 bg-emerald-600/10 text-emerald-500 border border-emerald-600/20 px-4 py-2 text-xs font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all"
            >
                <FileSpreadsheet size={16} /> Excel
            </button>
            <button
                onClick={exportToPDF}
                className="flex items-center gap-2 bg-red-600/10 text-red-500 border border-red-600/20 px-4 py-2 text-xs font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
            >
                <FileText size={16} /> PDF
            </button>
        </div>
    );
};
