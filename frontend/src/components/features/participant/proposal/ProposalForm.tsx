'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import axiosInstace from '@/lib/axios'
import { useQueryClient } from '@tanstack/react-query'
import { DashboardData, Proposal } from '@/types/api'

export default function ProposalForm() {
    const [title, setTitle] = useState('')
    const [file, setFile] = useState<File | null>(null)
    const [uploadProgress, setUploadProgress] = useState<number>(0)
    const [dragOver, setDragOver] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const qc = useQueryClient()

    const proposal = qc.getQueryData(["proposal"]) as Proposal

    const [canUpload, setCanUpload] = useState(() => !proposal.title)
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setFile(e.target.files[0])
        }
    }

    const handleSubmit = async () => {
        if (!title || !file) {
            toast.error('Please fill in all fields and upload a file')
            return
        }

        const formData = new FormData()
        formData.append('title', title)
        formData.append('file', file)

        try {
            setIsLoading(true)
            const res = await axiosInstace.post('/proposals', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1))
                    setUploadProgress(percent)
                }
            })

            toast.success('Proposal submitted successfully!')
            setCanUpload(false)
            setTitle('')
            setFile(null)
            setUploadProgress(0)
            qc.invalidateQueries({
                queryKey: ["proposal"]
            })
            qc.invalidateQueries({ queryKey: ["dashboard_participant"] })
        } catch (err: any) {
            console.error(err)
            toast.error(err.response.data.message)
        } finally { setIsLoading(false) }
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

    const dashboard = qc.getQueryData(["dashboard_participant"]) as DashboardData
    const now = new Date()
    now.setHours(0, 0, 0, 0)

    const deadline = new Date(proposal.deadline)
    deadline.setHours(0, 0, 0, 0)

    const isDeadline = now.getTime() > deadline.getTime()

    return (
        <>
            {!dashboard?.verified ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Kirimkan Proposal Baru</CardTitle>
                        <CardDescription>
                            Isi rincian dan unggah dokumen proposal Anda
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-6">
                            <p className="text-muted-foreground mb-4">Tidak bisa upload proposal sekarang, team kamu belum diverifikasi oleh admin KMIPN.</p>
                        </div>
                    </CardContent>
                </Card>
            ) : !isDeadline && canUpload ?
                (
                    <Card>
                        <CardHeader>
                            <CardTitle>Kirimkan Proposal Baru</CardTitle>
                            <CardDescription>
                                Isi rincian dan unggah dokumen proposal Anda
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="proposal-title">Proposal Title</Label>
                                    <Input
                                        id="proposal-title"
                                        placeholder="Enter proposal title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>
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

                                {/* Progress */}
                                {uploadProgress > 0 && (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label>Upload Progress</Label>
                                            <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
                                        </div>
                                        <Progress value={uploadProgress} className="h-2" />
                                    </div>
                                )}

                                <Alert className='bg-blue-50 dark:text-blue-800'>
                                    <AlertCircle className="h-4 w-4 dark:text-blue-800" />
                                    <AlertTitle>Important Note</AlertTitle>
                                    <AlertDescription>
                                        Pastikan proposal kamu mengikuti panduan dan di upload sebelum deadline ({new Date(proposal.deadline).toLocaleDateString('id-ID', {
                                            day: "2-digit",
                                            month: "long",
                                            year: "numeric"
                                        })}).
                                    </AlertDescription>
                                </Alert>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-4">
                            <Button onClick={handleSubmit} disabled={isLoading}>
                                {isLoading ? 'Submitting...' : 'Submit Proposal'}
                            </Button>
                        </CardFooter>
                    </Card>
                ) : (
                    <Card>
                        <CardContent>
                            <div className="flex h-20 justify-center items-center">
                                <p className='text-muted-foreground'>Tidak dapat mengirim proposal untuk saat ini.</p>
                            </div>
                        </CardContent>
                    </Card>
                )
            }
        </>
    )
}