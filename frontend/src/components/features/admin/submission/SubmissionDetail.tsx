"use client"

import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    Calendar,
    Github,
    FileText,
    Users,
    Trophy,
    ExternalLink,
    Clock,
    CheckCircle2,
    AlertCircle,
    XCircle,
    Hash,
    User,
    FolderOpen,
    Download,
    Eye,
    Activity,
    Info
} from "lucide-react"
import { formatTanggal } from "@/lib/formatTanggal"

interface Submission {
    id: number
    teamId: number
    round: string
    title: string
    githubUrl: string
    fileUrl: string
    fileName: string
    status: string
    createdAt: string
    updatedAt: string
    teamName: string
}

interface SubmissionDetailDialogProps {
    submission: Submission
    isOpen: boolean
    onOpenChange: (open: boolean) => void
}

export function SubmissionDetailDialog({ submission, isOpen, onOpenChange }: SubmissionDetailDialogProps) {
    if (!submission) return null

    const getStatusConfig = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved':
            case 'diterima':
            case 'accepted':
                return {
                    icon: CheckCircle2,
                    color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30',
                    label: 'Diterima',
                    description: 'Pengajuan telah disetujui dan diterima'
                }
            case 'pending':
            case 'menunggu':
            case 'review':
                return {
                    icon: Clock,
                    color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800/30',
                    label: 'Menunggu Review',
                    description: 'Pengajuan sedang dalam proses review'
                }
            case 'rejected':
            case 'ditolak':
                return {
                    icon: XCircle,
                    color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30',
                    label: 'Ditolak',
                    description: 'Pengajuan tidak memenuhi kriteria'
                }
            case 'draft':
                return {
                    icon: FileText,
                    color: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/20 dark:text-gray-400 dark:border-gray-700/30',
                    label: 'Draft',
                    description: 'Pengajuan masih dalam tahap draft'
                }
            default:
                return {
                    icon: AlertCircle,
                    color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30',
                    label: status.charAt(0).toUpperCase() + status.slice(1),
                    description: 'Status pengajuan'
                }
        }
    }

    const getRoundConfig = (round: string) => {
        return round === "preliminary"
            ? {
                label: "Penyisihan",
                color: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30",
                description: "Tahap penyisihan kompetisi"
            }
            : {
                label: "Final",
                color: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800/30",
                description: "Tahap final kompetisi"
            }
    }

    const getFileExtension = (fileName: string) => {
        return fileName.split('.').pop()?.toUpperCase() || 'FILE'
    }

    const getFileSize = (fileName: string) => {
        // Placeholder untuk ukuran file - bisa diintegrasikan dengan API nantinya
        const extensions = fileName.split('.').pop()?.toLowerCase()
        switch (extensions) {
            case 'pdf': return '~2.5 MB'
            case 'doc':
            case 'docx': return '~1.8 MB'
            case 'ppt':
            case 'pptx': return '~3.2 MB'
            default: return 'Unknown'
        }
    }

    const calculateDaysSinceCreation = (createdAt: string) => {
        const created = new Date(createdAt)
        const now = new Date()
        const diffTime = Math.abs(now.getTime() - created.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays
    }

    const calculateDaysSinceUpdate = (updatedAt: string) => {
        const updated = new Date(updatedAt)
        const now = new Date()
        const diffTime = Math.abs(now.getTime() - updated.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays
    }

    const statusConfig = getStatusConfig(submission.status)
    const roundConfig = getRoundConfig(submission.round)
    const StatusIcon = statusConfig.icon
    const daysSinceCreation = calculateDaysSinceCreation(submission.createdAt)
    const daysSinceUpdate = calculateDaysSinceUpdate(submission.updatedAt)

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <DialogHeader className="space-y-4 pb-4">
                    <div className="flex items-start justify-between">
                        <div className="space-y-2">
                            <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                <Info className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                Detail Pengajuan
                            </DialogTitle>
                            <DialogDescription className="text-base text-slate-600 dark:text-slate-400">
                                Informasi lengkap submission dari tim{" "}
                                <span className="font-semibold text-slate-700 dark:text-slate-300">{submission.teamName}</span>
                            </DialogDescription>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Badge variant="outline" className={roundConfig.color}>
                                <Trophy className="w-3 h-3 mr-1" />
                                {roundConfig.label}
                            </Badge>
                            <Badge variant="outline" className={statusConfig.color}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusConfig.label}
                            </Badge>
                        </div>
                    </div>

                    {/* Status Description */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 border-l-4 border-blue-500 dark:border-blue-400 p-4 rounded-r-lg">
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                            <strong>Status:</strong> {statusConfig.description}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                            <strong>Ronde:</strong> {roundConfig.description}
                        </p>
                    </div>
                </DialogHeader>

                <Separator className="dark:bg-gray-800" />

                <div className="space-y-8">
                    {/* Identifikasi & Metadata */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                            <Hash className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                            <div>
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Submission ID</p>
                                <p className="text-lg font-bold text-slate-900 dark:text-slate-100">#{submission.id}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                            <User className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                            <div>
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Team ID</p>
                                <p className="text-lg font-bold text-slate-900 dark:text-slate-100">#{submission.teamId}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                            <Activity className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                            <div>
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Aktivitas</p>
                                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                    {daysSinceUpdate === 0 ? 'Hari ini' : `${daysSinceUpdate} hari lalu`}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Informasi Tim & Proyek */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            <FolderOpen className="w-5 h-5" />
                            Informasi Proyek
                        </h3>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl border border-blue-200 dark:border-blue-800/30">
                                    <div className="flex items-start space-x-4">
                                        <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                                            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">Tim Peserta</h4>
                                            <p className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-1">{submission.teamName}</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                Terdaftar sejak {formatTanggal(submission.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl border border-green-200 dark:border-green-800/30">
                                    <div className="flex items-start space-x-4">
                                        <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-lg">
                                            <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">Judul Proyek</h4>
                                            <p className="text-lg font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                                                {submission.title}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl border border-purple-200 dark:border-purple-800/30">
                                    <div className="flex items-start space-x-4">
                                        <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                                            <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">Timeline</h4>
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-slate-600 dark:text-slate-400">Dibuat:</span>
                                                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                                        {formatTanggal(submission.createdAt)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-slate-600 dark:text-slate-400">Update terakhir:</span>
                                                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                                        {formatTanggal(submission.updatedAt)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center pt-2 border-t border-purple-200 dark:border-purple-800/50">
                                                    <span className="text-sm text-slate-600 dark:text-slate-400">Durasi pengerjaan:</span>
                                                    <span className="text-sm font-bold text-purple-700 dark:text-purple-400">
                                                        {daysSinceCreation} hari
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator className="dark:bg-gray-800" />

                    {/* File & Repository Section */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            <Download className="w-5 h-5" />
                            File & Repository
                        </h3>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* File Pengajuan */}
                            <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-xl border border-orange-200 dark:border-orange-800/30">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-3 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                                            <FileText className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">File Pengajuan</h4>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">Dokumen utama submission</p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800/30">
                                        {getFileExtension(submission.fileName)}
                                    </Badge>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-600 dark:text-slate-400">Nama file:</span>
                                        <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-48" title={submission.fileName}>
                                            {submission.fileName}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-600 dark:text-slate-400">Estimasi ukuran:</span>
                                        <span className="font-medium text-slate-800 dark:text-slate-200">{getFileSize(submission.fileName)}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-4">
                                    <Button asChild className="flex-1 bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600">
                                        <a
                                            href={`https://drive.google.com/uc?export=download&id=${submission.fileUrl.match(/\/d\/(.+?)\//)?.[1]}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2"
                                        >
                                            <Download className="w-4 h-4" />
                                            Download
                                        </a>
                                    </Button>
                                    <Button asChild variant="outline" className="flex-1 border-orange-200 dark:border-orange-800/30 hover:bg-orange-50 dark:hover:bg-orange-950/20">
                                        <a
                                            href={submission.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2"
                                        >
                                            <Eye className="w-4 h-4" />
                                            Preview
                                        </a>
                                    </Button>
                                </div>
                            </div>

                            {/* GitHub Repository */}
                            {submission.githubUrl ? (
                                <div className="p-6 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 rounded-xl border border-gray-200 dark:border-gray-700/30">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-3 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
                                                <Github className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Source Code</h4>
                                                <p className="text-sm text-slate-600 dark:text-slate-400">Repository GitHub proyek</p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400 dark:border-gray-700/30">
                                            REPO
                                        </Badge>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-600 dark:text-slate-400">Platform:</span>
                                            <span className="font-medium text-slate-800 dark:text-slate-200">GitHub</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-600 dark:text-slate-400">Repository URL:</span>
                                            <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-48" title={submission.githubUrl}>
                                                {submission.githubUrl.replace('https://github.com/', '').replace('https://', '')}
                                            </span>
                                        </div>
                                    </div>

                                    <Button asChild className="w-full mt-4 bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600">
                                        <a
                                            href={submission.githubUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2"
                                        >
                                            <Github className="w-4 h-4" />
                                            Lihat Repository
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </Button>
                                </div>
                            ) : (
                                <div className="p-6 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 rounded-xl border border-gray-200 dark:border-gray-700/30 opacity-60">
                                    <div className="flex items-center justify-center h-full text-center space-y-3 flex-col">
                                        <Github className="w-12 h-12 text-gray-400 dark:text-gray-600" />
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-500 dark:text-gray-400">Repository Tidak Tersedia</h4>
                                            <p className="text-sm text-gray-400 dark:text-gray-500">Tim belum menyertakan link GitHub repository</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <DialogFooter className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex justify-between w-full items-center">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Submission ID: #{submission.id} • Team ID: #{submission.teamId}
                        </p>
                        <Button variant="outline" onClick={() => onOpenChange(false)} className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                            Tutup Detail
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}