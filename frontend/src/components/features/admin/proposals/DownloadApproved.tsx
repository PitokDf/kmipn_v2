import { Button } from "@/components/ui/button";
import { downloadApprovedProposal } from "@/lib/apis/proposal";
import { Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function DownloadApproved() {
    const [loading, setLoading] = useState(false)
    const downloadApproved = async () => {
        try {
            setLoading(true)
            const res = await downloadApprovedProposal()
            const url = window.URL.createObjectURL(new Blob([res.data]))
            const a = document.createElement("a")
            a.href = url
            a.download = "approved-proposals.zip"
            document.body.appendChild(a)
            a.click()
            a.remove()
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.log("Download gagal: ", error);
            toast.error("Terjadi masalah saat mencoba mendownload proposal")
        } finally { setLoading(false) }
    }
    return (
        <Button
            variant={"default"}
            disabled={loading}
            className="hover:scale-105 transition-all"
            onClick={downloadApproved}>
            <Download className="w-4 h-4 mr-1" /> {loading ? "Loading..." : "Download All Approved"}
        </Button>
    )
}