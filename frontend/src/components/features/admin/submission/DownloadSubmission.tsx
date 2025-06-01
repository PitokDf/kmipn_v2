import { Button } from "@/components/ui/button";
import { downloadApprovedProposal } from "@/lib/apis/proposal";
import { donwloadSubmission } from "@/lib/apis/submission";
import { Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function DownloadFileSubmission() {
    const [loading, setLoading] = useState(false)
    const downloadApproved = async () => {
        try {
            setLoading(true)
            const res = await donwloadSubmission()
            const url = window.URL.createObjectURL(new Blob([res.data]))
            const a = document.createElement("a")
            a.href = url
            a.download = "submissions.zip"
            document.body.appendChild(a)
            a.click()
            a.remove()
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.log("Download gagal: ", error);
            toast.error("Terjadi masalah saat mencoba mendownload submissions")
        } finally { setLoading(false) }
    }
    return (
        <Button
            variant={"default"}
            disabled={loading}
            className="hover:scale-105 transition-all"
            onClick={downloadApproved}>
            <Download className="w-4 h-4 mr-1" /> {loading ? "Loading..." : "Download File Submission"}
        </Button>
    )
}