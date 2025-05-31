import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { replaceFileProposal } from "@/lib/apis/proposal";
import { useQueryClient } from "@tanstack/react-query";
import { Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ReplaceFileProposal({ id }: { id: number }) {
    const [file, setFile] = useState<File | null>(null)
    const [dragOver, setDragOver] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setFile(e.target.files[0])
        }
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setDragOver(true)
    }

    const handleDragLeave = () => {
        setDragOver(false)
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setDragOver(false)

        const droppedFile = e.dataTransfer.files?.[0]
        if (droppedFile) {
            if (droppedFile.type !== 'application/pdf') {
                toast.error('Only PDF files are allowed')
                return
            }
            if (droppedFile.size > 10 * 1024 * 1024) {
                toast.error('File too large (max 10MB)')
                return
            }

            setFile(droppedFile)
        }
    }

    const qc = useQueryClient()

    const handleSubmit = async () => {
        if (!file) {
            toast.error('Mohon pilih file')
            return
        }

        const formData = new FormData()
        formData.append('file', file)

        try {
            setIsLoading(true)
            await replaceFileProposal(id, formData)
            toast.success('File proposal berhasil diganti!')
            setFile(null)
            qc.invalidateQueries({ queryKey: ["proposal"] })
            qc.invalidateQueries({ queryKey: ["dashboard_participant"] })
        } catch (err: any) {
            console.error(err)
            toast.error(err.response.data.message || "Terjadi masalah pada server, mohon caba lagi")
        } finally { setIsLoading(false) }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default" className="bg-orange-500 text-white hover:bg-orange-500/80">Replace File</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload New Proposal</DialogTitle>
                    <DialogDescription>
                        Upload a new version of your data?. This will replace the current file.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-2">
                    <Label>Unggah Dokumen Proposal</Label>
                    <label htmlFor="proposal-file" className='pt-3'>
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${dragOver ? 'bg-muted/30 border-primary' : 'hover:bg-muted/50'}`}
                        >
                            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm font-medium mb-1">
                                {file ? file.name : 'Drag & drop your file here'}
                            </p>
                            <p className="text-xs text-muted-foreground mb-4">
                                Supports PDF files up to 10MB
                            </p>
                            <Button variant="outline" size="sm" type="button" className='bg-green-600 hover:bg-green-600/80 text-white hover:text-white'>
                                Select File
                            </Button>
                        </div>
                    </label>
                    <input
                        id="proposal-file"
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </div>

                <DialogFooter>
                    <Button type="button" disabled={isLoading} onClick={() => { handleSubmit() }}>{isLoading ? "Menyimpan..." : "Upload & Replace"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}