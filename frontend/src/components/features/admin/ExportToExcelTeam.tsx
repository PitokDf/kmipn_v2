// components/ExportButton.tsx
"use client";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ExportButtonProps {
    data: {
        teamsByCategory: { name: string; count: number }[];
        categoryDistribution: { name: string; totalTeam: number; percent: number }[];
    };
}

export default function ExportButton({ data }: ExportButtonProps) {
    const exportToExcel = () => {
        const { teamsByCategory, categoryDistribution } = data;

        const wb = XLSX.utils.book_new();

        const sheet1 = XLSX.utils.json_to_sheet(teamsByCategory.map((team) => ({
            "Nama Tim": team.name,
            "Jumlah": team.count
        })));
        XLSX.utils.book_append_sheet(wb, sheet1, "TeamsByCategory");

        const sheet2 = XLSX.utils.json_to_sheet(categoryDistribution.map((cat) => ({
            Kategori: cat.name,
            "Total Tim": cat.totalTeam,
            Persentase: cat.percent
        })));
        XLSX.utils.book_append_sheet(wb, sheet2, "CategoryDistribution");

        const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const blob = new Blob([buffer], { type: "application/octet-stream" });
        saveAs(blob, "laporan_tim.xlsx");
    };

    return (
        <Button onClick={exportToExcel} variant={"outline"}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
        </Button>
    );
}
