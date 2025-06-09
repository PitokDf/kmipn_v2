import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import axiosInstace from "@/lib/axios";
import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const FILE_SIZE = 100 * 1024 * 1024

export function SubmissionForm() {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [githubUrl, setGithubUrl] = useState('')
    const [file, setFile] = useState<File | null>(null)
    const [error, setError] = useState("");
    const qc = useQueryClient()

    const handleGithubUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setGithubUrl(value);

        const isValid = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/.test(value);
        setError(isValid || value === "" ? "" : "Link harus berupa URL repo GitHub yang valid");
    };

    const [dragOver, setDragOver] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0].size! > FILE_SIZE) {
            toast.error('File terlalu besar (max 100MB)')
            return
        }
        if (e.target.files?.[0].type !== 'application/zip') {
            toast.error('Hanya file ZIP yang diizinkan')
            return
        }
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
            if (droppedFile.type !== 'application/zip') {
                toast.error('Hanya file ZIP yang diizinkan')
                return
            }
            if (droppedFile.size > 100 * 1024 * 1024) {
                toast.error('File terlalu besar (max 100MB)')
                return
            }

            setFile(droppedFile)
        }
    }

    const handleSubmit = async () => {
        if (!title || !description || !file) {
            toast.error('Isi semua isian yang diperlukan')
            return
        }

        const data = new FormData()
        data.append('title', title)
        data.append('description', description)
        data.append('file', file)
        data.append('githubUrl', githubUrl)

        try {
            setIsLoading(true)
            const res = await axiosInstace.post("/submissions", data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            })

            toast.success('Berhasil Menyimpan Submission!')
            setTitle('')
            setFile(null)
            setDescription('')
            setGithubUrl('')
            qc.invalidateQueries({ queryKey: ["submission_preliminary"] })
        } catch (error) {
            console.log(error);
            toast.error('Terjadi masalah saat Menyimpan submission')
        } finally { setIsLoading(false) }
    }
    return (
        <div className="space-y-6">
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Submission Requirements</AlertTitle>
                <AlertDescription>
                    Pengajuan awal Anda harus menyertakan prototipe kerja proyek Anda beserta dokumentasinya.
                </AlertDescription>
            </Alert>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="project-title">Judul Projek</Label>
                    <Input id="project-title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Masukkan judul projek" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="project-description">Deskripsi Projek</Label>
                    <Textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        id="project-description"
                        placeholder="Masukkan deskripsi singkat tentang proyek Anda"
                        rows={4}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="github-link">GitHub Repository (Optional)</Label>
                    <Input
                        value={githubUrl}
                        onChange={handleGithubUrlChange}
                        id="github-link"
                        placeholder="https://github.com/PitokDf/PitokDf" />
                    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                </div>

                <div className="space-y-2">
                    <Label>Unggah File Projek</Label>
                    <label htmlFor="submission-file" className='pt-3'>
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
                                Upload a ZIP file containing your project (max 100MB)
                            </p>
                            <Button variant="outline" size="sm" type="button" className='bg-green-600 hover:bg-green-600/80 text-white hover:text-white'>
                                Select File
                            </Button>
                        </div>
                    </label>
                    <input
                        id="submission-file"
                        type="file"
                        accept=".zip"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </div>
            </div>
            <Button
                className="w-full"
                disabled={isLoading}
                onClick={() => handleSubmit()}>
                {isLoading ? "Menyimpan..." : 'Simpan'}
            </Button>
        </div>
    )
}