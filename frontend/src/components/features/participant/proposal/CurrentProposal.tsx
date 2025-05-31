import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/ui/status-badge";
import { getDashboardParticipantData } from "@/lib/apis/dashboard";
import { getProposalTeam } from "@/lib/apis/proposal";
import { formatTanggal } from "@/lib/formatTanggal";
import { DashboardData } from "@/types/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Eye, FileText, Upload } from "lucide-react";
import Link from "next/link";
import { ReplaceFileProposal } from "./ReplaceFileProposal";

export function CurrentProposal() {
    const qc = useQueryClient()
    const { data: dashboard, isPending } = useQuery({
        queryFn: getDashboardParticipantData,
        queryKey: ["dashboard_participant"],
    })
    // const dashboard = qc.getQueryData(["dashboard_participant"]) as DashboardData

    const { data } = useQuery({
        queryKey: ['proposal'],
        queryFn: getProposalTeam
    })

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <CardTitle>Proposal Saat Ini</CardTitle>
                        <CardDescription>
                            Lihat detail proposal yang Anda kirimkan
                        </CardDescription>
                    </div>
                    <StatusBadge status={data?.status as any} />
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {!dashboard?.verified ? (
                    <div className="text-center py-6">
                        <p className="text-muted-foreground mb-4">Tidak bisa upload proposal sekarang, team kamu belum diverifikasi oleh admin KMIPN.</p>
                    </div>
                ) :
                    data?.title ? (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Judul Proposal</Label>
                                    <div className="font-medium">{data?.title}</div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Submission Date</Label>
                                    <div>{formatTanggal(data.creadAt)}</div>
                                </div>
                            </div>

                            <div className="border rounded-lg p-6 bg-muted/50">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <FileText className="h-6 w-6 mr-2 text-blue-600" />
                                        <div>
                                            <h3 className="font-medium">{data.fileName}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Diupload pada {new Date(data.updatedAt).toLocaleDateString('id-ID', {
                                                    month: "long",
                                                    day: "2-digit",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "numeric",
                                                    hour12: false
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <Link href={data.fileLink} target="_blank">
                                        <Button variant="link">
                                            <Eye />
                                            Lihat
                                        </Button>
                                    </Link>
                                </div>

                                {data?.status === "rejected" && (
                                    <Alert variant="destructive" className="mt-4">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>Proposal Ditolak</AlertTitle>
                                        <AlertDescription>
                                            Proposal Anda ditolak. Harap tinjau komentar di bawah dan kirimkan versi yang telah direvisi.
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {data?.status === "pending" && (
                                    <Alert className="mt-4 bg-blue-100 dark:bg-blue-200/30 text-blue-700 dark:text-blue-200">
                                        <AlertCircle className="h-4 w-4 text-blue-700 dark:text-blue-200" />
                                        <AlertTitle>Sedang Ditinjau</AlertTitle>
                                        <AlertDescription>
                                            Proposal Anda saat ini sedang ditinjau. Anda akan diberi tahu setelah peninjauan selesai.
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            {data?.status === "rejected" && (
                                <div className="space-y-2">
                                    <Label>Reviewer Comments</Label>
                                    <div className="p-4 border rounded-md">
                                        <p>{data.comments}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <p className="text-muted-foreground mb-4">Belum ada proposal yang diupload</p>
                            <Button>Upload proposal sekarang</Button>
                        </div>
                    )}
            </CardContent>
            <CardFooter className="flex justify-end gap-4">
                {data?.title && dashboard?.verified && (
                    <>
                        <ReplaceFileProposal id={data.id} />
                    </>
                )}
            </CardFooter>
        </Card>
    )
}