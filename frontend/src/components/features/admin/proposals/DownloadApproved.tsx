import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { downloadApprovedProposal } from "@/lib/apis/proposal";
import { Proposal } from "@/types/api";
import { useQueryClient } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function DownloadApproved() {
    const [loading, setLoading] = useState(false)
    const [category, setCategory] = useState("all")

    const qc = useQueryClient()
    const data = qc.getQueryData(["proposals"]) as Proposal[] || []
    const allCategories = data.map(p => p.teamCategory)
    const uniqueCategory = Array.from(new Set(allCategories)) as [] || []

    const handleDownload = async () => {
        try {
            setLoading(true)
            const res = await downloadApprovedProposal(category)
            const url = window.URL.createObjectURL(new Blob([res.data]))
            const a = document.createElement("a")
            a.href = url
            a.download = category === "all" ? "proposals.zip" : `${category}-proposals.zip`
            document.body.appendChild(a)
            a.click()
            a.remove()
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.log("Download gagal: ", error);
            toast.error("Terjadi masalah saat mencoba mendownload proposal")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center space-x-0 rounded-md  overflow-hidden w-fit">
            <Button
                variant="default"
                className="rounded-none rounded-l-md"
                onClick={handleDownload}
                disabled={loading}
            >
                <Download className="w-4 h-4 mr-2" />
                {loading ? "Loading..." : "Download"}
            </Button>
            <Select defaultValue={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[180px] rounded-none rounded-r-md border-l">
                    <SelectValue placeholder="Pilih jenis" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value="all">Semua Proposal</SelectItem>
                        {uniqueCategory.map((category, index) => (
                            <SelectItem key={category + index} value={category}>{category}</SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}
