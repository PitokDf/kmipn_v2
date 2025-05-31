import { Button } from "@/components/ui/button";
import axiosInstace from "@/lib/axios";
import { Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ExportData() {
    const [loading, setIsLoading] = useState(false)
    const handleDownload = async () => {
        try {
            setIsLoading(true)
            const res = await axiosInstace.get("/team-member/download-list-members", { responseType: "blob" })

            const url = window.URL.createObjectURL(new Blob([res.data]))
            const a = document.createElement("a")
            a.href = url
            a.download = "list-members.csv"
            document.body.appendChild(a)
            a.click()
            a.remove()
            window.URL.revokeObjectURL(url)

        } catch (error) {
            console.log("Export gagal: ", error);
            toast.error("Terjadi masalah saat mencoba mengeksport")
        } finally { setIsLoading(false) }
    };

    return (
        <Button variant="default" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            {loading ? "Exporting..." : "Export Data"}
        </Button>
    )
}